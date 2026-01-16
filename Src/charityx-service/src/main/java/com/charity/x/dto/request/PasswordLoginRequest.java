package com.charity.x.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * @Author: Lucass @Date: 2025/11/6 10:49 @Description:
 */
@Data
public class PasswordLoginRequest{

    @Email(message = "email format is incorrect")
    @Schema(description = "email",requiredMode = Schema.RequiredMode.REQUIRED,example = "2295471337@qq.com")
    private String email;

    @Pattern(
      regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$",
      message = "Password must be 8+ chars with upper, lower, and number")
    private String password;
}
