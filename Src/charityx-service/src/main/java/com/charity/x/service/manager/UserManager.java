package com.charity.x.service.manager;

import com.charity.x.common.menu.NonprofitMergeStatusEnum;
import com.charity.x.dto.request.StartYourFundraisingRequest;
import com.charity.x.dto.response.UserInfoResponse;
import com.charity.x.dto.vo.CharityNonprofitVo;
import com.charity.x.dto.vo.SysUserVo;
import com.charity.x.service.CharityNonprofitService;
import com.charity.x.service.SysUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

/**
 * @Author: Lucass @Date: 2025/11/10 08:26 @Description:
 */
@Slf4j
@Service
public class UserManager {
    @Autowired
    private SysUserService sysUserService;
    @Autowired
    private CharityNonprofitService charityNonprofitService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserInfoResponse userInfo(Integer userId){
        return UserInfoResponse.builder()
                .sysUserVo(sysUserService.getUserWithRolesById(userId))
                .charityNonprofitMergeVo(charityNonprofitService.getMergeVoByUserId(userId))
                .build();
    }

    @Transactional(rollbackFor = Exception.class,timeout = 2)
    public Boolean completeUserWithNonprofit(StartYourFundraisingRequest request){
        SysUserVo sysUserVo = new SysUserVo();
        BeanUtils.copyProperties(request, sysUserVo);
        sysUserVo.setId(request.getUserId());
        if (StringUtils.hasText(request.getPassword())){
            sysUserVo.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        sysUserService.updateById(sysUserVo);
        if (StringUtils.hasText(request.getProofImage())){
            CharityNonprofitVo nonprofitVo = new CharityNonprofitVo();
            nonprofitVo.setUserId(request.getUserId());
            nonprofitVo.setSnapshotNonprofitName(request.getNonprofitName());
            nonprofitVo.setSnapshotProofImage(request.getProofImage());
            nonprofitVo.setSnapshotCheckStatus(NonprofitMergeStatusEnum.MERGE_STATUS_PENDING.getStatus());
            nonprofitVo.setSnapshotApplicationDate(LocalDateTime.now());
            CharityNonprofitVo existVo = charityNonprofitService.getByUserId(request.getUserId());
            if (existVo != null){
                if (!existVo.getSnapshotNonprofitName().equals(nonprofitVo.getSnapshotNonprofitName()) || !existVo.getSnapshotProofImage().equals(nonprofitVo.getSnapshotProofImage())){
                    nonprofitVo.setId(existVo.getId());
                    return charityNonprofitService.updateById(nonprofitVo);
                }
            }else {
                return charityNonprofitService.save(nonprofitVo);
            }
        }
        return true;
    }

}
