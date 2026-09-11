package kz.aibek.bankCore.service;

import org.springframework.transaction.annotation.Transactional;
import kz.aibek.bankCore.domain.Account;
import kz.aibek.bankCore.domain.AccountStatus;
import kz.aibek.bankCore.dto.AccountResponse;
import kz.aibek.bankCore.dto.CreateAccountRequest;
import kz.aibek.bankCore.exception.AccountNotFoundException;
import kz.aibek.bankCore.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;

    @Transactional
    public AccountResponse createAccount(CreateAccountRequest request){

        String accountNumber = "KZ" + System.currentTimeMillis();

        var account = Account.builder()
                .accountNumber(accountNumber)
                .ownerName(request.ownerName())
                .balance(request.initialBalance())
                .status(AccountStatus.ACTIVE)
                .build();

        var saved = accountRepository.save(account);
        log.info("Создан новы счет: {} для {} ",accountNumber, request.ownerName());
        return AccountResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public AccountResponse getAccount(Long id){
        var account = accountRepository.findById(id).orElseThrow(()-> new AccountNotFoundException(id));
        return AccountResponse.from(account);
    }

    @Transactional(readOnly = true)
    public List<AccountResponse> getAllAccount(){
        return accountRepository.findAll().stream().map(AccountResponse::from).toList();
    }
}
