package com.charity.x.dao;

import com.charity.x.dto.vo.CharityFundraisingTemplateVo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CharityFundraisingTemplateDao {

    List<CharityFundraisingTemplateVo> queryList();
}
