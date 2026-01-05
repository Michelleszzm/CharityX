package com.charity.x.dto.vo;

import lombok.EqualsAndHashCode;

import java.io.Serial;
import java.math.BigDecimal;

/**
 * @Author: Lucass @Date: 2025/11/7 17:06 @Description:
 */
@EqualsAndHashCode(callSuper = true)
public class CharityDonationSummaryVo extends BaseVo {

    @Serial
    private static final long serialVersionUID = 1360768592449861451L;

    private Integer donors;

    private BigDecimal totalDonations;

    private Integer donationCount;

    public Integer getDonors() {
        return donors;
    }

    public void setDonors(Integer donors) {
        this.donors = donors;
    }

    public BigDecimal getTotalDonations() {
        return totalDonations;
    }

    public void setTotalDonations(BigDecimal totalDonations) {
        this.totalDonations = totalDonations;
    }

    public Integer getDonationCount() {
        return donationCount;
    }

    public void setDonationCount(Integer donationCount) {
        this.donationCount = donationCount;
    }
}
