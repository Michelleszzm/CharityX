package com.charity.x.dto.vo;

import com.charity.x.dto.entity.SysRole;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serial;
import java.time.LocalDateTime;
import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/5 16:54 @Description:
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysUserVo extends BaseVo{
    @Serial
    private static final long serialVersionUID = 2054471624466804303L;

    private Integer id;

    private String provider;

    private String providerId;

    private Integer groupUserId;

    private String email;

    @JsonIgnore
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

    private LocalDateTime mergeDate;

    @JsonIgnore
    private List<SysRole> SysRoles;

    private List<String> roles;
}
