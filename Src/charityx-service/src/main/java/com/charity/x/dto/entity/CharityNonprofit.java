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
public class CharityNonprofit extends BaseEntity{

    @Serial
    private static final long serialVersionUID = -3316672071970356039L;

    private Integer userId;

    private String nonprofitName;

    private String proofImage;

    private Integer status;

    private LocalDateTime applicationDate;

    private String snapshotNonprofitName;

    private String snapshotProofImage;

    private Integer snapshotCheckStatus;

    private LocalDateTime snapshotApplicationDate;
    
}
