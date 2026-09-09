package kz.aibek.bankCore.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record TransferRequest (
        @NotNull Long fromAccountId,
        @NotNull Long toAccountId,
        @NotNull @DecimalMin("0.01") BigDecimal amount,
        String description
){
    public TransferRequest{
        if(fromAccountId.equals(toAccountId)){
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }
    }
}
