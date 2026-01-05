package com.charity.x.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * @Author: Lucass @Date: 2025/11/6 10:49 @Description:
 */
@Data
public class CodeLoginRequest{

    @Email(message = "email format is incorrect")
    @Schema(description = "email",requiredMode = Schema.RequiredMode.REQUIRED,example = "2295471337@qq.com")
    private String email;

    @Pattern(regexp = "^[0-9]{6}$", message = "Verification code must be 6 number")
    private String code;
}
