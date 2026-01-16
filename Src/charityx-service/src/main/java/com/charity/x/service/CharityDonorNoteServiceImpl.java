package com.charity.x.service;

import com.charity.x.dao.CharityDonorNoteDao;
import com.charity.x.dto.vo.CharityDonorNoteVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/7 16:26 @Description:
 */
@Slf4j
@Service
public class CharityDonorNoteServiceImpl implements CharityDonorNoteService{
    @Autowired
    private CharityDonorNoteDao dao;

    @Override
    public int save(CharityDonorNoteVo charityDonorNoteVo) {
        return dao.save(charityDonorNoteVo);
    }

    @Override
    public List<CharityDonorNoteVo> queryByWallet(String wallet) {
        return dao.queryByWallet(wallet);
    }
}
