package kz.aibek.bankCore.repository;

import kz.aibek.bankCore.domain.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}
