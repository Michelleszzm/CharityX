package com.charity.x.common.menu;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @Author: Lucass @Date: 2025/11/6 14:46 @Description:
 */
@Getter
@AllArgsConstructor
public enum SysRoleCodeEnum {

    /**
     * Default role
     */
    DEFAULT("USER"),

    /**
     * Admin role
     */
    ADMIN("ADMIN"),

    /**
     * Regular user role
     */
    USER("USER"),

    /**
     * Donor role
     */
    CUSTOMER("CUSTOMER");

    private String code;

    public static SysRoleCodeEnum getByCode(String code){
        for (SysRoleCodeEnum value : values()) {
            if (value.getCode().equals(code)){
                return value;
            }
        }
        return USER;
    }
    public static String getRoleCodeWithPrefix(SysRoleCodeEnum roleCodeEnum){
        return "ROLE_" + roleCodeEnum.getCode();
    }
}
