package com.charity.x.service;

import com.charity.x.dto.vo.CharityNonprofitMergeVo;
import com.charity.x.dto.vo.CharityNonprofitVo;

import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/6 21:03 @Description:
 */
public interface CharityNonprofitService {

    Boolean save(CharityNonprofitVo charityNonprofitVo);

    Boolean updateById(CharityNonprofitVo charityNonprofitVo);

    CharityNonprofitVo getByUserId(Integer userId);

    CharityNonprofitMergeVo getMergeVoByUserId(Integer userId);

    List<CharityNonprofitVo> queryListWithUser(CharityNonprofitVo request);

    Boolean deleteSnapshotByUserId(Integer userId);
}
