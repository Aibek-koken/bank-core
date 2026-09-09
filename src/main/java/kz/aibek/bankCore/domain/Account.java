package kz.aibek.bankCore.domain;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "accounts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String accountNumber;

    private String ownerName;

    @Column(precision = 19, scale = 4)
    private BigDecimal balance;

    @Enumerated(EnumType.STRING)
    private AccountStatus status;

    public boolean hasSufficientBalance(BigDecimal amount){
        return balance.compareTo(amount)>=0;
    }
    public boolean isActive(){
        return status == AccountStatus.ACTIVE;
    }
}
