package com.charity.x.dto.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * @Author: Lucass @Date: 2025/11/5 13:44 @Description:
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysUser extends BaseEntity {
    private static final long serialVersionUID = 5836422950175586921L;

    private String provider;

    private String providerId;

    private Integer groupUserId;

    private String email;

    private String password;

    private String firstName;

    private String lastName;

    private Integer gender;

    private Integer age;

    private String phone;

    private String country;

    private String city;

    private String occupation;

    private String avatar;

    private Integer status;

    private LocalDateTime lastLoginTime;
}
