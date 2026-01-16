package com.charity.x.dao;

import com.charity.x.dto.vo.CharityNonprofitCheckRecordVo;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CharityNonprofitCheckRecordDao {

    int save(CharityNonprofitCheckRecordVo charityNonprofitCheckRecordVo);

    List<CharityNonprofitCheckRecordVo> queryByUserId(Integer userId);
}
