package kz.aibek.bankCore.infrastructure;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

@Slf4j
@Component
public class AccountLockManager {
    private final ConcurrentHashMap<Long, ReentrantLock> lockMap = new ConcurrentHashMap<>();

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
}
