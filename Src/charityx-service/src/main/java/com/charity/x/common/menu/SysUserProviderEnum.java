package com.charity.x.common.menu;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/5 16:50 @Description:
 */
@Getter
@AllArgsConstructor
public enum SysUserProviderEnum {

    /**
     * Email
     */
    EMAIL("EMAIL"),

    /**
     * Google
     */
    GOOGLE("GOOGLE"),

    /**
     * X
     */
    X("X"),

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

    private String provider;

    public static SysUserProviderEnum getByProvider(String provider){
        for (SysUserProviderEnum value : values()) {
            if (value.getProvider().equals(provider)){
                return value;
            }
        }
        return null;
    }

    public static List<String> getUserProviderList(){
        return List.of(EMAIL.getProvider(), GOOGLE.getProvider(), X.getProvider());
    }
}
