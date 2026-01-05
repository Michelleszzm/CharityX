package com.charity.x.common.menu;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @Author: Lucass @Date: 2025/11/10 13:39 @Description:
 */
@Getter
@AllArgsConstructor
public enum NonprofitMergeStatusEnum {

    NONE(0,"NOTHING"),

    MERGE_STATUS_PENDING(1,"PENDING"),

    MERGE_STATUS_ACTIVE(2,"ACTIVE"),

    MERGE_STATUS_REVOKED(3,"REVOKED"),

    MERGE_STATUS_REJECTED(4,"REJECTED"),

    MERGE_STATUS_DELETED(10,"DELETED"),

    ;
    private int status;

    private String desc;

    public static NonprofitMergeStatusEnum getByStatus(int status){
        for (NonprofitMergeStatusEnum value : NonprofitMergeStatusEnum.values()) {
            if (value.status == status){
                return value;
            }
        }
        return NONE;
    }

    public static NonprofitMergeStatusEnum getByStatusAndCheckStatus(int status,int checkStatus){
        NonprofitStatusEnum statusEnum = NonprofitStatusEnum.getByStatus(status, 1);
        if (statusEnum == null){
            switch (statusEnum){
                case STATUS_ACTIVE:
                    return MERGE_STATUS_ACTIVE;
                case STATUS_REVOKED:
                    return MERGE_STATUS_REVOKED;
                default:
            }
        }
        NonprofitStatusEnum checkStatusEnum = NonprofitStatusEnum.getByStatus(checkStatus,2);
        if (checkStatusEnum == null){
            switch (checkStatusEnum){
                case SNAPSHOT_CHECK_STATUS_PENDING:
                    return MERGE_STATUS_PENDING;
                case SNAPSHOT_CHECK_STATUS_REJECTED:
                    return MERGE_STATUS_REJECTED;
                case SNAPSHOT_CHECK_STATUS_DELETED:
                    return MERGE_STATUS_DELETED;
                default:
            }
        }
        return NONE;
    }
}
