package com.charity.x.dto.vo;

import java.io.Serial;
import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

/**
 * @Author: Lucass @Date: 2025/11/6 19:51 @Description:
 */
@Data
public class CharityNonprofitFundraisingConfigForm {

    @Serial
    private static final long serialVersionUID = 6401900567558746548L;

    @NotEmpty.List(@NotEmpty(message = "donation amount settings can not empty"))
    private List<String> amountList;

    @NotEmpty(message = "default amount setting can not empty")
    private String defaultAmount;
}
