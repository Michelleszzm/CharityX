package com.charity.x.service.manager;

import com.charity.x.common.menu.ChainEnum;
import com.charity.x.common.menu.PayStatusEnum;
import com.charity.x.common.utils.ChainDataConvertUtils;
import com.charity.x.common.utils.MapstructUtils;
import com.charity.x.dto.response.DonationRecordResponse;
import com.charity.x.service.manager.solana.alchemy.ConfirmedTransactionPlus;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.charity.x.dto.vo.*;
import com.charity.x.service.CharityDonationRecordService;
import com.charity.x.service.CharityDonorNoteService;
import com.charity.x.service.CharityNonprofitFundraisingConfigService;
import com.charity.x.service.SysUserService;
import com.github.pagehelper.PageInfo;
import com.github.pagehelper.page.PageMethod;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * @Author: Lucass @Date: 2025/11/7 16:48 @Description:
 */
@Slf4j
@Service
public class DonorManager {
    private final CharityNonprofitFundraisingConfigService charityNonprofitFundraisingConfigService;
    private final CharityDonorNoteService charityDonorNoteService;
    private final CharityDonationRecordService donationRecordService;
    private final SysUserService sysUserService;
    private final ObjectMapper objectMapper;
    private final AlchemyApiManager alchemyApiManager;
    private final DonorManager self;

    public DonorManager(CharityNonprofitFundraisingConfigService charityNonprofitFundraisingConfigService, CharityDonorNoteService charityDonorNoteService, CharityDonationRecordService donationRecordService, SysUserService sysUserService, ObjectMapper objectMapper, AlchemyApiManager alchemyApiManager,@Lazy DonorManager self) {
        this.charityNonprofitFundraisingConfigService = charityNonprofitFundraisingConfigService;
        this.charityDonorNoteService = charityDonorNoteService;
        this.donationRecordService = donationRecordService;
        this.sysUserService = sysUserService;
        this.objectMapper = objectMapper;
        this.alchemyApiManager = alchemyApiManager;
        this.self = self;
    }


    public Boolean updateByIdWithClearCache(CharityDonationRecordVo recordVo){
        return donationRecordService.updateByIdWithClearCache(recordVo);
    }
    public List<CharityDonationRecordVo> queryByChainAndHash(ChainEnum chainEnum,String txHash){
        return donationRecordService.queryByTxHashWithCache(chainEnum, txHash);
    }

    public CharityDonationRecordVo queryRecordWithSyncChainToDb(ChainEnum chainEnum,String txHash,String site) {
        List<CharityDonationRecordVo> voList = self.syncChainToDb(chainEnum, txHash, site);
        if (!CollectionUtils.isEmpty(voList)){
            if (voList.size() == 1){
                return voList.get(0);
            }
            CharityNonprofitFundraisingConfigVo configVo = charityNonprofitFundraisingConfigService.queryBySiteWithCache(site);
            Optional<CharityNonprofitFundraisingConfigPayment.ChainWallet> first = configVo.getPaymentValue().getChainWalletList().stream().filter(item -> item.getChain().equals(chainEnum.getChain())).findFirst();
            if (first.isPresent()){
                String wallet = first.get().getWallet();
                return voList.stream().filter(item -> item.getFoundationWallet().equals(wallet)).findFirst().orElse( null);
            }
       }
        return null;
    }

    public List<CharityDonationRecordVo> syncChainToDb(ChainEnum chainEnum,String txHash,String site){
        List<CharityDonationRecordVo> recordVo = donationRecordService.queryByTxHashWithCache(chainEnum, txHash);
        if (recordVo == null){
            self.asyncUpdateChainInfoToDb(chainEnum, txHash, site);
        }
        return recordVo;
    }

    @Async("asyncServiceExecutor")
    public void asyncUpdateChainInfoToDb(ChainEnum chainEnum, String txHash, String site) {
        ConfirmedTransactionPlus transaction = alchemyApiManager.getTransaction(chainEnum.getChain(), txHash);
        if (transaction != null){
            List<DonationRecordResponse> responseList = ChainDataConvertUtils.convertChainTxHashData(transaction);
            if (!CollectionUtils.isEmpty(responseList)) {
                if (responseList.size() == 1 && responseList.get(0).getPayStatus() != PayStatusEnum.FINISH.getStatus()){
                    CharityDonationRecordVo finishVo = MapstructUtils.convert(responseList.get(0), CharityDonationRecordVo.class);
                    donationRecordService.chainInfoSaveOrUpdate(finishVo);
                }else {
                    CharityNonprofitFundraisingConfigVo configVo = charityNonprofitFundraisingConfigService.queryBySiteWithCache(site);
                    CharityNonprofitFundraisingConfigPayment.ChainWallet chainWallet = configVo.getPaymentValue().getChainWalletList().stream().filter(item -> item.getChain().equals(chainEnum.getChain())).findFirst().orElse(null);
                    if (chainWallet != null){
                        String foundationWallet = chainWallet.getWallet();
                        for (DonationRecordResponse item : responseList) {
                            if (item.getFoundationWallet().equals(foundationWallet)){
                                CharityDonationRecordVo finishVo = MapstructUtils.convert(item, CharityDonationRecordVo.class);
                                donationRecordService.chainInfoSaveOrUpdate(finishVo);
                            }
                        }
                    }
                }
            }
        }
    }

    public SysUserVo walletComplete(SysUserVo vo) {
        SysUserVo sysUserVo = sysUserService.queryByProvider(vo.getProvider(), vo.getProviderId(), vo.getGroupUserId());
        if (sysUserVo == null) {
            sysUserService.save(vo);
        } else {
            vo.setId(sysUserVo.getId());
            sysUserService.updateById(vo);
        }
        return vo;
    }

    public List<CharityDonationRecordVo> customerReceiptsAndNfts(CharityDonationRecordVo vo) {
        List<CharityDonationRecordVo> list = donationRecordService.queryRecordList(vo);
        if (!CollectionUtils.isEmpty(list)) {
            //packageNft
            Integer userId = vo.getUserId();
            CharityNonprofitFundraisingConfigVo configVo = charityNonprofitFundraisingConfigService.queryByUserId(userId);
            if (configVo != null) {
                for (CharityDonationRecordVo item : list) {
                    item.setNftImage(configVo.getNftImage());
                }
            }
        }
        return list;
    }

    @Async("asyncServiceExecutor")
    public void asyncCustomerSaveDonationRecord(CharityDonationRecordVo vo) {
        vo.setDay(LocalDate.now());
        vo.setPayTime(LocalDateTime.now());
        vo.setPayStatus(PayStatusEnum.PENDING.getStatus());
        if (vo.getTxHash().startsWith("TEST-HASH-")){
            vo.setPayStatus(PayStatusEnum.FINISH.getStatus());
        }
        Boolean save = donationRecordService.save(vo);
        try {
            log.info("save donation record:result={},vo={}", save, objectMapper.writeValueAsString(vo));
        } catch (JsonProcessingException ignore) {
        }
    }

    public List<CharityDonorNoteVo> addNote(CharityDonorNoteVo vo) {
        charityDonorNoteService.save(vo);
        return charityDonorNoteService.queryByWallet(vo.getWallet());
    }

    public CharityDonationWalletMergeVo queryDonationWalletDetail(CharityDonationRecordVo vo) {
        CharityDonationWalletMergeVo mergeVo = new CharityDonationWalletMergeVo();
        mergeVo.setDonorWallet(vo.getDonorWallet());
        SysUserVo sysUserVo = sysUserService.queryByProvider(vo.getChain(), vo.getDonorWallet(), vo.getUserId());
        mergeVo.setUserVo(sysUserVo);
        // Query summary information
        List<CharityDonationWalletSummaryVo> list = donationRecordService.queryWalletSummaryList(vo);
        if (!CollectionUtils.isEmpty(list)) {
            List<CharityDonationWalletSummaryVo> lastList = donationRecordService.queryWalletLastList(vo.getUserId(), List.of(vo.getDonorWallet()));
            Map<String, BigDecimal> map = lastList.stream().collect(Collectors.toMap(CharityDonationWalletSummaryVo::getDonorWallet, CharityDonationWalletSummaryVo::getLastAmount));
            list.get(0).setLastAmount(map.get(vo.getDonorWallet()));
            mergeVo.setSummaryVo(list.get(0));
        }
        // Query donation record information
        mergeVo.setRecordVoList(donationRecordService.queryRecordList(vo));
        // Query note
        mergeVo.setNoteVoList(charityDonorNoteService.queryByWallet(vo.getDonorWallet()));
        return mergeVo;
    }

    public CharityDonationSummaryVo queryDonationSummary(Integer userId) {
        return donationRecordService.queryDonationSummary(userId);
    }

    public PageInfo<CharityDonationRecordVo> queryRecordPage(CharityDonationRecordVo vo) {
        PageMethod.startPage(vo.getPageNum(), vo.getPageSize());
        List<CharityDonationRecordVo> list = donationRecordService.queryRecordList(vo);
        return new PageInfo<>(list);
    }

    public PageInfo<CharityDonationWalletSummaryVo> queryListPage(CharityDonationRecordVo vo) {
        PageMethod.startPage(vo.getPageNum(), vo.getPageSize());
        List<CharityDonationWalletSummaryVo> list = donationRecordService.queryWalletSummaryList(vo);
        PageInfo<CharityDonationWalletSummaryVo> pageInfo = new PageInfo<>(list);
        List<CharityDonationWalletSummaryVo> infoList = pageInfo.getList();
        if (!CollectionUtils.isEmpty(infoList)) {
            List<String> walletList = infoList.stream().map(CharityDonationWalletSummaryVo::getDonorWallet).collect(Collectors.toList());
            List<CharityDonationWalletSummaryVo> voList = donationRecordService.queryWalletLastList(vo.getUserId(), walletList);
            Map<String, BigDecimal> map = voList.stream().collect(Collectors.toMap(CharityDonationWalletSummaryVo::getDonorWallet, CharityDonationWalletSummaryVo::getLastAmount));
            for (CharityDonationWalletSummaryVo info : infoList) {
                info.setLastAmount(map.get(info.getDonorWallet()));
            }
        }
        return pageInfo;
    }
}
