package com.charity.x.service.manager;

import com.charity.x.common.menu.RedisKeyEnum;
import com.charity.x.common.utils.RedisCacheUtil;
import com.charity.x.dto.vo.*;
import com.charity.x.service.CharityDonationRecordService;
import com.charity.x.service.CharityNonprofitFundraisingConfigService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * @Author: Lucass @Date: 2025/11/8 09:55 @Description:
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReportManager {
    private final RedisCacheUtil redisCacheUtil;
    private final CharityDonationRecordService donationRecordService;
    private final CharityNonprofitFundraisingConfigService charityNonprofitFundraisingConfigService;


    public CharityReportSummaryVo querySummary(Integer userId) {
        CharityReportSummaryVo vo = new CharityReportSummaryVo();
        CharityDonationSummaryVo summaryVo = donationRecordService.queryDonationSummary(userId);
        if (summaryVo != null) {
            BeanUtils.copyProperties(summaryVo, vo);
            if (summaryVo.getDonors() > 0){
                vo.setDonationPerCapita(summaryVo.getTotalDonations().divide(new BigDecimal(summaryVo.getDonors()), 2, RoundingMode.HALF_UP));
            }
        }
        return vo;
    }

    public CharityReportTrendVo queryTrend(CharityDonationRecordVo vo) {
        List<CharityReportTrendVo.Trend> trendList = donationRecordService.queryReportTrendList(vo);
        return CharityReportTrendVo.builder().trendList(trendList).build();
    }

    public CharityReportDistributionVo queryDistributionSpecial(Integer userId) {
        String key = RedisKeyEnum.getKey(RedisKeyEnum.DONATION_AMOUNT_DISTRIBUTION_INFO, String.valueOf(userId));
        CharityReportDistributionVo vo = redisCacheUtil.get(key, CharityReportDistributionVo.class);
        if (vo == null) {
            // Set default value
            vo = CharityReportDistributionVo.builder().donationAmount(List.of()).build();
            // Query price difference and split
            CharityNonprofitFundraisingConfigVo configVo = charityNonprofitFundraisingConfigService.queryByUserId(userId);
            if (configVo != null && configVo.getFormValue() != null && !CollectionUtils.isEmpty(configVo.getFormValue().getAmountList())){
                CharityNonprofitFundraisingConfigForm formValue = configVo.getFormValue();
                List<BigDecimal> amountList = new ArrayList();
                for (String amountStr : formValue.getAmountList()) {
                    amountList.add(BigDecimal.valueOf(Double.parseDouble(amountStr)));
                }
                Collections.sort(amountList);
                List<CharityReportDistributionVo.Distribution> amountDistribution = new ArrayList();
                BigDecimal preAmount = BigDecimal.ZERO;
                amountList.add(BigDecimal.valueOf(100000000000000L));
                for (BigDecimal amount : amountList) {
                    CharityReportDistributionVo.Distribution distribution = donationRecordService.queryAmountDistribution(userId, preAmount, amount);
                    if (distribution != null && distribution.getDonors() > 0) {
                        if (amount.compareTo(BigDecimal.valueOf(100000000000000L)) == 0) {
                            distribution.setName("Above $" + preAmount.intValue());
                        } else {
                            distribution.setName("$" + preAmount.intValue() + "~" + amount.intValue());
                        }
                        amountDistribution.add(distribution);
                    }
                    preAmount = amount;
                }
                packagePercent(amountDistribution);
                vo = CharityReportDistributionVo.builder().donationAmount(amountDistribution).build();
                redisCacheUtil.set(key, vo, RedisKeyEnum.DONATION_AMOUNT_DISTRIBUTION_INFO.getExpire(), TimeUnit.SECONDS);
            }
        }
        return vo;
    }

    public CharityReportDistributionVo queryDistribution(Integer userId) {
        List<CharityReportDistributionVo.Distribution> chain = donationRecordService.queryChainDistribution(userId);
        packagePercent(chain);
        List<CharityReportDistributionVo.Distribution> token = donationRecordService.queryTokenDistribution(userId);
        packagePercent(token);
        List<CharityReportDistributionVo.Distribution> donationFrequency = donationRecordService.queryDonationFrequencyDistribution(userId, 5);
        packagePercent(donationFrequency);
        //todo
        return CharityReportDistributionVo.builder().chain(chain).token(token).donationFrequency(donationFrequency).build();
    }

    private void packagePercent(List<CharityReportDistributionVo.Distribution> distributionList) {
        if (!CollectionUtils.isEmpty(distributionList)) {
            int total = distributionList.stream()
                    .map(CharityReportDistributionVo.Distribution::getDonors)
                    .reduce(0, Integer::sum);
            BigDecimal totalDecimal = BigDecimal.valueOf(total);
            distributionList.forEach(item -> {
                BigDecimal percent = BigDecimal.valueOf(item.getDonors())
                        .divide(totalDecimal, 4, RoundingMode.HALF_UP); // Recommend higher precision
                item.setPercent(percent);
            });
            BigDecimal percent = BigDecimal.valueOf(1);
            for (CharityReportDistributionVo.Distribution distribution : distributionList) {
                percent = percent.subtract(distribution.getPercent());
            }
            CharityReportDistributionVo.Distribution distribution = distributionList.get(0);
            distribution.setPercent(distribution.getPercent().add(percent));
        }
    }
}
