package com.charity.x.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * @Author: Lucass @Date: 2025/11/11 19:03 @Description:
 */
@Data
public class ApplicationManagerRequest {

    private Integer adminUserId;

    @NotNull(message = "userId can not be empty")
    private Integer userId;

    @Max(value = 10, message = "status can not be greater than 10")
    @Min(value = 0, message = "status can not be less than 0")
    private Integer sourceStatus;

    @Max(value = 10, message = "status can not be greater than 10")
    @Min(value = 0, message = "status can not be less than 0")
    private Integer targetStatus;

    private String reason;
}
