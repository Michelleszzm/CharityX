package com.charity.x.dto.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Author: Lucass @Date: 2025/11/10 15:53 @Description:
 * @link {https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints}
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BinanceApiTickerPriceRequest {

    private String symbol;

    private List<String> symbols;

    private String symbolStatus;
}
