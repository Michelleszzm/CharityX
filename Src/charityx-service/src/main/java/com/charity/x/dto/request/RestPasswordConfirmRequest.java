package com.charity.x.dto.request;

import com.charity.x.dto.ResultCode;
import com.charity.x.exception.BusinessException;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * @Author: Lucass @Date: 2025/11/13 10:01 @Description:
 */
@Data
public class RestPasswordConfirmRequest {

    @NotNull(message = "token can not be null")
    @Schema(description = "token",requiredMode = Schema.RequiredMode.REQUIRED)
    private String token;

    @Email(message = "email format is incorrect")
    @Schema(description = "email",requiredMode = Schema.RequiredMode.REQUIRED,example = "2295471337@qq.com")
    private String email;

    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$",
            message = "Password must be 8+ chars with upper, lower, and number")
    @Schema(description = "password",requiredMode = Schema.RequiredMode.REQUIRED)
    private String password;

    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$",
            message = "Password must be 8+ chars with upper, lower, and number")
    @Schema(description = "confirm password",requiredMode = Schema.RequiredMode.REQUIRED)
    private String confirmPassword;

    public void validate() {
        if (!password.equals(confirmPassword)) {
            throw new BusinessException(ResultCode.PARAM_ERROR.getCode(),"Password and confirm password are not the same");
        }
    }
}
