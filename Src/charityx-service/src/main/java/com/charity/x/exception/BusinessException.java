package com.charity.x.exception;

import com.charity.x.dto.ResultCode;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @Author: Lucass @Date: 2025/11/6 11:44 @Description:
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class BusinessException extends RuntimeException{

    private Integer code;

    private String message;

    public BusinessException(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public BusinessException(ResultCode resultCode) {
        this.code = resultCode.getCode();
        this.message = resultCode.getMessage();
    }
}
