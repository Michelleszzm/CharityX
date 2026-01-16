package com.charity.x.controller.user;

import com.charity.x.common.utils.MapstructUtils;
import com.charity.x.controller.BaseController;
import com.charity.x.dto.Result;
import com.charity.x.dto.request.ReportTrendRequest;
import com.charity.x.dto.vo.*;
import com.charity.x.service.manager.ReportManager;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * @Author: Lucass @Date: 2025/11/7 16:44 @Description:
 */
@Slf4j
@RestController
@RequestMapping("/user/reports")
@Tag(name = "Fundraising Reports", description = "Fundraising Reports Endpoints")
public class ReportsController extends BaseController {

    @Autowired
    private ReportManager reportManager;

    @GetMapping("/summary")
    @Operation(summary = "Fundraising Reports - Summary Information Query",description = "Fundraising Reports - Summary Information Query")
    public Result<CharityReportSummaryVo> queryReportSummary() {
        return Result.success(reportManager.querySummary(getUserIdWithCheckLogin()));
    }


    @GetMapping("/trend")
    @Operation(summary = "Fundraising Reports - Donation Trend Query",description = "Fundraising Reports - Donation Trend Query")
    public Result<CharityReportTrendVo> queryTrend(@Validated @ParameterObject ReportTrendRequest request) {
        CharityDonationRecordVo vo = MapstructUtils.convert(request, CharityDonationRecordVo.class);
        vo.setUserId(getUserIdWithCheckLogin());
        return Result.success(reportManager.queryTrend(vo));
    }

    @GetMapping("/distribution")
    @Operation(summary = "Fundraising Reports - Data Distribution Query",description = "Fundraising Reports - Data Distribution Query")
    public Result<CharityReportDistributionVo> queryDistribution() {
        return Result.success(reportManager.queryDistribution(getUserIdWithCheckLogin()));
    }

    @GetMapping("/amount/distribution")
    @Operation(summary = "[Donation Amount Distribution] Fundraising Reports - Data Distribution Query",description = "[Donation Amount Distribution] Fundraising Reports - Data Distribution Query")
    public Result<CharityReportDistributionVo> queryDonationAmountDistribution() {
        return Result.success(reportManager.queryDistributionSpecial(getUserIdWithCheckLogin()));
    }
}
