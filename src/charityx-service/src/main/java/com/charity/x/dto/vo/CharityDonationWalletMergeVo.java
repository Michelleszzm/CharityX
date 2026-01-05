package com.charity.x.dto.vo;

import java.io.Serial;
import java.util.List;

import lombok.*;

/**
 * @Author: Lucass @Date: 2025/11/7 17:06 @Description:
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CharityDonationWalletMergeVo extends BaseVo {

    @Serial
    private static final long serialVersionUID = 1360768592449861451L;

    private String donorWallet;

    private SysUserVo userVo;

    private CharityDonationWalletSummaryVo summaryVo;

    private List<CharityDonationRecordVo> recordVoList;

    private List<CharityDonorNoteVo> noteVoList;
}
