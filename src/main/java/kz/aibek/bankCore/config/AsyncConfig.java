package kz.aibek.bankCore.config;


import lombok.extern.slf4j.Slf4j;
import org.hibernate.audit.spi.AuditEntityLoader;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

@Configuration
@EnableAsync
@EnableScheduling
@Slf4j
public class AsyncConfig {

    @Bean(name = "auditExecutor")
    public Executor auditExecutor(){
        return new ThreadPoolExecutor(
                2,
                5,
                30L,
                TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(500),

                new ThreadFactory(){
                    private final AtomicInteger counter = new AtomicInteger(0);
                    @Override
                    public Thread newThread(Runnable r){
                        return new Thread(r,"audit-thread-" + counter.getAndIncrement());
                    }
                },
                new ThreadPoolExecutor.CallerRunsPolicy()
        );
    }

}
