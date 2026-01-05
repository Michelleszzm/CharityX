package com.charity.x.dto.response;


import com.charity.x.dto.vo.SysUserVo;
import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;

import java.util.List;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-19
 * @Description:
 * @Version: 1.0
 */
@Data
@AutoMapper(target = SysUserVo.class)
public class UserDetailResponse {

    private Integer id;

    private String provider;

    private String providerId;

    private String email;

    private String firstName;

    private String lastName;

    private Integer gender;

    private Integer age;

    private String phone;

    private String country;

    private String city;

    private String occupation;

    private String avatar;

    private List<String> roles;
}
