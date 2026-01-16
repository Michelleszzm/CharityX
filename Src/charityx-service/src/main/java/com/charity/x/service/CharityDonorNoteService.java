package com.charity.x.service;

import com.charity.x.dto.vo.CharityDonorNoteVo;

import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/7 16:25 @Description:
 */
public interface CharityDonorNoteService {

    int save(CharityDonorNoteVo charityDonorNoteVo);

    List<CharityDonorNoteVo> queryByWallet(String wallet);
}
