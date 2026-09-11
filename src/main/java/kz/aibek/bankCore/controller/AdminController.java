package kz.aibek.bankCore.controller;


import kz.aibek.bankCore.dto.ApiResponse;
import kz.aibek.bankCore.infrastructure.AccountLockManager;
import kz.aibek.bankCore.infrastructure.FeatureFlagService;
import kz.aibek.bankCore.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AuditService auditService;
    private final FeatureFlagService featureFlag;
    private final AccountLockManager lockManager;

    @PostMapping("/transfer/toggle")
    public ApiResponse<Void> toggleTransfers(@RequestParam boolean enable){
        featureFlag.setTransfersEnabled(enable);
        return ApiResponse.ok("Переводы " + (enable ? "включен" : "отключен"),null);
    }

    @GetMapping("/status")
    public ApiResponse<Map<String,Object>> getStatus(){

        Map<String, Object> status = Map.of("transferEnable",featureFlag.isTransfersEnabled(),
                "activeLocksCount", lockManager.getActiveLockCount(),
                "totalLocksCreated", lockManager.getTotalLocksCreated());
        return ApiResponse.ok("Статус системы", status);
    }

    @GetMapping("/audit/{accountId}/summary")
    public ApiResponse<String> getAuditSsummary(@PathVariable Long accountId){
        String summary = auditService.getAuditSummaryAsync(accountId).join();
        return ApiResponse.ok("Сводка аудита успешна сгенерирована", summary);
    }
}
