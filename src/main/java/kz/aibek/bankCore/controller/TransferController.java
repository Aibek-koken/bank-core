package kz.aibek.bankCore.controller;


import jakarta.validation.Valid;
import kz.aibek.bankCore.dto.TransferRequest;
import kz.aibek.bankCore.result.TransactionResult;
import kz.aibek.bankCore.service.TransferService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/transfers")
@RequiredArgsConstructor
public class TransferController {
    private final TransferService transferService;

    @PostMapping
    public ResponseEntity<?> transfer(@Valid @RequestBody TransferRequest request){
        log.info("Запрос перевода: от {} к {} на сумму {}",
                request.fromAccountId(), request.toAccountId(), request.amount());
        TransactionResult result = transferService.transfer(request);
        return switch(result){
            case TransactionResult.Success s -> ResponseEntity.ok().body("Успех! Id транзакции: " + s.transaction().getId());
            case TransactionResult.Failure f -> ResponseEntity.badRequest().body("Ошибка: " + f.reason());
        };
    }

}
