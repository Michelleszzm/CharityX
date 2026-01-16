package com.charity.x.service;

import com.charity.x.common.menu.NonprofitMergeStatusEnum;
import com.charity.x.dao.CharityNonprofitDao;
import com.charity.x.dto.vo.CharityNonprofitMergeVo;
import com.charity.x.dto.vo.CharityNonprofitVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/6 21:04 @Description:
 */
@Slf4j
@Service
public class CharityNonprofitServiceImpl implements CharityNonprofitService{
    @Autowired
    private CharityNonprofitDao dao;

    @Override
    public Boolean save(CharityNonprofitVo charityNonprofitVo) {
        return dao.save(charityNonprofitVo) > 0;
    }

    @Override
    public Boolean updateById(CharityNonprofitVo charityNonprofitVo) {
        return dao.updateById(charityNonprofitVo) > 0;
    }

    @Override
    public CharityNonprofitVo getByUserId(Integer userId) {
        return dao.getByUserId(userId);
    }

    @Override
    public CharityNonprofitMergeVo getMergeVoByUserId(Integer userId) {
        CharityNonprofitVo vo = getByUserId(userId);
        return mergeOnlyForUserInfo(vo);
    }

    @Override
    public List<CharityNonprofitVo> queryListWithUser(CharityNonprofitVo request) {
        return dao.queryListWithUser(request);
    }

    @Override
    public Boolean deleteSnapshotByUserId(Integer userId) {
        return dao.deleteSnapshotByUserId(userId) > 0;
    }

    private CharityNonprofitMergeVo mergeOnlyForUserInfo(CharityNonprofitVo vo){
        if (vo == null || (vo.getStatus() == 0 && vo.getSnapshotCheckStatus() == 0)){
            return null;
        }
        return CharityNonprofitMergeVo
                .builder()
                .nonprofitName(StringUtils.hasText(vo.getNonprofitName()) ? vo.getNonprofitName() : vo.getSnapshotNonprofitName())
                .proofImage(StringUtils.hasText(vo.getProofImage()) ? vo.getProofImage() : vo.getSnapshotProofImage())
                .status(vo.getStatus() != 0 ? vo.getStatus() : vo.getSnapshotCheckStatus())
                .isActive(vo.getStatus() == NonprofitMergeStatusEnum.MERGE_STATUS_ACTIVE.getStatus())
                .build();
    }
}
