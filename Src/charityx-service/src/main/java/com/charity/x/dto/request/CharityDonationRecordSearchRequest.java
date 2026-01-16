package com.charity.x.dto.request;


import com.charity.x.dto.vo.BasePageVo;
import com.charity.x.dto.vo.CharityDonationRecordVo;
import io.github.linpeilie.annotations.AutoMapper;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-19
 * @Description:
 * @Version: 1.0
 */
@Data
@Schema(description = "CharityDonationRecordSearchRequest")
@AutoMapper(target = CharityDonationRecordVo.class, reverseConvertGenerate = false)
public class CharityDonationRecordSearchRequest extends BasePageVo {

    @Schema(description = "Specific date: yyyy-MM-dd", example = "2025-11-11")
    private LocalDate day;

    @Schema(description = "Chain", allowableValues = { "SOLANA", "BITCOIN", "ETHEREUM"},example = "SOLANA")
    private String chain;

    @Schema(description = "Wallet address", example = "0x1234567890")
    private String donorWallet;

    @Schema(description = "Token", allowableValues = {"USDT","USDC","SOL","BTC","ETH"},example = "USDT")
    private String token;

    // Search conditions

    @Schema(description = "Range minimum value, unit USD", example = "0.01")
    private BigDecimal minAmount;

    @Schema(description = "Range maximum value, unit USD", example = "0.01")
    private BigDecimal maxAmount;

    @Schema(description = "Start date, yyyy-MM-dd", example = "2025-11-11")
    private LocalDate startDay;

    @Schema(description = "End date, yyyy-MM-dd", example = "2025-11-11")
    private LocalDate endDay;
}
