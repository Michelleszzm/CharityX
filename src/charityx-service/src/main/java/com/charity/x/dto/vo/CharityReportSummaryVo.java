package com.charity.x.dto.vo;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serial;
import java.math.BigDecimal;

/**
 * @Author: Lucass @Date: 2025/11/8 09:56 @Description:
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CharityReportSummaryVo extends CharityDonationSummaryVo{
    @Serial
    private static final long serialVersionUID = 3063525852903976480L;

    private BigDecimal donationPerCapita;

    public CharityReportSummaryVo(){
        super.setDonors(Integer.valueOf(0));
        super.setTotalDonations(BigDecimal.ZERO);
        super.setDonationCount(Integer.valueOf(0));
        this.donationPerCapita = BigDecimal.ZERO;
    }
}
