package kz.aibek.bankCore.dto;

import kz.aibek.bankCore.domain.Account;
import kz.aibek.bankCore.domain.AccountStatus;

import java.math.BigDecimal;

public record AccountResponse (
        Long id,
        String accountnumber,
        String ownerName,
        BigDecimal balance,
        AccountStatus status
){
    public static AccountResponse from(Account a){
        return new AccountResponse(a.getId(), a.getAccountNumber(),a.getOwnerName(),a.getBalance(),a.getStatus());
    }
}
