package com.charity.x.common.menu;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 *
 * @Author: Lucass
 * @DateTime: 2025/11/6 11:29
 * @Description:
 */
@Getter
@AllArgsConstructor
public enum RedisKeyEnum {

    /**
     * User authentication token
     */
    JWT_TOKEN("jwt:%s", 60 * 60 * 12L, "JWT expiration time"),

    EMAIL_CODE("emailCode:%s", 60 * 10L, "Email verification code"),

    SEND_EMAIL_CODE_LOCK("sendEmailCodeLock:%s", 60L, "Send email verification code lock"),

    RESET_PASSWORD_TOKEN("resetPasswordToken:%s", 60L, "Token issued after reset password verification code passed"),

    CHAIN_TX_INFO("chainTX:%s:%s", 60 * 60 * 24L, "On-chain transaction details"),

    DONATION_RECORD_TX_INFO("donationRecord:%s:%s", 60 * 60 * 24L, "DB transaction details"),

    /**
     * Donation amount range distribution chart
     */
    DONATION_AMOUNT_DISTRIBUTION_INFO("donationAmountDistribution:%s", 60 * 10L, "Donation amount range distribution chart"),

    ;
    private final String keyExpression;

    private final long expire;

    private final String desc;

    public static String getKey(RedisKeyEnum redisKeyEnum, String... args) {
        return String.format(redisKeyEnum.keyExpression, args);
    }
}
