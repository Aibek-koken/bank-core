package kz.aibek.bankCore.controller;


import jakarta.validation.Valid;
import kz.aibek.bankCore.domain.Transaction;
import kz.aibek.bankCore.dto.ApiResponse;
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
    public ResponseEntity<ApiResponse<?>> transfer(@Valid @RequestBody TransferRequest request){
        log.info("Запрос перевода: от {} к {} на сумму {}",
                request.fromAccountId(), request.toAccountId(), request.amount());
        var result = transferService.transfer(request);

        return switch(result){
            case TransactionResult.Success s -> ResponseEntity.ok(ApiResponse.ok("Перевод успешно заверщен",toDto(s.transaction())));
            case TransactionResult.Failure f -> ResponseEntity.badRequest().body(ApiResponse.error(f.reason()));
        };
    }
    record TransactionDto(Long id, Long from, Long to, String amount, String status){}

    private TransactionDto toDto(Transaction tx){
        return new TransactionDto(
                tx.getId(),
                tx.getFromAccountId(),
                tx.getToAccountId(),
                tx.getAmount().toString(),
                tx.getStatus().name()
        );
    }

}
