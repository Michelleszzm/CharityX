package com.charity.x.dto.response;


import com.charity.x.common.menu.AiAmlRiskEnum;
import com.charity.x.common.menu.ChainTransTypeEnum;
import com.charity.x.dto.vo.CharityDonationRecordVo;
import io.github.linpeilie.annotations.AutoMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-19
 * @Description:
 * @Version: 1.0
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@AutoMapper(target = CharityDonationRecordVo.class)
public class DonationRecordResponse {

    /**
     * @see com.charity.x.common.menu.ChainTransTypeEnum
     */
    private ChainTransTypeEnum transType;

    private LocalDate day;

    private String chain;

    private String donorWallet;

    private String foundationWallet;

    private String txHash;

    private String token;

    private BigDecimal value;

    private BigDecimal amount;

    private LocalDateTime payTime;

    private Integer payStatus;

    private String nftImage;

    private String nftId;

    private String pdfUrl;

    /**
     * On-chain transaction error information
     */
    private String error;

    /**
     * @see com.charity.x.common.menu.AiAmlRiskEnum
     */
    private String aiAmlRisk = AiAmlRiskEnum.LOW.getCode();
}
