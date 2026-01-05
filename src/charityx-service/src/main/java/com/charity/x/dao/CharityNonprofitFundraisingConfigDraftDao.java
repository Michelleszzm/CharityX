package com.charity.x.dao;

import com.charity.x.dto.vo.CharityNonprofitFundraisingConfigDraftVo;
import org.apache.ibatis.annotations.Mapper;

/**
 * @Author: Lucass @Date: 2025/11/6 21:06 @Description:
 */
@Mapper
public interface CharityNonprofitFundraisingConfigDraftDao {

    int save(CharityNonprofitFundraisingConfigDraftVo vo);

    int updateById(CharityNonprofitFundraisingConfigDraftVo vo);

    CharityNonprofitFundraisingConfigDraftVo queryByUserId(Integer userId);

    CharityNonprofitFundraisingConfigDraftVo queryBySite(String site);
}
