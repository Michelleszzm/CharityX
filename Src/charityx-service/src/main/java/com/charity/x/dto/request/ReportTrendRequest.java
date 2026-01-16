package com.charity.x.dto.request;


import com.charity.x.dto.vo.CharityDonationRecordVo;
import io.github.linpeilie.annotations.AutoMapper;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-22
 * @Description:
 * @Version: 1.0
 */
@Data
@AutoMapper(target = CharityDonationRecordVo.class,reverseConvertGenerate = false)
public class ReportTrendRequest {

    @NotNull(message = "start day can not empty")
    @Schema(description = "Start time", requiredMode = Schema.RequiredMode.REQUIRED, example = "2025-11-01")
    private LocalDate startDay;

    @NotNull(message = "end day can not empty")
    @Schema(description = "End time", requiredMode = Schema.RequiredMode.REQUIRED, example = "2025-11-01")
    private LocalDate endDay;
}
