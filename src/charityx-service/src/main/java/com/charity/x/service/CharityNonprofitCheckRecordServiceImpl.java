package com.charity.x.service;

import com.charity.x.dao.CharityNonprofitCheckRecordDao;
import com.charity.x.dto.vo.CharityNonprofitCheckRecordVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/11 19:19 @Description:
 */
@Slf4j
@Service
public class CharityNonprofitCheckRecordServiceImpl implements CharityNonprofitCheckRecordService {
    @Autowired
    private CharityNonprofitCheckRecordDao dao;
    @Override
    public Boolean save(CharityNonprofitCheckRecordVo charityNonprofitCheckRecordVo) {
        return dao.save(charityNonprofitCheckRecordVo) > 0;
    }

    @Override
    public List<CharityNonprofitCheckRecordVo> queryByUserId(Integer userId) {
        return dao.queryByUserId(userId);
    }
}
