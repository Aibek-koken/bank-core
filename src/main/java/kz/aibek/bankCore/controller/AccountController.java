package kz.aibek.bankCore.controller;


import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import kz.aibek.bankCore.dto.AccountResponse;
import kz.aibek.bankCore.dto.ApiResponse;
import kz.aibek.bankCore.dto.CreateAccountRequest;
import kz.aibek.bankCore.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<ApiResponse<AccountResponse>> create(@Valid @RequestBody CreateAccountRequest request){
        var account = accountService.createAccount(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Счет успешно создан",account));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountResponse>> getById(@PathVariable Long id){
        var account = accountService.getAccount(id);
        return ResponseEntity.ok(ApiResponse.ok("Счет найден", account));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAll(){
        var accounts = accountService.getAllAccount();
        return ResponseEntity.ok(ApiResponse.ok("Список счетов получен",accounts));
    }

}
