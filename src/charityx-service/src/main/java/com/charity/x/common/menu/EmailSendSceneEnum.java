package com.charity.x.common.menu;

import com.charity.x.dto.ResultCode;
import com.charity.x.exception.BusinessException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @Author: Lucass @Date: 2025/11/13 10:54 @Description:
 */
@Getter
@AllArgsConstructor
public enum EmailSendSceneEnum {

    /**
     *  Register
     */
    REGISTER(1, "register"),

    /**
     *  Login
     */
    LOGIN(2, "login"),

    /**
     *  Reset password
     */
    RESET_PASSWORD(3, "reset password"),

    /**
     * com.charity.pay.common.menu.NonprofitMergeStatusEnum#MERGE_STATUS_ACTIVE
     */
    MERGE_STATUS_ACTIVE(4, "application active"),

    /**
     * com.charity.pay.common.menu.NonprofitMergeStatusEnum#MERGE_STATUS_REVOKED
     */
    MERGE_STATUS_REVOKED(5, "application revoked"),
    /**
     * com.charity.pay.common.menu.NonprofitMergeStatusEnum#MERGE_STATUS_REJECTED
     */
    MERGE_STATUS_REJECTED(6, "application rejected"),
    ;

    private final Integer scene;

    private final String desc;

    public static EmailSendSceneEnum getByScene(Integer scene){
        for (EmailSendSceneEnum value : values()) {
            if (value.scene.equals(scene)){
                return value;
            }
        }
        throw new BusinessException(ResultCode.PARAM_ERROR.getCode(),"Unsupported email send scene");
    }
}
