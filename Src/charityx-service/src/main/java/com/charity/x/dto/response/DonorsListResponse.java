package com.charity.x.dto.response;


import com.charity.x.dto.vo.CharityDonationWalletSummaryVo;
import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-19
 * @Description:
 * @Version: 1.0
 */
@Data
@AutoMapper(target = CharityDonationWalletSummaryVo.class)
public class DonorsListResponse {

    private String donorWallet;

    private String chain;

    private BigDecimal totalDonations;

    private Integer donationCount;

    private LocalDateTime lastDonation;

    private BigDecimal lastAmount;
}
