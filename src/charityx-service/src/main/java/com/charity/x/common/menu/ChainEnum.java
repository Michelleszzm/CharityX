package com.charity.x.common.menu;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @Author: Lucass @Date: 2025/11/7 20:22 @Description:
 */
@Getter
@AllArgsConstructor
public enum ChainEnum {

    /**
     * BITCOIN
     */
    BITCOIN("BITCOIN"),

    /**
     * ETHEREUM
     */
    ETHEREUM("ETHEREUM"),

    /**
     * SOLANA
     */
    SOLANA("SOLANA");

    private final String chain;

    public static ChainEnum getByChain(String chain) {
        for (ChainEnum item : values()) {
            if (item.getChain().equals(chain)) {
                return item;
            }
        }
        return null;
    }
}
