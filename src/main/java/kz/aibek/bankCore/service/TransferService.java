package kz.aibek.bankCore.service;


import jakarta.transaction.Transactional;
import kz.aibek.bankCore.domain.Transaction;
import kz.aibek.bankCore.domain.TransactionStatus;
import kz.aibek.bankCore.dto.TransferRequest;
import kz.aibek.bankCore.exception.AccountNotFoundException;
import kz.aibek.bankCore.exception.InsufficientFundsException;
import kz.aibek.bankCore.infrastructure.AccountLockManager;
import kz.aibek.bankCore.infrastructure.FeatureFlagService;
import kz.aibek.bankCore.infrastructure.TransactionIdGenerator;
import kz.aibek.bankCore.repository.AccountRepository;
import kz.aibek.bankCore.repository.TransactionRepository;
import kz.aibek.bankCore.result.TransactionResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransferService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final AccountLockManager lockManager;
    private final AuditService auditService;
    private final FeatureFlagService featureFlags;
    private final TransactionIdGenerator idGenerator;

    private final Semaphore transferSemaphore = new Semaphore(100);

    public TransactionResult transfer(TransferRequest request){
        if(!featureFlags.isTransfersEnabled()){
            return TransactionResult.failure("Переводы временно отключены");
        }
        try{
            if(!transferSemaphore.tryAcquire(3, TimeUnit.SECONDS)){
                return TransactionResult.failure("");
            }
        } catch(InterruptedException e){
            Thread.currentThread().interrupt();
            return TransactionResult.failure("Запрос прерван");
        }
        try{
            return lockAndExecute(request);
        }finally{
            transferSemaphore.release();
        }
    }
    private TransactionResult lockAndExecute(TransferRequest request) {
        Long fromId  = request.fromAccountId();
        Long toId = request.toAccountId();

        long firstId = Math.min(fromId, toId);
        long secondId = Math.max(fromId, toId);

        ReentrantLock firstLock = lockManager.getLock(firstId);
        ReentrantLock secondLock = lockManager.getLock(secondId);

        try{
            if(firstLock.tryLock(5, TimeUnit.SECONDS)){
                try{
                    if(secondLock.tryLock(5,TimeUnit.SECONDS)){
                        try{
                            return executeInTransaction(request);
                        }finally{
                            secondLock.unlock();
                        }
                    }
                }finally {
                    firstLock.unlock();
                }
            }

        }catch(InterruptedException e){
            Thread.currentThread().interrupt();
        }
        return TransactionResult.failure("Не Удалось заблокировать сета(Timeout)");
    }
    @Transactional
    protected TransactionResult executeInTransaction(TransferRequest request){
        var from = accountRepository.findById(request.fromAccountId()).orElseThrow(() -> new AccountNotFoundException(request.fromAccountId()));
        var to = accountRepository.findById(request.toAccountId()).orElseThrow(() -> new AccountNotFoundException(request.toAccountId()));

        if(!from.isActive() || !to.isActive()){
            return TransactionResult.failure("Один из счетов не активен");
        }
        if(!from.hasSufficientBalance(request.amount())){
            throw new InsufficientFundsException(from.getId(),request.amount(),from.getBalance());
        }

        from.setBalance(from.getBalance().subtract(request.amount()));
        to.setBalance(to.getBalance().add(request.amount()));

        accountRepository.save(from);
        accountRepository.save(to);

        var tx = Transaction.builder()
                .id(idGenerator.next())
                .fromAccountId(from.getId())
                .toAccountId(to.getId())
                .amount(request.amount())
                .status(TransactionStatus.COMPLETED)
                .type("TRANSFER")
                .build();
        transactionRepository.save(tx);

        auditService.logTransferAsync(from.getId(), to.getId(), request.amount().toString());
        return TransactionResult.success(tx);

    }

}
