package kz.aibek.bankCore.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI bankCoreOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("BankCore API")
                        .description("Минималистичный банковский бэкенд с упором на Java Concurrency (ReentrantLock, Semaphore, Virtual Threads)")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Aibek")
                                .email("zharylkassynaibek@gmail.com")
                        )
                );
    }
}