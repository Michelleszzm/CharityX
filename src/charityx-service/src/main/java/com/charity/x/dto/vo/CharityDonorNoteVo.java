package com.charity.x.dto.vo;

import java.io.Serial;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @Author: Lucass @Date: 2025/11/7 15:26 @Description:
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CharityDonorNoteVo extends BaseVo {

    @Serial
    private static final long serialVersionUID = 2550684820882230493L;

    @NotNull(message = "chain can not empty")
    private String chain;

    @NotNull(message = "wallet can not empty")
    private String wallet;

    @NotNull(message = "note can not empty")
    private String note;

    private LocalDateTime createTime;
}
