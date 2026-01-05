package com.charity.x.dto.vo;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @Author: Lucass @Date: 2025/11/5 16:53 @Description:
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class BasePageVo extends BaseVo{

    private int pageNum = 1;

    private int pageSize = 10;
}
