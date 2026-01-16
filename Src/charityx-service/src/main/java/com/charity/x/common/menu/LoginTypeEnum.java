package com.charity.x.common.menu;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @Author: Lucass @Date: 2025/11/6 13:19 @Description:
 */
@Getter
@AllArgsConstructor
public enum LoginTypeEnum {

    /**
     * Verification code login
     */
    CODE(1),

    /**
     * Password login
     */
    PASSWORD(2);

    private int type;
}
