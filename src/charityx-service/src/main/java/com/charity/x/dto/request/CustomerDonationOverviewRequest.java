package com.charity.x.dto.request;


import com.charity.x.dto.vo.BasePageVo;
import com.charity.x.dto.vo.CharityDonationRecordVo;
import io.github.linpeilie.annotations.AutoMapper;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;

import java.math.BigDecimal;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-22
 * @Description:
 * @Version: 1.0
 */
@Data
@AutoMapper(target = CharityDonationRecordVo.class,reverseConvertGenerate = false)
@Tag(name = "Customer donation overview request parameters")
public class CustomerDonationOverviewRequest extends BasePageVo {

    @Schema(description = "Chain", allowableValues = {"SOLANA", "BITCOIN", "ETHEREUM"}, example = "SOLANA")
    private String chain;

    @Schema(description = "Token", allowableValues = {"USDT", "USDC", "SOL", "BTC", "ETH"}, example = "USDT")
    private String token;

    /**
     * Search conditions
     */
    @Schema(description = "minAmount unit USD", requiredMode = Schema.RequiredMode.REQUIRED, example = "1.2")
    private BigDecimal minAmount;

    @Schema(description = "maxAmount unit USD", requiredMode = Schema.RequiredMode.REQUIRED, example = "1.2")
    private BigDecimal maxAmount;

}
