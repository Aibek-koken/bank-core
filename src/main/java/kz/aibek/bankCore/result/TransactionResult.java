package kz.aibek.bankCore.result;

import kz.aibek.bankCore.domain.Transaction;

import java.util.Collection;

public sealed interface TransactionResult permits TransactionResult.Success, TransactionResult.Failure {
    record Success(Transaction transaction) implements TransactionResult{}
    record Failure(String reason) implements TransactionResult{}

    static TransactionResult success(Transaction tx){return new Success(tx); }
    static TransactionResult failure(String reason){return new Failure(reason); }

}
