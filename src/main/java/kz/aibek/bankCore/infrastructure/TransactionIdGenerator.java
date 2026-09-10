package kz.aibek.bankCore.infrastructure;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicLong;



@Component
public class TransactionIdGenerator {
    private final AtomicLong sequence = new AtomicLong(System.currentTimeMillis());
    public long next(){
        return sequence.incrementAndGet();
    }
    public long current(){
        return sequence.get();
    }
}
