package com.charity.x.dao;

import com.charity.x.dto.vo.CharityDonorNoteVo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CharityDonorNoteDao {

    int save(CharityDonorNoteVo charityDonorNoteVo);

    List<CharityDonorNoteVo> queryByWallet(String wallet);
}
