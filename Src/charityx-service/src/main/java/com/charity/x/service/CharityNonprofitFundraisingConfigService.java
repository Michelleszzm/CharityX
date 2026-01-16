package com.charity.x.service;

import com.charity.x.dto.vo.CharityNonprofitFundraisingConfigVo;

/**
 * @Author: Lucass @Date: 2025/11/7 13:13 @Description:
 */
public interface CharityNonprofitFundraisingConfigService {

    int save(CharityNonprofitFundraisingConfigVo charityNonprofitFundraisingConfigVo);

    int update(CharityNonprofitFundraisingConfigVo charityNonprofitFundraisingConfigVo);

    CharityNonprofitFundraisingConfigVo queryByUserId(Integer userId);

    int saveOrUpdate(CharityNonprofitFundraisingConfigVo charityNonprofitFundraisingConfigVo);

    Boolean publish(CharityNonprofitFundraisingConfigVo charityNonprofitFundraisingConfigVo);

    CharityNonprofitFundraisingConfigVo queryBySite(String site);

    CharityNonprofitFundraisingConfigVo queryBySiteWithCache(String site);
}
