package com.charity.x.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * @Author: Lucass @Date: 2025/11/11 09:12 @Description:
 */
@Data
public class ApplicationPageResponse  {

    private Integer userId;

    private String email;

    private String firstName;

    private String lastName;

    private String nonprofitName;

    private String proofImage;

    private Integer status;

    private LocalDateTime mergeDate;

    private Integer type;

    @JsonIgnore
    private String snapshotNonprofitName;

    @JsonIgnore
    private String snapshotProofImage;

    @JsonIgnore
    private Integer snapshotCheckStatus;

    @JsonIgnore
    private LocalDateTime applicationDate;

    @JsonIgnore
    private LocalDateTime snapshotApplicationDate;
}
