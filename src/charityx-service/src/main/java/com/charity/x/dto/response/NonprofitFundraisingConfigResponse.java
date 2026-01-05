package com.charity.x.dto.response;


import com.charity.x.dto.vo.*;
import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-19
 * @Description:
 * @Version: 1.0
 */
@Data
@AutoMapper(target = CharityNonprofitFundraisingConfigVo.class)
public class NonprofitFundraisingConfigResponse {

    private String fundraisingTemplateCode;

    private CharityNonprofitFundraisingConfigStyle styleValue;

    private CharityNonprofitFundraisingConfigPayment paymentValue;

    private CharityNonprofitFundraisingConfigForm formValue;

    private CharityNonprofitFundraisingConfigAllocation allocationValue;

    private CharityNonprofitFundraisingConfigPublish publishValue;

    private Integer publishStatus;
}
