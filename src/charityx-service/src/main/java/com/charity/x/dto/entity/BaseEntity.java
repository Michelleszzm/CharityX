package com.charity.x.dto.entity;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * @Author: Lucass @Date: 2025/11/5 15:10 @Description:
 */
@Data
public class BaseEntity implements Serializable {

    private Integer id;

    private Integer createBy;

    private LocalDateTime createTime;

    private Integer updateBy;

    private LocalDateTime updateTime;
}
