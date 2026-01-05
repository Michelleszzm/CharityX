package com.charity.x.dto.request;

import com.charity.x.dto.vo.SysUserVo;
import io.github.linpeilie.annotations.AutoMapper;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Author: Lucass @Date: 2025/11/12 10:44 @Description:
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@AutoMapper(target = SysUserVo.class, reverseConvertGenerate = false)
public class ApplicationCompleteUserRequest {

    @NotNull(message = "userId can not be empty")
    private Integer userId;

    private String firstName;

    private String lastName;

    private Integer gender;

    private Integer age;

    private String phone;

    private String country;

    private String city;

    private String occupation;
}
