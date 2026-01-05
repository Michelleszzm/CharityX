package com.charity.x.common.menu;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @Author: Lucass @Date: 2025/11/5 16:52 @Description:
 */
@Getter
@AllArgsConstructor
public enum StatusEnum {

    /**
     * Disabled
     */
    DISABLED(0),

    /**
     * Enabled
     */
    ENABLED(1);

    private int status;
}
