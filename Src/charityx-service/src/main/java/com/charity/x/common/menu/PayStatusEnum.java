package com.charity.x.common.menu;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @Author: Lucass @Date: 2025/11/7 20:18 @Description:
 */
@Getter
@AllArgsConstructor
public enum PayStatusEnum {

    /**
     * Pending
     */
    PENDING(0),

    /**
     * Not found on chain
     */
    CHAIN_NOT_FUND(1),

    /**
     * Chain processing error
     */
    CHAIN_ERROR(2),

    /**
     * Chain processing completed, but type error
     */
    FINISH_BUT_NOT_TRANS_TYPE(3),

    /**
     * Chain processing completed
     */
    FINISH(4);

    private final int status;
}
