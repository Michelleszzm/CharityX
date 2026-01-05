package com.charity.x.dto.response;

import lombok.Data;

import java.math.BigDecimal;

/**
 * @Author: Lucass @Date: 2025/11/10 15:53 @Description:
 */
@Data
public class BinanceApiTickerPriceResponse {

    private String symbol;

    private BigDecimal price;
}
