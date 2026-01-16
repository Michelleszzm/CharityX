package com.charity.x.task;

import com.charity.x.common.menu.ChainEnum;
import com.charity.x.common.menu.PayStatusEnum;
import com.charity.x.common.menu.TokenEnum;
import com.charity.x.dto.vo.CharityDonationRecordVo;
import com.charity.x.dto.vo.CharityNonprofitFundraisingConfigVo;
import com.charity.x.service.CharityDonationRecordService;
import com.charity.x.service.CharityNonprofitFundraisingConfigService;
import com.charity.x.service.manager.BinanceApiManager;
import com.charity.x.service.manager.DonorManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/10 17:06 @Description:
 */
@Slf4j
@RequiredArgsConstructor
@Component
public class ChainCommonTask {
    private final BinanceApiManager binanceApiManager;
    private final DonorManager donorManager;
    private final CharityDonationRecordService charityDonationRecordService;
    private final CharityNonprofitFundraisingConfigService charityNonprofitFundraisingConfigService;


    @Scheduled(cron = "0 0/5 * * * ?")
    public void refreshTokenPrice() {
        log.info("Start refreshing TOKEN price");
        BigDecimal price = binanceApiManager.refreshTokenPrice(TokenEnum.SOL);
        log.info("TOKEN price refresh completed: SOL={}", price);
    }

    @Scheduled(cron = "0/10 * * * * ?")
    public void checkDonationRecordFromChain() {
        LocalDateTime start = LocalDateTime.now().minusHours(1);
        LocalDateTime end = LocalDateTime.now().minusSeconds(5);
        int size = 0;
        List<CharityDonationRecordVo> voList = charityDonationRecordService.queryPendingList(start, end);
        if (!CollectionUtils.isEmpty(voList)) {
            size = voList.size();
            for (CharityDonationRecordVo vo : voList) {
                if (vo.getPayTime().isBefore(LocalDateTime.now().minusMinutes(3))) {
                    vo.setPayStatus(PayStatusEnum.CHAIN_NOT_FUND.getStatus());
                    vo.setError(PayStatusEnum.CHAIN_NOT_FUND.toString());
                    charityDonationRecordService.chainInfoSaveOrUpdate(vo);
                    log.info("【RecordTask】txHash chain not fund:{}", vo);
                } else {
                    CharityNonprofitFundraisingConfigVo configVo = charityNonprofitFundraisingConfigService.queryByUserId(vo.getUserId());
                    if (configVo != null) {
                        donorManager.syncChainToDb(ChainEnum.getByChain(vo.getChain()), vo.getTxHash(), configVo.getSite());
                    } else {
                        log.error("【RecordTask】groupUserId:{},not found config; config={}", vo.getUserId(), configVo);
                    }
                }
            }
        }
        log.info("[RecordTask] checkDonationRecordFromChain completed, processed [{}] records",size);
    }
}
