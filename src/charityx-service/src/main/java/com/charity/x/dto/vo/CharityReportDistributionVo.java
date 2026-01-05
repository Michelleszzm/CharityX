package com.charity.x.dto.vo;

import java.io.Serial;
import java.math.BigDecimal;
import java.util.List;

import lombok.*;

/**
 * @Author: Lucass @Date: 2025/11/8 09:56 @Description:
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CharityReportDistributionVo extends BaseVo{

    @Serial
    private static final long serialVersionUID = 5401053514640807581L;

    private List<Distribution> chain;

    private List<Distribution> token;

    private List<Distribution> donationAmount;

    private List<Distribution> donationFrequency;

    private List<Distribution> accountSecurity;

    @Data
    public static class Distribution {

        private String name;

        private Integer donors;

        private BigDecimal donationAmount;

        private BigDecimal calculateAmount;

        private BigDecimal percent;
    }

    @Data
    public static class DistributionSo {

        private String name;

        private BigDecimal percent;
    }
}
