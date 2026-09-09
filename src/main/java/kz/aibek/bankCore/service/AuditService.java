package kz.aibek.bankCore.service;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.hibernate.audit.AuditLog;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditService {

    @Qualifier("auditExecutor")
    private final Executor auditExecutor;

    public void  logAudit(String action, Long accountId, String details){
        CompletableFuture.runAsync(()->{
            var logEntry = AuditLog.builder()
                    .action(action)
                    .accountId(accountId)
                    .details(details)
                    .ThreadName(Thread.currentThread().getName())
                    .built();
            log.info("[AUDIT] {} для счета {}: {}", action, accountId, details);
        },auditExecutor).exceptionally(ex-> {
            log.error("Ошибка записи аудита: {}", ex.getMessage());
            return null;
        });
    }

}
