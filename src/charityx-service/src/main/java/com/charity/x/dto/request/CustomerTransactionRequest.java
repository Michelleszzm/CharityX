package com.charity.x.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-20
 * @Description:
 * @Version: 1.0
 */
@Data
public class CustomerTransactionRequest {

    @NotNull(message = "chain can not empty")
    @Schema(description = "Chain", allowableValues = { "SOLANA", "BITCOIN", "ETHEREUM"},example = "SOLANA",requiredMode = Schema.RequiredMode.REQUIRED)
    private String chain;

    @NotNull(message = "txHash can not empty")
    private String txHash;
}
