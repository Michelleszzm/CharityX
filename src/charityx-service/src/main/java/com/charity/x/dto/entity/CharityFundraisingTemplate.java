package com.charity.x.dto.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serial;

/**
 * @Author: Lucass @Date: 2025/11/6 19:51 @Description:
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CharityFundraisingTemplate extends BaseEntity{

    @Serial
    private static final long serialVersionUID = -2652879692793499037L;

    private String name;

    private String code;

}
