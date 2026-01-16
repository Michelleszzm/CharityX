package com.charity.x.dto.entity;

import java.io.Serial;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @Author: Lucass @Date: 2025/11/6 19:51 @Description:
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CharityNonprofitFundraisingConfig extends BaseEntity{

    @Serial
    private static final long serialVersionUID = -3316672071970356039L;

    private Integer userId;

    private String fundraisingTemplateCode;

    private String site;

    private String nftImage;

    private String style;

    private String payment;

    private String form;

    private String allocation;

    private String publish;

    private Integer publishStatus;
}
