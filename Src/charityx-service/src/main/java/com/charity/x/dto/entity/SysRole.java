package com.charity.x.dto.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serial;

/**
 * @Author: Lucass @Date: 2025/11/5 16:56 @Description:
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SysRole extends BaseEntity{

    @Serial
    private static final long serialVersionUID = 3712532868189747716L;
    private String roleCode;
    private String roleName;
    private String description;
}
