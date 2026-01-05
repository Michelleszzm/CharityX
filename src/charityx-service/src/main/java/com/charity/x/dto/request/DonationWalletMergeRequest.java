package com.charity.x.dto.request;


import com.charity.x.dto.vo.CharityDonationRecordVo;
import io.github.linpeilie.annotations.AutoMapper;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-19
 * @Description:
 * @Version: 1.0
 */
@Data
@AutoMapper(target = CharityDonationRecordVo.class,reverseConvertGenerate = false)
public class DonationWalletMergeRequest {

    @NotNull(message = "chain cannot be empty")
    @Schema(description = "Chain", allowableValues = { "SOLANA", "BITCOIN", "ETHEREUM"},example = "SOLANA",requiredMode = Schema.RequiredMode.REQUIRED)
    private String chain;

    @NotNull(message = "donorWallet cannot be empty")
    @Schema(description = "Wallet address",example = "TEST-2025-11-19-WWWWWWWW-9",requiredMode = Schema.RequiredMode.REQUIRED)
    private String donorWallet;
}
