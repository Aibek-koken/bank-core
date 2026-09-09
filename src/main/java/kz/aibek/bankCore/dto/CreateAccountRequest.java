package kz.aibek.bankCore.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;


public record CreateAccountRequest(
        @NotBlank String ownerName,
        @NotNull @DecimalMin("0.0") BigDecimal initialBalance
) {}
