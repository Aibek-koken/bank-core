package kz.aibek.bankCore.service;

import kz.aibek.bankCore.repository.AuditLogRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import kz.aibek.bankCore.domain.AuditLog;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.stream.Collectors;

import static java.nio.file.attribute.AclEntryType.AUDIT;

@Slf4j
@Service
public class AuditService {

    public AuditService(@Qualifier("auditExecutor") Executor auditExecutor,
                        AuditLogRepository auditLogRepository) {
        this.auditExecutor = auditExecutor;
        this.auditLogRepository = auditLogRepository;
    }

    @Qualifier("auditExecutor")
    private final Executor auditExecutor;

    private final AuditLogRepository auditLogRepository;

    public CompletableFuture<Void> logAsync(String action, Long accountId, String details){
        return CompletableFuture.runAsync(() ->{
            var logEntry = AuditLog.builder()
                    .action(action)
                    .accountId(accountId)
                    .details(details)
                    .threadName(Thread.currentThread().getName())
                    .build();
            auditLogRepository.save(logEntry);
            log.info("[AUDIT] {} для счета {}: {}", action, accountId, details);
        },auditExecutor).exceptionally(ex -> {
            log.error("Ошибка записи аудита: {}", ex.getMessage());
            return null;
        });
    }
    public CompletableFuture<Void> logTransferAsync(long fromId, long toId, String amount){
        CompletableFuture<Void> fromLog = logAsync("DEBIT", fromId, "Списание: " + amount);
        CompletableFuture<Void> toLog = logAsync("CREDIT", toId, "Пополнение: " + amount);
        return CompletableFuture.allOf(fromLog,toLog);
    }


    public CompletableFuture<String> getAuditSummaryAsync(Long accountId){
        return CompletableFuture.supplyAsync(() ->
                auditLogRepository.findByAccountIdOrderByCreatedAtDesc(accountId),auditExecutor)
                .thenApply(logs -> logs.stream().collect(Collectors.groupingBy(AuditLog::getAction,Collectors.counting())))
                .thenApply(counts -> {
                    StringBuilder sb = new StringBuilder("Сводка по счету "+ accountId + ": ");
                    counts.forEach((action, count) -> sb.append(action).append("=").append(count).append(" "));
                    return sb.toString();
                })
                .exceptionally(ex -> "Ошибка генерации сводки: " + ex.getMessage());
    }



}
