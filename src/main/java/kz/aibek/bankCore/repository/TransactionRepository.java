package kz.aibek.bankCore.repository;

import kz.aibek.bankCore.domain.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query(value = """
            SELECT t.*
            FROM transactions t 
            WHERE t.from_account_id = :accountId
               Or t.to_account_id   = :accountId
            ORDER BY t.creates_at DESC 
            LIMIT :limit              
            """,nativeQuery = true)
    List<Transaction> findByAccountId(@Param("accountId") Long accountId, @Param("limit") int limit);
}
