package kz.aibek.bankCore.controller;


import kz.aibek.bankCore.dto.AccountResponse;
import kz.aibek.bankCore.dto.CreateAccountRequest;
import kz.aibek.bankCore.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<AccountResponse> create(@RequestBody CreateAccountRequest request){
        AccountResponse response = accountService.createAccount(request);
        return ResponseEntity.ok(response);
    }

}
