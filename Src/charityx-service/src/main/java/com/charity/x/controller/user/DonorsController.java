package com.charity.x.controller.user;

import com.charity.x.common.menu.PayStatusEnum;
import com.charity.x.common.utils.CodeGenerateUtil;
import com.charity.x.common.utils.MapstructUtils;
import com.charity.x.controller.BaseController;
import com.charity.x.dto.Result;
import com.charity.x.dto.request.*;
import com.charity.x.dto.response.*;
import com.charity.x.dto.vo.*;
import com.charity.x.service.CharityNonprofitFundraisingConfigService;
import com.charity.x.service.manager.BinanceApiManager;
import com.charity.x.service.manager.DonorManager;
import com.github.pagehelper.PageInfo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/7 16:44 @Description:
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user/donors")
@Tag(name = "4.Fundraising Records", description = "Fundraising Records Endpoints")
public class DonorsController extends BaseController {

    private final DonorManager donorManager;
    private final CharityNonprofitFundraisingConfigService charityNonprofitFundraisingConfigService;

    @GetMapping("/summary")
    @Operation(summary = "Fundraising summary information query", description = "Fundraising summary information query")
    public Result<CharityDonationSummaryVo> queryDonationSummary() {
        return Result.success(donorManager.queryDonationSummary(getUserIdWithCheckLogin()));
    }


    @GetMapping("/list")
    @Operation(summary = "Fundraising user list query - pagination", description = "Fundraising user list query - pagination")
    public Result<PageInfo<DonorsListResponse>> queryListPage(CharityDonationRecordSearchRequest request) {
        CharityDonationRecordVo vo = MapstructUtils.convert(request, CharityDonationRecordVo.class);
        vo.setUserId(getUserIdWithCheckLogin());
        return Result.success(MapstructUtils.convertPage(donorManager.queryListPage(vo), DonorsListResponse.class));
    }

    @GetMapping("/wallet")
    @Operation(summary = "Fundraising user detail query", description = "Fundraising user detail query")
    public Result<DonationWalletMergeResponse> queryWalletDetail(@Validated DonationWalletMergeRequest request) {
        CharityDonationRecordVo vo = MapstructUtils.convert(request, CharityDonationRecordVo.class);
        vo.setUserId(getUserIdWithCheckLogin());
        CharityDonationWalletMergeVo charityDonationWalletMergeVo = donorManager.queryDonationWalletDetail(vo);
        DonationWalletMergeResponse response = null;
        if (charityDonationWalletMergeVo != null) {
            response = DonationWalletMergeResponse.builder()
                    .user(MapstructUtils.convert(charityDonationWalletMergeVo.getUserVo(), UserDetailResponse.class))
                    .summary(MapstructUtils.convert(charityDonationWalletMergeVo.getSummaryVo(), DonorsListResponse.class))
                    .recordList(MapstructUtils.convert(charityDonationWalletMergeVo.getRecordVoList(), DonationRecordResponse.class))
                    .noteList(MapstructUtils.convert(charityDonationWalletMergeVo.getNoteVoList(), DonorNoteDetailResponse.class))
                    .build();
        }
        return Result.success(response);
    }

    @PostMapping("/wallet/complete")
    @Operation(summary = "Complete donation user information", description = "Complete donation user information")
    public Result<UserDetailResponse> walletComplete(@RequestBody @Validated DonorWalletCompleteRequest request) {
        SysUserVo sysUserVo = MapstructUtils.convert(request, SysUserVo.class);
        sysUserVo.setProvider(request.getChain());
        sysUserVo.setProviderId(request.getWallet());
        sysUserVo.setGroupUserId(getUserIdWithCheckLogin());
        return Result.success(MapstructUtils.convert(donorManager.walletComplete(sysUserVo), UserDetailResponse.class));
    }

    @GetMapping("/record")
    @Operation(summary = "Fundraising record query - pagination", description = "Fundraising record query - pagination")
    public Result<PageInfo<DonationRecordResponse>> queryRecordPage(CharityDonationRecordSearchRequest request) {
        CharityDonationRecordVo vo = MapstructUtils.convert(request, CharityDonationRecordVo.class);
        vo.setUserId(getUserIdWithCheckLogin());
        PageInfo<CharityDonationRecordVo> page = donorManager.queryRecordPage(vo);
        return Result.success(MapstructUtils.convertPage(page, DonationRecordResponse.class));
    }

    @PostMapping("/note")
    @Operation(summary = "Add note", description = "Add note")
    public Result<List<DonorNoteDetailResponse>> addNote(@Validated @RequestBody DonorNoteDetailRequest request) {
        CharityDonorNoteVo vo = MapstructUtils.convert(request, CharityDonorNoteVo.class);
        return Result.success(MapstructUtils.convert(donorManager.addNote(vo), DonorNoteDetailResponse.class));
    }

    @Autowired
    private BinanceApiManager binanceApiManager;

    @PostMapping("/test/init/record")
    @Operation(summary = "Actively add test data", description = "Actively add test data")
    public Result<Boolean> initRecord(@RequestBody @Validated TestCharityDonationRecordInitRequest request) {
        CharityNonprofitFundraisingConfigVo configVo = charityNonprofitFundraisingConfigService.queryByUserId(getUserIdWithCheckLogin());
        for (int i = 0; i < request.getRows(); i++) {
            CharityDonationRecordVo vo = new CharityDonationRecordVo();
            vo.setDay(LocalDate.now().minusDays(i / 10));
            vo.setUserId(getUserIdWithCheckLogin());
            vo.setChain(request.getChain());
            vo.setDonorWallet("TEST-" + LocalDate.now() + "-WWWWWWWW-" + i);
            vo.setFoundationWallet("TEST-WALLET-" + "xxxxxxxxxxxx");
            vo.setTxHash("TEST-HASH-XXXXXXXXXX" + i);
            vo.setToken(request.getToken());
            vo.setValue(BigDecimal.valueOf(i));
            vo.setAmount(binanceApiManager.getPriceWithCache(request.getToken()).multiply(BigDecimal.valueOf(i)));
            vo.setPayTime(LocalDateTime.now());
            vo.setPayStatus(PayStatusEnum.FINISH.getStatus());
            if (configVo != null){
                vo.setNftImage(configVo.getNftImage());
                vo.setNftId(CodeGenerateUtil.randomNftCode(10));
            }
            donorManager.asyncCustomerSaveDonationRecord(vo);
        }
        return Result.success(true);
    }
}
