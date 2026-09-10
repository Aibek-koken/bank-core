package kz.aibek.bankCore.infrastructure;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantLock;

@Slf4j
@Component
public class AccountLockManager {
    private final ConcurrentHashMap<Long, ReentrantLock> lockMap = new ConcurrentHashMap<>();
    private AtomicInteger countOfLocks = new AtomicInteger(0);
    private AtomicInteger activeLocks = new AtomicInteger(0);

    public void incrementCounter(){
        countOfLocks.incrementAndGet();
    }

    public ReentrantLock getLock(Long accountId){
        return lockMap.computeIfAbsent(accountId, id-> {
            log.debug("Создаем новый замок для счета {}",id);

            return new ReentrantLock(true);
        });
    }

    @Scheduled(fixedDelay = 60000)
    public void cleanupIdleLocks(){
        lockMap.entrySet().removeIf(entry-> !entry.getValue().isLocked());
    }

    public AtomicInteger getActiveLockCount(){
        return activeLocks;
    }
    public AtomicInteger getTotalLocksCreated(){
        return countOfLocks;
    }

}
