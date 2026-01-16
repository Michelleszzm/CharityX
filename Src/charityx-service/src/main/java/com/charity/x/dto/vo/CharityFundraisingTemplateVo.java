package com.charity.x.dto.vo;

import java.io.Serial;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @Author: Lucass @Date: 2025/11/6 19:51 @Description:
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CharityFundraisingTemplateVo extends BaseVo {

    @Serial
    private static final long serialVersionUID = -2489114297130575278L;

    private Integer id;

    private String name;

    private String code;

}
