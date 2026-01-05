package com.charity.x.common.menu;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-05
 * @Description: AI AML risk control enumeration
 * @Version: 1.0
 */
@Getter
@AllArgsConstructor
public enum AiAmlRiskEnum {

    /**
     * Low risk
     */
    LOW("low", "Low - Safe Donation"),

    /**
     * Medium risk
     */
    MEDIUM("medium", "Medium - Review Required"),

    /**
     * High risk
     */
    HIGH("high", "High - Suspicious Activity");

    private final String code;
    private final String description;
}
