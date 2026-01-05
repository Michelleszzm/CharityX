package com.charity.x.service;

import com.charity.x.dto.vo.CharityNonprofitCheckRecordVo;

import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/11 19:19 @Description:
 */
public interface CharityNonprofitCheckRecordService {

    Boolean save(CharityNonprofitCheckRecordVo charityNonprofitCheckRecordVo);

    List<CharityNonprofitCheckRecordVo> queryByUserId(Integer userId);
}
