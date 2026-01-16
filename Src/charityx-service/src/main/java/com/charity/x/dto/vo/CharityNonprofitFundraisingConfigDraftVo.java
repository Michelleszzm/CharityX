package com.charity.x.dto.vo;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.io.Serial;

/**
 * @Author: Lucass @Date: 2025/11/6 19:51 @Description:
 */
@Data
@EqualsAndHashCode(callSuper = true)
@ToString
public class CharityNonprofitFundraisingConfigDraftVo extends BaseVo {

    @Serial
    private static final long serialVersionUID = -6130863687116841823L;

    private Integer id;

    private Integer userId;

    @NotEmpty(message = "fundraisingTemplateCode can not be empty")
    private String fundraisingTemplateCode;

    private String site;

    private String nftImage;

    private String style;

    private String payment;

    private String form;

    private String allocation;

    private String publish;
    
    private CharityNonprofitFundraisingConfigStyle styleValue;
    
    private CharityNonprofitFundraisingConfigPayment paymentValue;
    
    private CharityNonprofitFundraisingConfigForm formValue;
    
    private CharityNonprofitFundraisingConfigAllocation allocationValue;
    
    private CharityNonprofitFundraisingConfigPublish publishValue;

    @Max(value = 1,message = "publish status invalid")
    @Min(value = 0,message = "publish status invalid")
    private Integer publishStatus;
}
