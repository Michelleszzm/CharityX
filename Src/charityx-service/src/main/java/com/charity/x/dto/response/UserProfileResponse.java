package com.charity.x.dto.response;

import com.charity.x.dto.vo.SysUserVo;
import io.github.linpeilie.annotations.AutoMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Author: Lucass @Date: 2025/11/12 10:49 @Description:
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@AutoMapper(target = SysUserVo.class)
public class UserProfileResponse {
    private Integer userId;

    private String firstName;

    private String lastName;

    private String email;

    private Integer gender;

    private Integer age;

    private String phone;

    private String country;

    private String city;

    private String occupation;
}
