package kz.aibek.bankCore.infrastructure;

import java.util.concurrent.atomic.AtomicLong;

public class TransactionIdGenerator {
    private final AtomicLong sequence = new AtomicLong(System.currentTimeMillis());
    public long next(){
        return sequence.incrementAndGet();
    }
    public long current(){
        return sequence.get();
    }
}
