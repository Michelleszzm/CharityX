package com.charity.x.dao;

import com.charity.x.dto.vo.*;
import org.apache.ibatis.annotations.Mapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@Mapper
public interface CharityDonationRecordDao {

    int save(CharityDonationRecordVo vo);

    int updateById(CharityDonationRecordVo vo);

    CharityDonationRecordVo queryById(Integer id);

    CharityDonationRecordVo queryByTxHashAndDonorWalletAndFoundationWallet(String chain,String txHash,String donorWallet,String foundationWallet);

    List<CharityDonationRecordVo> queryByTxHash(String chain,String txHash);

    CharityDonationSummaryVo queryDonationSummary(Integer userId);

    List<CharityDonationWalletSummaryVo> queryWalletSummaryList(CharityDonationRecordVo vo);

    List<CharityDonationRecordVo> queryRecordList(CharityDonationRecordVo vo);

    List<CharityDonationWalletSummaryVo> queryWalletLastList(Integer userId,List<String> walletList);

    List<CharityReportTrendVo.Trend> queryReportTrendList(CharityDonationRecordVo vo);

    List<CharityReportDistributionVo.Distribution> queryChainDistribution(Integer userId);

    List<CharityReportDistributionVo.Distribution> queryTokenDistribution(Integer userId);

    List<CharityReportDistributionVo.Distribution> queryDonationFrequencyDistribution(Integer userId,Integer max);

    BigDecimal queryMaxAmount(Integer userId);

    CharityReportDistributionVo.Distribution queryAmountDistribution(Integer userId, BigDecimal startAmount, BigDecimal endAmount);
    /**
     * Query pending records
     * @param payTimeStart
     * @param payTimeEnd
     * @return
     */
    List<CharityDonationRecordVo> queryPendingList(LocalDateTime payTimeStart, LocalDateTime payTimeEnd);
}
