package kz.aibek.bankCore.repository;

import kz.aibek.bankCore.domain.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByAccountIdOrderByCreatedAtDesc(Long accountId);
}