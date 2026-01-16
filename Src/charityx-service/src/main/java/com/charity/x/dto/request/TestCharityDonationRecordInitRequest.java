package com.charity.x.dto.request;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-19
 * @Description: Test
 * @Version: 1.0
 */
@Data
public class TestCharityDonationRecordInitRequest {

    @NotNull(message = "chain can not be null")
    @Schema(description = "Chain", allowableValues = { "SOLANA", "BITCOIN", "ETHEREUM"},example = "SOLANA")
    private String chain;

    @NotNull(message = "token can not be null")
    @Schema(description = "Token", allowableValues = {"USDT","USDC","SOL","BTC","ETH"},example = "USDT")
    private String token;

    @NotNull(message = "rows can not be null")
    @Schema(description = "Number of rows")
    private Integer rows;
}
