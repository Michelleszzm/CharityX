package com.charity.x.dto.vo;

import java.io.Serial;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * @Author: Lucass @Date: 2025/11/6 19:51 @Description:
 */
@Data
public class CharityNonprofitFundraisingConfigStyle {

    @Serial
    private static final long serialVersionUID = -6130863687116841823L;

    @NotNull(message = "organization name can not empty")
    private String organizationName;

    private String organizationLogo;

    @NotNull(message = "choose color can not empty")
    private String chooseColor;

    @NotNull(message = "main title can not empty")
    private String mainTitle;

    @NotNull(message = "subtitle can not empty")
    private String subtitle;
}
