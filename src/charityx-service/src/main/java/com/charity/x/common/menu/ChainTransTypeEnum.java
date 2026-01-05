package com.charity.x.common.menu;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-21
 * @Description: On-chain transaction type enumeration
 * @Version: 1.0
 */
@Getter
@AllArgsConstructor
public enum ChainTransTypeEnum {

    /**
     * Transfer transaction (including SOL transfer and SPL Token transfer)
     */
    TRANSFER("TRANSFER"),

    /**
     * Other type transaction
     */
    OTHER("OTHER");

    private final String code;
}
