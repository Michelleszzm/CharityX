package com.charity.x.controller.customer;

import com.charity.x.common.utils.MapstructUtils;
import com.charity.x.controller.BaseController;
import com.charity.x.dto.Result;
import com.charity.x.dto.request.CustomerReceiptWithNftRequest;
import com.charity.x.dto.response.DonationRecordResponse;
import com.charity.x.dto.vo.CharityDonationRecordVo;
import com.charity.x.service.manager.DonorManager;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/7 20:07 @Description:
 */
@Slf4j
@RestController
@RequestMapping("/customer/receipt")
@Tag(name = "[Customer]-Receipt & NFT Information", description = "[Customer]-View Receipt & NFT Information")
public class ReceiptController extends BaseController {

    @Autowired
    private DonorManager donorManager;

    @GetMapping("/with/nft")
    @Operation(summary = "Overview", description = "Overview")
    @Parameters({@Parameter(name = "site", in = ParameterIn.HEADER, description = "Site identifier", required = true, example = "ABCD")})
    public Result<List<DonationRecordResponse>> customerReceiptWithNFT(@Validated @ParameterObject CustomerReceiptWithNftRequest request) {
        CharityDonationRecordVo vo = MapstructUtils.convert(request, CharityDonationRecordVo.class);
        vo.setUserId(getCustomerGroupUserIdWithCheck());
        return Result.success(MapstructUtils.convert(donorManager.customerReceiptsAndNfts(vo), DonationRecordResponse.class));
    }
}
