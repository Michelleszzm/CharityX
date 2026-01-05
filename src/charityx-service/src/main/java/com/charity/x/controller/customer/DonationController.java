package com.charity.x.controller.customer;

import com.charity.x.common.menu.ChainEnum;
import com.charity.x.common.utils.MapstructUtils;
import com.charity.x.common.utils.PdfGeneratorUtil;
import com.charity.x.controller.BaseController;
import com.charity.x.dto.Result;
import com.charity.x.dto.ResultCode;
import com.charity.x.dto.request.AwsS3PreSignedUrlRequest;
import com.charity.x.dto.request.CustomerDonationOverviewRequest;
import com.charity.x.dto.response.AwsS3PreSignedUrlResponse;
import com.charity.x.dto.response.DonationRecordResponse;
import com.charity.x.dto.vo.CharityDonationRecordVo;
import com.charity.x.dto.vo.CharityNonprofitFundraisingConfigVo;
import com.charity.x.exception.BusinessException;
import com.charity.x.service.CharityNonprofitFundraisingConfigService;
import com.charity.x.service.manager.AwsS3Manager;
import com.charity.x.service.manager.DonorManager;
import com.github.pagehelper.PageInfo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.UUID;

/**
 * @Author: Lucass @Date: 2025/11/7 20:07 @Description:
 */
@Slf4j
@RestController
@RequestMapping("/customer/donation")
@Tag(name = "[Customer]-View Donation Information", description = "[Customer]-View Donation Information")
public class DonationController extends BaseController {

    @Autowired
    private DonorManager donorManager;
    @Autowired
    private CharityNonprofitFundraisingConfigService charityNonprofitFundraisingConfigService;
    @Autowired
    private AwsS3Manager awsS3Manager;

    @GetMapping("/overview")
    @Operation(summary = "Overview", description = "Overview")
    @Parameters({@Parameter(name = "site", in = ParameterIn.HEADER, description = "Site identifier", required = true, example = "ABCD")})
    public Result<PageInfo<DonationRecordResponse>> customerDonationOverview(@ParameterObject CustomerDonationOverviewRequest request) {
        CharityDonationRecordVo vo = MapstructUtils.convert(request, CharityDonationRecordVo.class);
        vo.setUserId(getCustomerGroupUserIdWithCheck());
        return Result.success(MapstructUtils.convertPage(donorManager.queryRecordPage(vo), DonationRecordResponse.class));
    }

    @GetMapping(value = "/pdf/url/{txHash}")
    @Operation(summary = "Download transaction receipt PDF", description = "Download donation receipt in PDF format via transaction hash")
    @Parameters({@Parameter(name = "site", in = ParameterIn.HEADER, description = "Site identifier (used to distinguish data sources from different deployment environments)", required = true, example = "ccccccc")})
    public Result<String> downloadReceiptUrl(@Parameter(name = "txHash", description = "Transaction hash", required = true, example = "3sGELWht5LnHEznDExNSqhXrAYHxPjftPfrVj415wAaRw6PM7dpPnhqfsyrF3T4doocBLqWjFptnBREoX2r7ugAh")
                                             @PathVariable("txHash")
                                             @NotNull(message = "hash cannot be empty")
                                             String txHash
    ) throws Exception {
        List<CharityDonationRecordVo> voList = donorManager.queryByChainAndHash(ChainEnum.SOLANA, txHash);
        if (!CollectionUtils.isEmpty(voList)) {
            CharityNonprofitFundraisingConfigVo configVo = charityNonprofitFundraisingConfigService.queryBySiteWithCache(getCustomerSite());
            CharityDonationRecordVo recordVo = voList.stream().filter(e -> e.getUserId() == configVo.getUserId().intValue()).findFirst().orElse(null);
            if (recordVo != null) {
                if (StringUtils.hasText(recordVo.getPdfUrl())) {
                    return Result.success(recordVo.getPdfUrl());
                }
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                PdfGeneratorUtil.generateDonationReceipt(outputStream, recordVo,
                        configVo.getStyleValue().getOrganizationName(), configVo.getStyleValue().getOrganizationLogo());
                AwsS3PreSignedUrlRequest build = AwsS3PreSignedUrlRequest.builder().contentType(MediaType.APPLICATION_PDF_VALUE).fileName(UUID.randomUUID().toString().replace("-", "") + ".pdf").build();
                AwsS3PreSignedUrlResponse response = awsS3Manager.uploadFile(build, outputStream.toByteArray());
                CharityDonationRecordVo update = new CharityDonationRecordVo();
                update.setId(recordVo.getId());
                update.setPdfUrl(response.getFileUrl());
                Boolean b = donorManager.updateByIdWithClearCache(update);
                log.info("PDF upload URL written back to DB completed: hash={},url={}", txHash, response.getFileUrl());
                return Result.success(response.getFileUrl());
            }
        }
        throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "transaction not fund");
    }

    @GetMapping(value = "/pdf/{txHash}", produces = "application/pdf")
    @Operation(summary = "Download transaction receipt PDF", description = "Download donation receipt in PDF format via transaction hash")
    @Parameters({@Parameter(name = "site", in = ParameterIn.HEADER, description = "Site identifier (used to distinguish data sources from different deployment environments)", required = true, example = "ccccccc")})
    public void downloadReceipt(HttpServletResponse response,
                                @Parameter(name = "txHash", description = "Transaction hash", required = true, example = "3sGELWht5LnHEznDExNSqhXrAYHxPjftPfrVj415wAaRw6PM7dpPnhqfsyrF3T4doocBLqWjFptnBREoX2r7ugAh")
                                @PathVariable("txHash")
                                @NotNull(message = "hash cannot be empty")
                                String txHash
    ) throws Exception {
        List<CharityDonationRecordVo> voList = donorManager.queryByChainAndHash(ChainEnum.SOLANA, txHash);
        if (!CollectionUtils.isEmpty(voList)) {
            CharityNonprofitFundraisingConfigVo configVo = charityNonprofitFundraisingConfigService.queryBySiteWithCache(getCustomerSite());
            CharityDonationRecordVo recordVo = voList.stream().filter(e -> e.getUserId() == configVo.getUserId().intValue()).findFirst().orElse(null);
            if (recordVo != null) {
                ServletOutputStream outputStream = response.getOutputStream();
                try {
                    // Set response type and download filename
                    response.setContentType("application/pdf");
                    response.setHeader("Content-Disposition", "attachment; filename=" + recordVo.getTxHash().substring(0, 10) + ".pdf");
                    // Call utility class to generate PDF to output stream
                    PdfGeneratorUtil.generateDonationReceipt(outputStream, recordVo,
                            configVo.getStyleValue().getOrganizationName(), configVo.getStyleValue().getOrganizationLogo());
                    outputStream.flush();
                    return;
                } catch (Exception e) {
                    log.error("PDF generation failed: hash={}", txHash, e);
                    response.setStatus(500);
                    outputStream.print("{\"code\":500,\"message\":\"SERVER ERROR\",\"success\":false}");
                    return;
                }
            }
        }
        response.setStatus(404);
        response.getWriter().print("{\"code\":404,\"message\":\"TRANSACTION NOT FUND\",\"success\":false}");
    }
}
