package com.charity.x.dto.vo;

import java.io.Serial;

import io.github.linpeilie.annotations.AutoMapper;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/**
 * @Author: Lucass @Date: 2025/11/6 19:51 @Description:
 */
@Data
@EqualsAndHashCode(callSuper = true)
@ToString
@AutoMapper(target = CharityNonprofitFundraisingConfigDraftVo.class)
public class CharityNonprofitFundraisingConfigVo extends BaseVo {

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

    @Valid
    private CharityNonprofitFundraisingConfigStyle styleValue;
    @Valid
    private CharityNonprofitFundraisingConfigPayment paymentValue;
    @Valid
    private CharityNonprofitFundraisingConfigForm formValue;
    @Valid
    private CharityNonprofitFundraisingConfigAllocation allocationValue;
    @Valid
    private CharityNonprofitFundraisingConfigPublish publishValue;

    @Max(value = 1,message = "publish status invalid")
    @Min(value = 0,message = "publish status invalid")
    /**
     * Real: -1 not exists 0 unpublished 1 published
     */
    private Integer publishStatus;

    /**
     * Draft: 0 can publish 1 published
     */
    private Integer publishStatusDraft;
}
