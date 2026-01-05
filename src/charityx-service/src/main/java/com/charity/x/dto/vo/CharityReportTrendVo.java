package com.charity.x.dto.vo;

import java.io.Serial;
import java.math.BigDecimal;
import java.time.LocalDate;
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
public class CharityReportTrendVo extends BaseVo{

    @Serial
    private static final long serialVersionUID = 3011622615035347631L;

    private List<Trend> trendList;

    @Data
    public static class Trend {

        private LocalDate day;

        private BigDecimal amount;

        private Integer donors;
    }
}
