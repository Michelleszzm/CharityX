package com.charity.x.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import lombok.*;

/**
 * @Author: Lucass @Date: 2025/11/6 13:52 @Description:
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

    @Email(message = "email format is incorrect")
    @Schema(description = "email",requiredMode = Schema.RequiredMode.REQUIRED,example = "2295471337@qq.com")
    private String email;

    private Integer type;

    private String password;

    private String code;
}
