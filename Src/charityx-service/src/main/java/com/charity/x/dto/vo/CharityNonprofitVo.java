package com.charity.x.dto.vo;

import java.io.Serial;
import java.time.LocalDateTime;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @Author: Lucass @Date: 2025/11/6 19:51 @Description:
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CharityNonprofitVo extends BasePageVo {

    @Serial
    private static final long serialVersionUID = -6821795195960164317L;

    private Integer id;

    private Integer userId;

    private String email;

    private String firstName;

    private String lastName;
    
    private String nonprofitName;

    private String proofImage;

    private Integer status;

    private Integer notStatus;

    private LocalDateTime applicationDate;

    private String snapshotNonprofitName;

    private String snapshotProofImage;

    private Integer snapshotCheckStatus;

    private LocalDateTime snapshotApplicationDate;
    
}
