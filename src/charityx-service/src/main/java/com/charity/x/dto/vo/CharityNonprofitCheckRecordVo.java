package com.charity.x.dto.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.time.LocalDateTime;

/**
 * @Author: Lucass @Date: 2025/11/11 19:06 @Description:
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CharityNonprofitCheckRecordVo extends BaseVo{

    @JsonIgnore
    private Integer userId;

    @JsonIgnore
    private Integer charityNonprofitId;

    @JsonIgnore
    private String nonprofitName;

    @JsonIgnore
    private String proofImage;

    @JsonIgnore
    private Integer sourceStatus;

    private Integer targetStatus;

    private String reason;

    private LocalDateTime checkTime;
}
