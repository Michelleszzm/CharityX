package com.charity.x.dto.request;


import com.charity.x.dto.vo.CharityDonationRecordVo;
import io.github.linpeilie.annotations.AutoMapper;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-20
 * @Description:
 * @Version: 1.0
 */
@Data
@AutoMapper(target = CharityDonationRecordVo.class,reverseConvertGenerate = false)
public class CustomerSendTransactionRequest {

    @NotNull(message = "chain can not be null")
    @Schema(description = "Chain", allowableValues = {"SOLANA", "BITCOIN", "ETHEREUM"}, example = "SOLANA")
    private String chain;

    @NotNull(message = "donorWallet can not be null")
    @Schema(description = "Wallet address", example = "0x1234567890")
    private String donorWallet;

    @NotNull(message = "foundationWallet can not be null")
    @Schema(description = "Destination address", example = "0x1234567890")
    private String foundationWallet;

    @NotNull(message = "token can not be null")
    @Schema(description = "Token", allowableValues = {"USDT", "USDC", "SOL", "BTC", "ETH"}, example = "USDT")
    private String token;

    @NotNull(message = "value can not be null")
    @Schema(description = "Amount", requiredMode = Schema.RequiredMode.REQUIRED, example = "1.2")
    @Min(value = 0, message = "value can not be less than 0.000000001")
    private BigDecimal value;

    @NotNull(message = "amount can not be null")
    @Schema(description = "Amount (USD)", requiredMode = Schema.RequiredMode.REQUIRED, example = "1.2")
    private BigDecimal amount;

    @NotNull(message = "encodeSerializedTransaction can not be null")
    @Schema(description = "Transaction serialization information", requiredMode = Schema.RequiredMode.REQUIRED, example = "0x01")
    private String encodeSerializedTransaction;
}
