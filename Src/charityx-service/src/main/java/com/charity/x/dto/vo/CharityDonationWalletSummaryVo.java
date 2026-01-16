package com.charity.x.dto.vo;

import java.io.Serial;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @Author: Lucass @Date: 2025/11/7 17:06 @Description:
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CharityDonationWalletSummaryVo extends BaseVo {

    @Serial
    private static final long serialVersionUID = 1360768592449861451L;

    private String chain;

    private String donorWallet;

    private BigDecimal totalDonations;

    private Integer donationCount;

    private LocalDateTime lastDonation;

    private BigDecimal lastAmount;
}
