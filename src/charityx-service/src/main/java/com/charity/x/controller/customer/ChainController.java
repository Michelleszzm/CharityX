package com.charity.x.controller.customer;

import com.charity.x.common.menu.ChainEnum;
import com.charity.x.common.menu.PayStatusEnum;
import com.charity.x.common.utils.MapstructUtils;
import com.charity.x.controller.BaseController;
import com.charity.x.dto.Result;
import com.charity.x.dto.ResultCode;
import com.charity.x.dto.request.CustomerTransactionRequest;
import com.charity.x.dto.response.CustomerTokenPriceResponse;
import com.charity.x.dto.response.DonationRecordResponse;
import com.charity.x.dto.vo.CharityDonationRecordVo;
import com.charity.x.dto.vo.CharityNonprofitFundraisingConfigVo;
import com.charity.x.exception.BusinessException;
import com.charity.x.service.CharityNonprofitFundraisingConfigService;
import com.charity.x.service.manager.AlchemyApiManager;
import com.charity.x.service.manager.BinanceApiManager;
import com.charity.x.service.manager.DonorManager;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/10 17:40 @Description:
 */
@Slf4j
@RestController
@RequestMapping("/customer/chain")
@RequiredArgsConstructor
@Tag(name = "[Customer]-On-chain Related Information Query", description = "On-chain Related Information Query")
public class ChainController extends BaseController {
    private final BinanceApiManager binanceApiManager;
    private final AlchemyApiManager alchemyApiManager;
    private final CharityNonprofitFundraisingConfigService charityNonprofitFundraisingConfigService;
    private final DonorManager donorManager;

    @GetMapping("/price")
    @Operation(summary = "1.Token price query", description = "Token price query")
    @Parameter(name = "site", in = ParameterIn.HEADER, description = "Site identifier", required = true, example = "ABCD")
    public Result<List<CustomerTokenPriceResponse>> price() {
        List<CustomerTokenPriceResponse> list = new ArrayList<>();
        CharityNonprofitFundraisingConfigVo configVo = charityNonprofitFundraisingConfigService.queryBySiteWithCache(getCustomerSite());
        if (configVo != null) {
            list = configVo.getPaymentValue().getTokenList().stream().map(token -> CustomerTokenPriceResponse.builder().token(token).price(binanceApiManager.getPriceWithCache(token)).build()).toList();
        }
        return Result.success(list);
    }

    @GetMapping("/latestBlockHash")
    @Operation(summary = "2.latestBlockHash query", description = "latestBlockHash query")
    @Parameter(name = "site", in = ParameterIn.HEADER, description = "Site identifier", required = true, example = "ABCD")
    public Result<String> latestBlockHash(@Schema(description = "chain", allowableValues = {"SOLANA"}, requiredMode = Schema.RequiredMode.REQUIRED, example = "SOLANA") @RequestParam String chain) {
        if (!StringUtils.hasText(chain) || !chain.equals(ChainEnum.SOLANA.getChain())) {
            throw new BusinessException(ResultCode.PARAM_ERROR.getCode(), "chain un support");
        }
        return Result.success(alchemyApiManager.getLatestBlockHash());
    }

    @GetMapping("/transaction")
    @Operation(summary = "Query transaction information", description = "Query transaction information")
    @Parameter(name = "site", in = ParameterIn.HEADER, description = "Site identifier", required = true, example = "ABCD")
    public Result<DonationRecordResponse> queryTransaction(@Validated CustomerTransactionRequest request) {
        CharityDonationRecordVo vo = donorManager.queryRecordWithSyncChainToDb(ChainEnum.getByChain(request.getChain()), request.getTxHash(), getCustomerSite());
        DonationRecordResponse response = MapstructUtils.convert(vo, DonationRecordResponse.class);
        if (response == null){
            response = DonationRecordResponse.builder()
                    .chain(request.getChain())
                    .txHash(request.getTxHash())
                    .payStatus(PayStatusEnum.PENDING.getStatus())
                    .build();
        }
        return Result.success(response);
    }
}
