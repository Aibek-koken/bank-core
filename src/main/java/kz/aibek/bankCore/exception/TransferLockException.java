package kz.aibek.bankCore.exception;

public class TransferLockException extends RuntimeException {
    public TransferLockException(String message){
        super(message);
    }
}
