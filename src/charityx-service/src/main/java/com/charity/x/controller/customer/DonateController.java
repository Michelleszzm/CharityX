package com.charity.x.controller.customer;

import com.charity.x.common.utils.MapstructUtils;
import com.charity.x.controller.BaseController;
import com.charity.x.dto.Result;
import com.charity.x.dto.ResultCode;
import com.charity.x.dto.request.CustomerSendTransactionRequest;
import com.charity.x.dto.vo.CharityDonationRecordVo;
import com.charity.x.dto.vo.CharityNonprofitFundraisingConfigVo;
import com.charity.x.exception.BusinessException;
import com.charity.x.service.manager.AlchemyApiManager;
import com.charity.x.service.manager.DonorManager;
import com.charity.x.service.manager.FundraisingManager;
import com.charity.x.dto.response.NonprofitFundraisingConfigResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * @Author: Lucass @Date: 2025/11/7 20:07 @Description:
 */
@Slf4j
@RestController
@RequestMapping("/customer/donors")
@Tag(name = "[Customer]-Donation Homepage", description = "Donation Homepage")
@RequiredArgsConstructor
public class DonateController extends BaseController {
    private final DonorManager donorManager;
    private final FundraisingManager fundraisingManager;
    private final AlchemyApiManager alchemyApiManager;

    @GetMapping("/config")
    @Operation(summary = "Query configuration information", description = "Query configuration information")
    @Parameters({@Parameter(name = "site", in = ParameterIn.HEADER, description = "Site identifier", required = true, example = "ABCD")})
    public Result<NonprofitFundraisingConfigResponse> config() {
        CharityNonprofitFundraisingConfigVo configVo = fundraisingManager.customerQueryConfigBySitWithCache(getCustomerSite());
        if (configVo == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        return Result.success(MapstructUtils.convert(configVo, NonprofitFundraisingConfigResponse.class));
    }

    @PostMapping("")
    @Operation(summary = "Save donation record", description = "Save donation record")
    @Parameters({@Parameter(name = "site", in = ParameterIn.HEADER, description = "Site identifier", required = true, example = "ABCD")})
    public Result<String> save(@Validated @RequestBody CustomerSendTransactionRequest request) {
        Integer groupUserId = getCustomerGroupUserIdWithCheck();
        String txHash = alchemyApiManager.sendTx(request.getEncodeSerializedTransaction());
        CharityDonationRecordVo vo = MapstructUtils.convert(request, CharityDonationRecordVo.class);
        assert vo != null;
        vo.setUserId(groupUserId);
        vo.setTxHash(txHash);
        donorManager.asyncCustomerSaveDonationRecord(vo);
        return Result.success(txHash);
    }
}
