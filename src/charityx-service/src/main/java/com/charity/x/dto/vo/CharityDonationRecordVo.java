package com.charity.x.dto.vo;

import java.io.Serial;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/**
 * @Author: Lucass @Date: 2025/11/7 15:26 @Description:
 */
@Data
@ToString
@EqualsAndHashCode(callSuper = true)
public class CharityDonationRecordVo extends BasePageVo {

    @Serial
    private static final long serialVersionUID = 5250198865637361304L;

    private Integer id;

    private LocalDate day;

    private Integer userId;

    private String chain;
    
    private String donorWallet;

    private String foundationWallet;
    
    private String txHash;
    
    private String token;
    
    private BigDecimal value;

    private BigDecimal amount;
    
    private LocalDateTime payTime;
    
    private Integer payStatus;

    private String error;

    private String ein;

    private String nftImage;

    private String nftId;

    private String pdfUrl;

    // Search conditions

    private BigDecimal minAmount;

    private BigDecimal maxAmount;

    private LocalDate startDay;

    private LocalDate endDay;
}
