package com.charity.x.common.menu;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @Author: Lucass @Date: 2025/11/10 10:20 @Description:
 */
@Getter
@AllArgsConstructor
public enum TokenEnum {

    /**
     * USDT
     */
    USDT("USDT"),

    /**
     * USDC
     */
    USDC("USDC"),

    /**
     * ETH
     */
    ETH("ETH"),

    /**
     * SOL
     */
    SOL("SOL"),

    /**
     * BTC
     */
    BTC("BTC"),

    /**
     * DAI
     */
    DAI("DAI");

    private String token;

    public static TokenEnum getByToken(String token){
        for (TokenEnum value : TokenEnum.values()) {
            if (value.getToken().equals(token)){
                return value;
            }
        }
        return null;
    }

}
