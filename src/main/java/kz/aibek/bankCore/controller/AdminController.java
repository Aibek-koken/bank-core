package kz.aibek.bankCore.controller;


import kz.aibek.bankCore.infrastructure.AccountLockManager;
import kz.aibek.bankCore.infrastructure.FeatureFlagService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final FeatureFlagService featureFlag;
    private final AccountLockManager lockManager;

    @PostMapping("/transfer/toggle")
    public String toggleTransfers(@RequestParam boolean enable){
        featureFlag.setTransfersEnabled(enable);
        return "Переводы " + (enable ? "включен" : "отключен");
    }
    @GetMapping("/status")
    public Map<String,Object> getStatus(){
        return Map.of(
                "transferEnable",featureFlag.isTransfersEnabled(),
                "activeLocksCount", lockManager.getActiveLockCount(),
                "totalLocksCreated", lockManager.getTotalLocksCreated()
        );
    }
}
