package com.charity.x.service.manager;

import com.charity.x.common.menu.TokenEnum;
import com.charity.x.common.utils.RedisCacheUtil;
import com.charity.x.dto.ResultCode;
import com.charity.x.dto.response.BinanceApiTickerPriceResponse;
import com.charity.x.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.concurrent.TimeUnit;

/**
 * @Author: Lucass @Date: 2025/11/10 15:48 @Description:
 */
@Slf4j
@Component
public class BinanceApiManager {

    private static final BigDecimal USD_PRICE = BigDecimal.ONE;

    private static final String CACHE_TOKEN_PRICE_KEY = "binance:price:%s";

    private static final String BINANCE_API_URL = "https://api.binance.com/api/v3/ticker/price?symbol=";
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private RedisCacheUtil redisCacheUtil;

    public BigDecimal getPriceWithCache(String symbol){
        TokenEnum tokenEnum = TokenEnum.getByToken(symbol);
        switch (tokenEnum){
            case USDT:
                return USD_PRICE;
            case USDC:
                return USD_PRICE;
            case ETH:
            case SOL:
            case BTC:
            case DAI:
                String key = String.format(CACHE_TOKEN_PRICE_KEY, symbol);
                BigDecimal price = redisCacheUtil.get(key, BigDecimal.class);
                if (price == null){
                    price = refreshTokenPrice(tokenEnum);
                }
                return price;
            default:
                log.warn("query token price error: un support token : {}", symbol);
                throw new BusinessException(ResultCode.PARAM_ERROR.getCode(),"un support token : " + symbol);
        }
    }


    /**
     *
     * @param symbol
     * @return
     * @link {https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints}
     */
    public BigDecimal refreshTokenPrice(TokenEnum  symbol){
        String url = BINANCE_API_URL + symbol.getToken() + "USDT" ;
        ResponseEntity<BinanceApiTickerPriceResponse> response = restTemplate.getForEntity(url, BinanceApiTickerPriceResponse.class);
        HttpStatusCode statusCode = response.getStatusCode();
        BinanceApiTickerPriceResponse responseBody = response.getBody();
        if (HttpStatus.OK.value() ==  statusCode.value() && responseBody != null) {
            String key = String.format(CACHE_TOKEN_PRICE_KEY, symbol.getToken());
            redisCacheUtil.set(key, responseBody.getPrice(), 60 * 60 * 24 * 2L, TimeUnit.SECONDS);
            return responseBody.getPrice();
        }
        return null;
    }
}
