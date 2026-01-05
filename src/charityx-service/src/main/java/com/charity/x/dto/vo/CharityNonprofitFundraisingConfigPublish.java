package com.charity.x.dto.vo;

import java.io.Serial;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * @Author: Lucass @Date: 2025/11/6 19:51 @Description:
 */
@Data
public class CharityNonprofitFundraisingConfigPublish {

    @Serial
    private static final long serialVersionUID = -7276862199287451513L;

    @NotNull(message = "site address can not empty")
    private String site;

    private String ein;

    private String nftImage;

    private String metaTitle;

    private String metaDescription;

    private String metaKeywords;
}
