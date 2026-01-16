package com.charity.x.dto.entity;

import java.io.Serial;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @Author: Lucass @Date: 2025/11/6 19:51 @Description:
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CharityNonprofitCheckRecord extends BaseEntity{

    @Serial
    private static final long serialVersionUID = -6682127310410218000L;

    private Integer userId;

    private Integer charityNonprofitId;

    private String nonprofitName;

    private String proofImage;

    private Integer sourceStatus;

    private Integer targetStatus;

    private String reason;

    private LocalDateTime checkTime;
    
}
