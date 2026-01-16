package com.charity.x.dto.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @Author: Lucass @Date: 2025/11/5 17:09 @Description:
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysUserRole extends BaseEntity{

    private Integer userId;

    private Integer roleId;
}
