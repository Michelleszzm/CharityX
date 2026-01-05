package com.charity.x.dto.request;


import com.charity.x.dto.vo.CharityNonprofitFundraisingConfigVo;
import io.github.linpeilie.annotations.AutoMapper;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-22
 * @Description:
 * @Version: 1.0
 */
@Data
@AutoMapper(target = CharityNonprofitFundraisingConfigVo.class)
public class NonprofitFundraisingConfigPublishRequest {

    @Schema(description = "Publish status" , example = "1",defaultValue = "1", allowableValues = {"0","1"})
    @Max(value = 1,message = "publish status invalid")
    @Min(value = 0,message = "publish status invalid")
    @NotNull(message = "publish status can not be empty")
    private Integer publishStatus;
}
