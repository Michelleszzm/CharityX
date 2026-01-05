package com.charity.x.common.menu;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @Author: Lucass @Date: 2025/11/10 13:39 @Description:
 */
@Getter
@AllArgsConstructor
public enum NonprofitStatusEnum {

    /**
     * 0: nothing
     * 1: active
     * 2: revoked
     */
    STATUS_NONE(0,1,"NOTHING"),

    STATUS_ACTIVE(1,1,"ACTIVE"),

    STATUS_REVOKED(2,1,"revoked"),

    SNAPSHOT_CHECK_STATUS_NONE(0,2,"NOTHING"),

    SNAPSHOT_CHECK_STATUS_PENDING(1,2,"PENDING"),

    SNAPSHOT_CHECK_STATUS_REJECTED(2,2,"REJECTED"),

    SNAPSHOT_CHECK_STATUS_DELETED(3,2,"DELETED");

    private int status;

    private int group;

    private String desc;

    public static NonprofitStatusEnum getByStatus(int status,int group){
        for (NonprofitStatusEnum value : NonprofitStatusEnum.values()) {
            if (value.group == group && value.status == status){
                return value;
            }
        }
        return null;
    }
}
