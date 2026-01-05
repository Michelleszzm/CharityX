package com.charity.x.controller.user;

import com.charity.x.common.utils.MapstructUtils;
import com.charity.x.controller.BaseController;
import com.charity.x.dto.Result;
import com.charity.x.dto.request.CharityNonprofitFundraisingConfigSubmitRequest;
import com.charity.x.dto.request.NonprofitFundraisingConfigPublishRequest;
import com.charity.x.dto.vo.CharityFundraisingTemplateVo;
import com.charity.x.dto.vo.CharityNonprofitFundraisingConfigVo;
import com.charity.x.service.manager.FundraisingManager;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/6 20:58 @Description:
 */
@Slf4j
@RestController
@RequestMapping("/user/fundraising")
@Tag(name = "3.Fundraising", description = "Fundraising Endpoints")
public class FundraisingController extends BaseController {

    @Autowired
    private FundraisingManager fundraisingManager;

    @GetMapping("/template")
    @Operation(summary = "Template",description = "Template")
    public Result<List<CharityFundraisingTemplateVo>> getTemplate() {
        return Result.success(fundraisingManager.queryAllTemplate());
    }

    @GetMapping("")
    @Operation(summary = "Query fundraising configuration",description = "Query fundraising configuration")
    public Result<CharityNonprofitFundraisingConfigVo> queryConfig() {
        return Result.success(fundraisingManager.queryConfigByUserId(getUserIdWithCheckLogin()));
    }

    @PostMapping("")
    @Operation(summary = "Save fundraising configuration",description = "Save fundraising configuration")
    public Result<Boolean> saveConfig(@Validated @RequestBody CharityNonprofitFundraisingConfigVo vo) {
        vo.setUserId(getUserIdWithCheckLogin());
        // Force unpublish
        vo.setPublishStatus(0);
        return Result.success(fundraisingManager.saveConfig(vo));
    }

    @PostMapping("/site/submit")
    @Operation(summary = "site validation",description = "site validation")
    public Result<Boolean> siteSubmit(@Validated @RequestBody CharityNonprofitFundraisingConfigSubmitRequest request) {
        CharityNonprofitFundraisingConfigVo vo = new CharityNonprofitFundraisingConfigVo();
        vo.setUserId(getUserIdWithCheckLogin());
        vo.setSite(request.getSite());
        return Result.success(fundraisingManager.siteSubmit(vo));
    }

    @PostMapping("/publish")
    @Operation(summary = "Publish",description = "Publish")
    public Result<Boolean> publish(@Validated @RequestBody NonprofitFundraisingConfigPublishRequest request) {
        CharityNonprofitFundraisingConfigVo vo = MapstructUtils.convert(request, CharityNonprofitFundraisingConfigVo.class);
        vo.setUserId(getUserIdWithCheckLogin());
        return Result.success(fundraisingManager.publish(vo));
    }
}
