package com.charity.x.dao;

import com.charity.x.dto.vo.CharityNonprofitVo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CharityNonprofitDao {

    int save(CharityNonprofitVo charityNonprofitVo);

    int updateById(CharityNonprofitVo charityNonprofitVo);

    CharityNonprofitVo getByUserId(Integer userId);

    List<CharityNonprofitVo> queryListWithUser(CharityNonprofitVo request);

    int deleteSnapshotByUserId(Integer userId);
}
