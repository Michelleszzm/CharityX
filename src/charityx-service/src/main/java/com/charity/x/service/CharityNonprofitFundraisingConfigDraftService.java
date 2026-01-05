package com.charity.x.service;

import com.charity.x.dto.vo.CharityNonprofitFundraisingConfigDraftVo;

/**
 * @Author: Lucass @Date: 2025/11/7 13:13 @Description:
 */
public interface CharityNonprofitFundraisingConfigDraftService {

    int save(CharityNonprofitFundraisingConfigDraftVo charityNonprofitFundraisingConfigDraftVo);

    int update(CharityNonprofitFundraisingConfigDraftVo charityNonprofitFundraisingConfigDraftVo);

    CharityNonprofitFundraisingConfigDraftVo queryByUserId(Integer userId);

    int saveOrUpdate(CharityNonprofitFundraisingConfigDraftVo charityNonprofitFundraisingConfigDraftVo);

    Boolean publish(CharityNonprofitFundraisingConfigDraftVo charityNonprofitFundraisingConfigDraftVo);

    CharityNonprofitFundraisingConfigDraftVo queryBySite(String site);
}
