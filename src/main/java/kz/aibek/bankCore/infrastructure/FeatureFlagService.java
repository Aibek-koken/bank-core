package kz.aibek.bankCore.infrastructure;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class FeatureFlagService {
    private volatile boolean transfersEnabled = true;
    public boolean isTransfersEnabled(){
        return transfersEnabled;
    }
    public void setTransfersEnabled(boolean enabled){
        log.warn("флаг переводов изменен на: {}",enabled);
        transfersEnabled = enabled;
    }

}
