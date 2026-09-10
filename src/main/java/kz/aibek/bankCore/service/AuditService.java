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

@Slf4j
@Service
public class AuditService {


    private final Executor auditExecutor;
    private final AuditLogRepository auditLogRepository;

    public AuditService(@Qualifier("auditExecutor") Executor auditExecutor,
                        AuditLogRepository auditLogRepository) {
        this.auditExecutor = auditExecutor;
        this.auditLogRepository = auditLogRepository;
    }

    public void  logAsync(String action, Long accountId, String details){
        CompletableFuture.runAsync(()->{
            var logEntry = AuditLog.builder()
                    .action(action)
                    .accountId(accountId)
                    .details(details)
                    .threadName(Thread.currentThread().getName())
                    .build();
            auditLogRepository.save(logEntry);
            log.info("[AUDIT] {} для счета {}: {}", action, accountId, details);
        },auditExecutor).exceptionally(ex-> {
            log.error("Ошибка записи аудита: {}", ex.getMessage());
            return null;
        });
    }

}
