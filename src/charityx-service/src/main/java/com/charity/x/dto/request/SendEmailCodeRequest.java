package com.charity.x.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * @Author: Lucass @Date: 2025/11/6 10:49 @Description:
 */
@Data
@Schema(description = "Send email verification code request parameters")
public class SendEmailCodeRequest {

    @Email(message = "email format is incorrect")
    @Schema(description = "email",requiredMode = Schema.RequiredMode.REQUIRED,example = "2295471337@qq.com")
    private String email;

    @NotNull(message = "scene is required")
    @Max(value = 3,message = "scene is invalid")
    @Min(value = 1,message = "scene is invalid")
    @Schema(description = "email send scene,1 register 2 login 3 reset password",requiredMode = Schema.RequiredMode.REQUIRED,example = "1")
    private Integer scene;
}
