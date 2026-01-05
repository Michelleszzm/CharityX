package com.charity.x.dto.entity;

import java.io.Serial;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @Author: Lucass @Date: 2025/11/7 15:26 @Description:
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CharityDonationRecord extends BaseEntity{

    @Serial
    private static final long serialVersionUID = 1866425219432761980L;

    private LocalDate day;

    private Integer userId;

    private String chain;

    private String donorWallet;

    private String foundationWallet;

    private String txHash;

    private String token;

    private BigDecimal value;

    private BigDecimal amount;

    private String ein;

    private String nftImage;

    private String nftId;

    private LocalDateTime payTime;

    private Integer payStatus;

    private String error;

    private String pdfUrl;
}
