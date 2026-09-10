package kz.aibek.bankCore.repository;

import kz.aibek.bankCore.domain.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {

    @Query(value = """
                SELECT a.*
                FROM accounts a
                WHERE a.balance > :minBalance
                                AND a.status = 'ACTIVE'
                ORDER BY a.balance DESC
                """,nativeQuery = true)
    List<Account> findActiveAccountsWithMinBalance(@Param("minBalance") BigDecimal minBalance);
}
