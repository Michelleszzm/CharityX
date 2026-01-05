package com.charity.x.dto.vo;

import lombok.Data;

import java.io.Serializable;

/**
 * @Author: Lucass @Date: 2025/11/5 16:53 @Description:
 */
@Data
public class BaseVo implements Serializable {

    private Integer createBy;

    private Integer updateBy;
}
