package com.charity.x.service;

import com.charity.x.common.menu.ChainEnum;
import com.charity.x.common.menu.PayStatusEnum;
import com.charity.x.common.menu.RedisKeyEnum;
import com.charity.x.common.utils.CodeGenerateUtil;
import com.charity.x.common.utils.RedisCacheUtil;
import com.charity.x.dao.CharityDonationRecordDao;
import com.charity.x.dto.vo.*;
import com.charity.x.service.manager.BinanceApiManager;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * @Author: Lucass
 * @DateTime: 2025/11/7 16:39
 * @Description:
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CharityDonationRecordServiceImpl implements CharityDonationRecordService {
    private final CharityDonationRecordDao dao;
    private final RedisCacheUtil redisCacheUtil;
    private final CharityNonprofitFundraisingConfigService charityNonprofitFundraisingConfigService;
    private final BinanceApiManager binanceApiManager;

    @Override
    public Boolean save(CharityDonationRecordVo vo) {
        if (vo.getUserId() != null && !StringUtils.hasText(vo.getNftImage())) {
            CharityNonprofitFundraisingConfigVo configVo = charityNonprofitFundraisingConfigService.queryByUserId(vo.getUserId());
            if (configVo != null) {
                vo.setEin(configVo.getPublishValue().getEin());
                if (StringUtils.hasText(configVo.getNftImage())){
                    vo.setNftImage(configVo.getNftImage());
                    vo.setNftId(CodeGenerateUtil.randomNftCode(10));
                }
            } else {
                log.warn("groupUserId:{},not config ntf image; config={}", vo.getUserId(), configVo);
            }
        }
        if (StringUtils.hasText(vo.getToken()) && vo.getValue() != null && vo.getValue().compareTo(BigDecimal.ZERO) > 0 && (vo.getAmount() == null || vo.getAmount().compareTo(BigDecimal.ZERO) <= 0)) {
            BigDecimal price = binanceApiManager.getPriceWithCache(vo.getToken());
            vo.setAmount(vo.getValue().multiply(price));
        }
        return dao.save(vo) > 0;
    }

    @Override
    public Boolean updateByIdWithClearCache(CharityDonationRecordVo vo) {
        CharityDonationRecordVo recordVo = dao.queryById(vo.getId());
        if (recordVo != null){
            String key = RedisKeyEnum.getKey(RedisKeyEnum.DONATION_RECORD_TX_INFO, recordVo.getChain(), recordVo.getTxHash());
            redisCacheUtil.delete(key);
            return dao.updateById(vo) > 0;
        }
        return Boolean.FALSE;
    }

    @Override
    public Boolean chainInfoSaveOrUpdate(CharityDonationRecordVo vo) {
        // Check status
        if (vo.getPayStatus() == PayStatusEnum.FINISH.getStatus()) {
            CharityDonationRecordVo recordVo = dao.queryByTxHashAndDonorWalletAndFoundationWallet(vo.getChain(), vo.getTxHash(), vo.getDonorWallet(), vo.getFoundationWallet());
            if (recordVo != null) {
                vo.setId(recordVo.getId());
                dao.updateById(vo);
            } else {
                save(vo);
            }
        } else {
            List<CharityDonationRecordVo> voList = dao.queryByTxHash(vo.getChain(), vo.getTxHash());
            if (!CollectionUtils.isEmpty(voList)) {
                for (CharityDonationRecordVo recordVo : voList) {
                    vo.setId(recordVo.getId());
                    dao.updateById(vo);
                }
            } else {
                save(vo);
            }
        }
        return Boolean.TRUE;
    }

    @Override
    public List<CharityDonationRecordVo> queryByTxHashWithCache(ChainEnum chainEnum, String txHash) {
        String key = RedisKeyEnum.getKey(RedisKeyEnum.DONATION_RECORD_TX_INFO, chainEnum.getChain(), txHash);
        List<CharityDonationRecordVo> recordVo = redisCacheUtil.get(key, new TypeReference<List<CharityDonationRecordVo>>() {
        });
        if (recordVo == null) {
            List<CharityDonationRecordVo> dbVo = dao.queryByTxHash(chainEnum.getChain(), txHash);
            if (!CollectionUtils.isEmpty(dbVo) && dbVo.get(0).getPayStatus() != PayStatusEnum.PENDING.getStatus()) {
                redisCacheUtil.set(key, dbVo, RedisKeyEnum.DONATION_RECORD_TX_INFO.getExpire(), TimeUnit.SECONDS);
                recordVo = dbVo;
            }
        }
        return recordVo;
    }

    @Override
    public CharityDonationSummaryVo queryDonationSummary(Integer userId) {
        return dao.queryDonationSummary(userId);
    }

    @Override
    public List<CharityDonationWalletSummaryVo> queryWalletSummaryList(CharityDonationRecordVo vo) {
        if (vo.getPayStatus() == null){
            vo.setPayStatus(PayStatusEnum.FINISH.getStatus());
        }
        return dao.queryWalletSummaryList(vo);
    }

    @Override
    public List<CharityDonationRecordVo> queryRecordList(CharityDonationRecordVo vo) {
        if (vo.getPayStatus() == null) {
            vo.setPayStatus(PayStatusEnum.FINISH.getStatus());
        }
        return dao.queryRecordList(vo);
    }

    @Override
    public List<CharityDonationWalletSummaryVo> queryWalletLastList(Integer userId, List<String> walletList) {
        return dao.queryWalletLastList(userId, walletList);
    }

    @Override
    public List<CharityReportTrendVo.Trend> queryReportTrendList(CharityDonationRecordVo vo) {
        return dao.queryReportTrendList(vo);
    }

    @Override
    public List<CharityReportDistributionVo.Distribution> queryChainDistribution(Integer userId) {
        return dao.queryChainDistribution(userId);
    }

    @Override
    public List<CharityReportDistributionVo.Distribution> queryTokenDistribution(Integer userId) {
        return dao.queryTokenDistribution(userId);
    }

    @Override
    public BigDecimal queryMaxAmount(Integer userId) {
        return dao.queryMaxAmount(userId);
    }

    @Override
    public CharityReportDistributionVo.Distribution queryAmountDistribution(Integer userId, BigDecimal startAmount, BigDecimal endAmount) {
        return dao.queryAmountDistribution(userId, startAmount, endAmount);
    }

    @Override
    public List<CharityReportDistributionVo.Distribution> queryDonationFrequencyDistribution(Integer userId, Integer max) {
        return dao.queryDonationFrequencyDistribution(userId, max);
    }

    @Override
    public List<CharityDonationRecordVo> queryPendingList(LocalDateTime payTimeStart, LocalDateTime payTimeEnd) {
        return dao.queryPendingList(payTimeStart, payTimeEnd);
    }
}
