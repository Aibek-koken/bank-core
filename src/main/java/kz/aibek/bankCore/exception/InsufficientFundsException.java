package kz.aibek.bankCore.exception;

import java.math.BigDecimal;

public class InsufficientFundsException extends RuntimeException{
    public InsufficientFundsException(Long accountId, BigDecimal required, BigDecimal avilable){
        super("Не достаточно средств на счете %d: требуется=%s, доступно=%s".formatted(accountId, required, avilable));
    }

}
