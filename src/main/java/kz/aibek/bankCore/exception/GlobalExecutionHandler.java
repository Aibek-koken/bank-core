package kz.aibek.bankCore.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.NoSuchElementException;

@Slf4j
@RestControllerAdvice
public class GlobalExecutionHandler {
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<?> handleNoSuchFound(NoSuchElementException ex){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Счет не найден в БД");
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidation(MethodArgumentNotValidException ex){
        return ResponseEntity.badRequest().body("Ошибка валидации данных");
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneral(Exception ex){
        log.error("Критическая ошибка",ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Внутриення Ошибка сервера");
    }
}
