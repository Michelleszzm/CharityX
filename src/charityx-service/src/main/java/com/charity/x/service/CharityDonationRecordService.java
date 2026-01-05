package com.charity.x.service;

import com.charity.x.common.menu.ChainEnum;
import com.charity.x.dto.vo.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/7 16:39 @Description:
 */
public interface CharityDonationRecordService {

    Boolean save(CharityDonationRecordVo vo);

    /**
     * Update by ID
     * @param vo
     * @return
     */
    Boolean updateByIdWithClearCache(CharityDonationRecordVo vo);

    /**
     * Save or update after syncing on-chain information
     *
     * @param vo
     * @return
     */
    Boolean chainInfoSaveOrUpdate(CharityDonationRecordVo vo);

    /**
     * Query by transaction hash
     *
     * @param chainEnum Chain
     * @param txHash    Transaction hash
     * @return List<CharityDonationRecordVo>
     */
    List<CharityDonationRecordVo> queryByTxHashWithCache(ChainEnum chainEnum, String txHash);

    CharityDonationSummaryVo queryDonationSummary(Integer userId);

    List<CharityDonationWalletSummaryVo> queryWalletSummaryList(CharityDonationRecordVo vo);

    List<CharityDonationRecordVo> queryRecordList(CharityDonationRecordVo vo);

    List<CharityDonationWalletSummaryVo> queryWalletLastList(Integer userId, List<String> walletList);

    List<CharityReportTrendVo.Trend> queryReportTrendList(CharityDonationRecordVo vo);

    List<CharityReportDistributionVo.Distribution> queryChainDistribution(Integer userId);

    List<CharityReportDistributionVo.Distribution> queryTokenDistribution(Integer userId);

    BigDecimal queryMaxAmount(Integer userId);

    CharityReportDistributionVo.Distribution queryAmountDistribution(Integer userId, BigDecimal startAmount, BigDecimal endAmount);

    List<CharityReportDistributionVo.Distribution> queryDonationFrequencyDistribution(Integer userId, Integer max);

    List<CharityDonationRecordVo> queryPendingList(LocalDateTime payTimeStart, LocalDateTime payTimeEnd);
}
