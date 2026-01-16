package com.charity.x.service.manager;

import com.charity.x.common.menu.EmailSendSceneEnum;
import com.charity.x.common.menu.NonprofitMergeStatusEnum;
import com.charity.x.common.utils.MapstructUtils;
import com.charity.x.dto.ResultCode;
import com.charity.x.dto.request.ApplicationCompleteUserRequest;
import com.charity.x.dto.request.ApplicationManagerRequest;
import com.charity.x.dto.request.ApplicationPageRequest;
import com.charity.x.dto.response.ApplicationDetailResponse;
import com.charity.x.dto.response.ApplicationPageResponse;
import com.charity.x.dto.response.UserProfileResponse;
import com.charity.x.dto.vo.CharityNonprofitCheckRecordVo;
import com.charity.x.dto.vo.CharityNonprofitVo;
import com.charity.x.dto.vo.SysUserVo;
import com.charity.x.exception.BusinessException;
import com.charity.x.service.CharityNonprofitCheckRecordService;
import com.charity.x.service.CharityNonprofitService;
import com.charity.x.service.SysUserService;
import com.github.pagehelper.PageInfo;
import com.github.pagehelper.page.PageMethod;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


/**
 * @Author: Lucass @Date: 2025/11/11 09:07 @Description:
 */
@Slf4j
@Service
public class ApplicationManager {
    @Autowired
    private CharityNonprofitCheckRecordService charityNonprofitCheckRecordService;
    @Autowired
    private SysUserService sysUserService;
    @Autowired
    private CharityNonprofitService charityNonprofitService;
    @Autowired
    private EmailManager emailManager;

    @Transactional(rollbackFor = Exception.class, timeout = 2)
    public ApplicationDetailResponse action(ApplicationManagerRequest request) {
        CharityNonprofitVo exitVo = charityNonprofitService.getByUserId(request.getUserId());
        if (exitVo == null) {
            throw new BusinessException(ResultCode.BUSINESS_DATA_EXPIRED_ERROR);
        }
        // Save operation record
        CharityNonprofitCheckRecordVo updateRecordVo = CharityNonprofitCheckRecordVo.builder()
                .userId(request.getUserId())
                .charityNonprofitId(exitVo.getId())
                .sourceStatus(request.getSourceStatus())
                .targetStatus(request.getTargetStatus())
                .reason(request.getReason())
                .checkTime(LocalDateTime.now())
                .build();
        updateRecordVo.setCreateBy(request.getAdminUserId());
        updateRecordVo.setUpdateBy(request.getAdminUserId());
        // Update nonprofit
        CharityNonprofitVo updateNonprofitVo = new CharityNonprofitVo();
        updateNonprofitVo.setId(exitVo.getId());

        NonprofitMergeStatusEnum sourceStatusEnum = NonprofitMergeStatusEnum.getByStatus(request.getSourceStatus());
        NonprofitMergeStatusEnum targetStatusEnum = NonprofitMergeStatusEnum.getByStatus(request.getTargetStatus());
        switch (sourceStatusEnum) {
            case MERGE_STATUS_PENDING:
                if (targetStatusEnum.getStatus() != NonprofitMergeStatusEnum.MERGE_STATUS_ACTIVE.getStatus() && targetStatusEnum.getStatus() != NonprofitMergeStatusEnum.MERGE_STATUS_REJECTED.getStatus()) {
                    throw new BusinessException(ResultCode.BUSINESS_OPERATION_NOT_SUPPORT_ERROR);
                }
                updateRecordVo.setNonprofitName(exitVo.getSnapshotNonprofitName());
                updateRecordVo.setProofImage(exitVo.getSnapshotProofImage());
                if (targetStatusEnum.getStatus() == NonprofitMergeStatusEnum.MERGE_STATUS_ACTIVE.getStatus()) {
                    updateNonprofitVo.setApplicationDate(LocalDateTime.now());
                    updateNonprofitVo.setNonprofitName(exitVo.getSnapshotNonprofitName());
                    updateNonprofitVo.setProofImage(exitVo.getSnapshotProofImage());
                    updateNonprofitVo.setStatus(request.getTargetStatus());

                    updateNonprofitVo.setSnapshotNonprofitName("");
                    updateNonprofitVo.setSnapshotProofImage("");
                    updateNonprofitVo.setSnapshotCheckStatus(NonprofitMergeStatusEnum.NONE.getStatus());
                } else {
                    updateNonprofitVo.setSnapshotCheckStatus(request.getTargetStatus());
                    updateNonprofitVo.setSnapshotApplicationDate(LocalDateTime.now());
                }
                break;
            case MERGE_STATUS_ACTIVE:
            case MERGE_STATUS_REVOKED:
                if (targetStatusEnum.getStatus() != NonprofitMergeStatusEnum.MERGE_STATUS_ACTIVE.getStatus() && targetStatusEnum.getStatus() != NonprofitMergeStatusEnum.MERGE_STATUS_REVOKED.getStatus()) {
                    throw new BusinessException(ResultCode.BUSINESS_OPERATION_NOT_SUPPORT_ERROR);
                }
                updateRecordVo.setNonprofitName(exitVo.getNonprofitName());
                updateRecordVo.setProofImage(exitVo.getProofImage());

                updateNonprofitVo.setApplicationDate(LocalDateTime.now());
                updateNonprofitVo.setStatus(request.getTargetStatus());
                break;
            case MERGE_STATUS_REJECTED:
                if (targetStatusEnum.getStatus() != NonprofitMergeStatusEnum.MERGE_STATUS_ACTIVE.getStatus()) {
                    throw new BusinessException(ResultCode.BUSINESS_OPERATION_NOT_SUPPORT_ERROR);
                }
                updateRecordVo.setNonprofitName(exitVo.getSnapshotNonprofitName());
                updateRecordVo.setProofImage(exitVo.getSnapshotProofImage());

                updateNonprofitVo.setNonprofitName(exitVo.getSnapshotNonprofitName());
                updateNonprofitVo.setProofImage(exitVo.getSnapshotProofImage());
                updateNonprofitVo.setApplicationDate(LocalDateTime.now());
                updateNonprofitVo.setStatus(request.getTargetStatus());
                updateNonprofitVo.setSnapshotNonprofitName("");
                updateNonprofitVo.setSnapshotProofImage("");
                updateNonprofitVo.setSnapshotCheckStatus(NonprofitMergeStatusEnum.NONE.getStatus());
                break;
            default:
                throw new BusinessException(ResultCode.BUSINESS_OPERATION_NOT_SUPPORT_ERROR);
        }
        charityNonprofitService.updateById(updateNonprofitVo);
        charityNonprofitCheckRecordService.save(updateRecordVo);
        ApplicationDetailResponse manager = manager(request);
        asyncSendApplicationEmail(manager, targetStatusEnum);
        return manager;
    }

    private void asyncSendApplicationEmail(ApplicationDetailResponse manager, NonprofitMergeStatusEnum targetStatusEnum) {
        if (manager != null && manager.getSysUserVo() != null) {
            // Send email
            EmailSendSceneEnum emailSendSceneEnum = switch (targetStatusEnum) {
                case MERGE_STATUS_ACTIVE -> EmailSendSceneEnum.MERGE_STATUS_ACTIVE;
                case MERGE_STATUS_REVOKED -> EmailSendSceneEnum.MERGE_STATUS_REVOKED;
                case MERGE_STATUS_REJECTED -> EmailSendSceneEnum.MERGE_STATUS_REJECTED;
                default -> null;
            };
            if (emailSendSceneEnum != null) {
                emailManager.asyncSendSceneCodeEmail(emailSendSceneEnum, manager.getSysUserVo().getEmail(), "");
            }
        }
    }

    @Transactional(rollbackFor = Exception.class, timeout = 2)
    public Boolean delete(ApplicationManagerRequest request) {
        CharityNonprofitVo charityNonprofitVo = charityNonprofitService.getByUserId(request.getUserId());
        if (StringUtils.hasText(charityNonprofitVo.getSnapshotNonprofitName()) && StringUtils.hasText(charityNonprofitVo.getSnapshotProofImage())) {
            charityNonprofitService.deleteSnapshotByUserId(request.getUserId());
            CharityNonprofitCheckRecordVo recordVo = CharityNonprofitCheckRecordVo.builder()
                    .userId(request.getUserId())
                    .charityNonprofitId(charityNonprofitVo.getId())
                    .nonprofitName(charityNonprofitVo.getSnapshotNonprofitName())
                    .proofImage(charityNonprofitVo.getSnapshotProofImage())
                    .sourceStatus(charityNonprofitVo.getSnapshotCheckStatus())
                    .targetStatus(NonprofitMergeStatusEnum.MERGE_STATUS_DELETED.getStatus())
                    .reason("")
                    .checkTime(LocalDateTime.now())
                    .build();
            recordVo.setCreateBy(request.getAdminUserId());
            recordVo.setUpdateBy(request.getAdminUserId());
            charityNonprofitCheckRecordService.save(recordVo);
            return Boolean.TRUE;
        }
        throw new BusinessException(ResultCode.BUSINESS_DATA_EXPIRED_ERROR);
    }

    public ApplicationDetailResponse manager(ApplicationManagerRequest request) {
        CharityNonprofitVo charityNonprofitVo = charityNonprofitService.getByUserId(request.getUserId());
        if (charityNonprofitVo != null) {
            SysUserVo sysUserVo = sysUserService.getUserById(request.getUserId());
            List<CharityNonprofitCheckRecordVo> recordVoList = charityNonprofitCheckRecordService.queryByUserId(request.getUserId());
            return ApplicationDetailResponse.builder()
                    .nonprofitName(request.getSourceStatus() == NonprofitMergeStatusEnum.MERGE_STATUS_REJECTED.getStatus() ? charityNonprofitVo.getSnapshotNonprofitName() : charityNonprofitVo.getNonprofitName())
                    .proofImage(request.getSourceStatus() == NonprofitMergeStatusEnum.MERGE_STATUS_REJECTED.getStatus() ? charityNonprofitVo.getSnapshotProofImage() : charityNonprofitVo.getProofImage())
                    .status(request.getSourceStatus() == NonprofitMergeStatusEnum.MERGE_STATUS_REJECTED.getStatus() ? charityNonprofitVo.getSnapshotCheckStatus() : charityNonprofitVo.getStatus())
                    .sysUserVo(sysUserVo)
                    .checkRecordVoList(recordVoList)
                    .build();
        }
        return null;
    }


    public PageInfo<ApplicationPageResponse> applicationDatePage(CharityNonprofitVo vo) {
        PageMethod.startPage(vo.getPageNum(), vo.getPageSize());
        PageInfo<CharityNonprofitVo> pageInfoTemp = PageInfo.of(charityNonprofitService.queryListWithUser(vo));
        PageInfo<ApplicationPageResponse> pageInfo = new PageInfo<ApplicationPageResponse>();
        BeanUtils.copyProperties(pageInfoTemp, pageInfo);
        if (!CollectionUtils.isEmpty(pageInfoTemp.getList())) {
            List<ApplicationPageResponse> list = new ArrayList<>();
            pageInfoTemp.getList().forEach(item -> {
                ApplicationPageResponse response = new ApplicationPageResponse();
                BeanUtils.copyProperties(item, response);
                list.add(response);
            });
            pageInfo.setList(list);
        }
        return pageInfo;
    }


    public PageInfo<ApplicationPageResponse> pageOnlyRegister(ApplicationPageRequest request) {
        PageMethod.startPage(request.getPageNum(), request.getPageSize());
        PageInfo<SysUserVo> pageInfoTemp = PageInfo.of(sysUserService.queryOnlyRegister(request.getEmail()));
        PageInfo<ApplicationPageResponse> pageInfo = new PageInfo<>();
        BeanUtils.copyProperties(pageInfoTemp, pageInfo);
        if (!CollectionUtils.isEmpty(pageInfoTemp.getList())) {
            List<ApplicationPageResponse> list = new ArrayList<>();
            pageInfoTemp.getList().forEach(item -> {
                ApplicationPageResponse response = new ApplicationPageResponse();
                BeanUtils.copyProperties(item, response);
                response.setUserId(item.getId());
                list.add(response);
            });
            pageInfo.setList(list);
        }
        return pageInfo;
    }

    @Transactional(rollbackFor = Exception.class, timeout = 2)
    public UserProfileResponse completeUser(ApplicationCompleteUserRequest request) {
        SysUserVo existUserVo = sysUserService.getUserById(request.getUserId());
        if (existUserVo == null) {
            throw new BusinessException(ResultCode.BUSINESS_DATA_EXPIRED_ERROR);
        }
        SysUserVo sysUserVo = MapstructUtils.convert(request, SysUserVo.class);
        sysUserVo.setId(request.getUserId());
        sysUserService.updateById(sysUserVo);
        SysUserVo vo = sysUserService.getUserById(request.getUserId());
        return MapstructUtils.convert(vo, UserProfileResponse.class);
    }
}
