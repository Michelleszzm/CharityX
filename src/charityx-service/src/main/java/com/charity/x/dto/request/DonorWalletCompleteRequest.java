package com.charity.x.dto.request;

import com.charity.x.dto.vo.SysUserVo;
import io.github.linpeilie.annotations.AutoMapper;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * @Author: Lucass @Date: 2025/11/14 14:28 @Description:
 */
@Data
@AutoMapper(target = SysUserVo.class)
public class DonorWalletCompleteRequest {

    @NotNull(message = "chain cannot be null")
    @Schema(description = "chain",requiredMode = Schema.RequiredMode.REQUIRED,example = "SOLANA/ETHEREUM/BITCOIN")
    private String chain;

    @NotNull(message = "wallet cannot be null")
    private String wallet;

    private String firstName;

    private String lastName;

    @Email(message = "email is not valid")
    private String email;

    private Integer gender;

    private Integer age;

    private String phone;

    private String country;

    private String city;

    private String occupation;

}
