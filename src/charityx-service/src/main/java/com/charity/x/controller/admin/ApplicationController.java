package com.charity.x.controller.admin;

import com.charity.x.common.menu.NonprofitMergeStatusEnum;
import com.charity.x.controller.BaseController;
import com.charity.x.dto.Result;
import com.charity.x.dto.ResultCode;
import com.charity.x.dto.request.ApplicationCompleteUserRequest;
import com.charity.x.dto.request.ApplicationManagerRequest;
import com.charity.x.dto.request.ApplicationPageRequest;
import com.charity.x.dto.response.ApplicationDetailResponse;
import com.charity.x.dto.response.ApplicationPageResponse;
import com.charity.x.dto.response.UserProfileResponse;
import com.charity.x.dto.vo.CharityNonprofitVo;
import com.charity.x.exception.BusinessException;
import com.charity.x.service.manager.ApplicationManager;
import com.github.pagehelper.PageInfo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import static com.charity.x.common.menu.NonprofitMergeStatusEnum.MERGE_STATUS_PENDING;
import static com.charity.x.common.menu.NonprofitMergeStatusEnum.MERGE_STATUS_REJECTED;

/**
 * @Author: Lucass @Date: 2025/11/11 09:06 @Description:
 */
@Slf4j
@RestController
@RequestMapping("/admin/application")
@Tag(name = "Admin Review", description = "Admin review related endpoints")
public class ApplicationController extends BaseController {
    @Autowired
    private ApplicationManager applicationManager;

    @GetMapping("/pending")
    @Operation(summary = "pending query",description = "pending query" )
    public Result<PageInfo<ApplicationPageResponse>> pendingPage(@Validated ApplicationPageRequest request){
        CharityNonprofitVo vo = new CharityNonprofitVo();
        vo.setPageNum(request.getPageNum());
        vo.setPageSize(request.getPageSize());
        vo.setEmail(request.getEmail());
        vo.setSnapshotNonprofitName(request.getNonprofitName());
        vo.setSnapshotCheckStatus(MERGE_STATUS_PENDING.getStatus());
        PageInfo<ApplicationPageResponse> pageInfo = applicationManager.applicationDatePage(vo);
        if (!CollectionUtils.isEmpty(pageInfo.getList())){
            pageInfo.getList().forEach(item -> {
                // Order cannot be adjusted
                item.setType(StringUtils.hasText(item.getNonprofitName()) ? 2 : 1);
                item.setNonprofitName(item.getSnapshotNonprofitName());
                item.setProofImage(item.getSnapshotProofImage());
                item.setMergeDate(item.getSnapshotApplicationDate());
                item.setStatus(item.getSnapshotCheckStatus());
            });
        }
        return Result.success(pageInfo);
    }

    @GetMapping("/reject/manager")
    @Operation(summary = "reject manager",description = "reject manager" )
    public Result<ApplicationDetailResponse> rejectManger(@Validated  ApplicationManagerRequest request){
        request.setSourceStatus(MERGE_STATUS_REJECTED.getStatus());
        return Result.success(applicationManager.manager(request));
    }

    @GetMapping("/approved/manager")
    @Operation(summary = "approved manager",description = "approved manager" )
    public Result<ApplicationDetailResponse> approvedManger(@Validated  ApplicationManagerRequest request){
        request.setSourceStatus(NonprofitMergeStatusEnum.MERGE_STATUS_ACTIVE.getStatus());
        return Result.success(applicationManager.manager(request));
    }

    @PostMapping("/delete")
    @Operation(summary = "delete",description = "delete" )
    public Result<Boolean> delete(@RequestBody @Validated ApplicationManagerRequest request){
        request.setAdminUserId(getUserIdWithCheckLogin());
        return Result.success(applicationManager.delete(request));
    }

    @GetMapping("/action")
    @Operation(summary = "active manager",description = "active manager" )
    public Result<ApplicationDetailResponse> action(@Validated  ApplicationManagerRequest request){
        if (request.getSourceStatus() == null || request.getTargetStatus() == null){
            throw new BusinessException(ResultCode.PARAM_ERROR.getCode(),"Operation sourceStatus or targeStatus can not be empty");
        }
        return Result.success(applicationManager.action(request));
    }

    @GetMapping("/approved")
    @Operation(summary = "approved query",description = "approved query" )
    public Result<PageInfo<ApplicationPageResponse>> approvedPage(@Validated ApplicationPageRequest request){
        CharityNonprofitVo vo = new CharityNonprofitVo();
        vo.setPageNum(request.getPageNum());
        vo.setPageSize(request.getPageSize());
        vo.setEmail(request.getEmail());
        vo.setNonprofitName(request.getNonprofitName());
        vo.setNotStatus(NonprofitMergeStatusEnum.NONE.getStatus());
        PageInfo<ApplicationPageResponse> pageInfo = applicationManager.applicationDatePage(vo);
        if (!CollectionUtils.isEmpty(pageInfo.getList())){
            pageInfo.getList().forEach(item -> item.setMergeDate(item.getApplicationDate()));
        }
        return Result.success(pageInfo);
    }

    @GetMapping("/rejected")
    @Operation(summary = "rejected query",description = "rejected query" )
    public Result<PageInfo<ApplicationPageResponse>> rejectedPage(@Validated ApplicationPageRequest request){
        CharityNonprofitVo vo = new CharityNonprofitVo();
        vo.setPageNum(request.getPageNum());
        vo.setPageSize(request.getPageSize());
        vo.setEmail(request.getEmail());
        vo.setSnapshotNonprofitName(request.getNonprofitName());
        vo.setSnapshotCheckStatus(NonprofitMergeStatusEnum.MERGE_STATUS_REJECTED.getStatus());
        PageInfo<ApplicationPageResponse> pageInfo = applicationManager.applicationDatePage(vo);
        if (!CollectionUtils.isEmpty(pageInfo.getList())){
            pageInfo.getList().forEach(item -> {
                item.setNonprofitName(item.getSnapshotNonprofitName());
                item.setProofImage(item.getSnapshotProofImage());
                item.setMergeDate(item.getSnapshotApplicationDate());
                item.setStatus(item.getSnapshotCheckStatus());
            });
        }
        return Result.success(pageInfo);
    }

    @GetMapping("/registered")
    @Operation(summary = "registration query",description = "registration query" )
    public Result<PageInfo<ApplicationPageResponse>> registeredPage(@Validated ApplicationPageRequest request){
        return Result.success(applicationManager.pageOnlyRegister(request));
    }

    @PostMapping("/complete/user")
    @Operation(summary = "complete user information",description = "complete user information" )
    public Result<UserProfileResponse> completeUser(@RequestBody @Validated ApplicationCompleteUserRequest request){
        return Result.success(applicationManager.completeUser(request));
    }

}
