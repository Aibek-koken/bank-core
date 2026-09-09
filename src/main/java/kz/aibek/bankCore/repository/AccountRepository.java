package kz.aibek.bankCore.repository;

import kz.aibek.bankCore.domain.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
}
