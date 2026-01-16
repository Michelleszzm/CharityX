package com.charity.x.dao;

import com.charity.x.dto.vo.CharityNonprofitFundraisingConfigVo;
import org.apache.ibatis.annotations.Mapper;

/**
 * @Author: Lucass @Date: 2025/11/6 21:06 @Description:
 */
@Mapper
public interface CharityNonprofitFundraisingConfigDao {

    int save(CharityNonprofitFundraisingConfigVo vo);

    int updateById(CharityNonprofitFundraisingConfigVo vo);

    CharityNonprofitFundraisingConfigVo queryByUserId(Integer userId);

    CharityNonprofitFundraisingConfigVo queryBySite(String site);
}
