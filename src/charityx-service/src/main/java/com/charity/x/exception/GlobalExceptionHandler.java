package com.charity.x.exception;

import com.charity.x.dto.Result;
import com.charity.x.dto.ResultCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * @Author: Lucass @Date: 2025/11/5 17:39 @Description:
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result handleValidationException(MethodArgumentNotValidException ex) {
        // Get first error message
        String errorMsg = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .orElse(ResultCode.PARAM_ERROR.getMessage());
        return Result.error(ResultCode.PARAM_ERROR, errorMsg);
    }

    @ExceptionHandler(BusinessException.class)
    public Result handleBusinessException(BusinessException ex) {
        log.warn("Business exception: code:{}, message:{}",ex.getCode(), ex.getMessage());
        return Result.error(ex.getCode(), ex.getMessage());
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public Result<?> handleUsernameNotFoundException(UsernameNotFoundException e) {
        log.warn("Username not found: {}", e.getMessage());
        return Result.error(ResultCode.BUSINESS_EMAIL_IS_NOT_REGISTERED_ERROR);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public Result<?> handleBadCredentialsException(BadCredentialsException e) {
        log.warn("Bad credentials: {}", e.getMessage());
        return Result.error(ResultCode.BUSINESS_EMAIL_PASSWORD_INVALID_ERROR);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public Result<?> handleAccessDeniedException(AccessDeniedException e) {
        log.warn("Access denied: {}", e.getMessage());
        return Result.error(ResultCode.UNAUTHORIZED.getCode(),"Forbidden: Insufficient permission");
    }

    @ExceptionHandler(RuntimeException.class)
    public Result<?> handleRuntimeException(RuntimeException e) {
        log.error("Runtime exception: {}", e.getMessage(), e);
        return Result.error(ResultCode.ERROR, e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public Result<?> handleException(Exception e) {
        log.error("Unexpected error: {}", e.getMessage(), e);
        return Result.error(ResultCode.ERROR);
    }
}
