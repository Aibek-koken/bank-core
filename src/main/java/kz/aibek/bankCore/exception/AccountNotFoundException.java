package kz.aibek.bankCore.exception;

public class AccountNotFoundException extends RuntimeException{
    public AccountNotFoundException(Long id){
        super("Счет не найден: " + id);
    }
}
