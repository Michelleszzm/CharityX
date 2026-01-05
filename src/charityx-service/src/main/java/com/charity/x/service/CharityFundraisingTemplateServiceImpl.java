package com.charity.x.service;

import com.charity.x.dao.CharityFundraisingTemplateDao;
import com.charity.x.dto.vo.CharityFundraisingTemplateVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/6 20:56 @Description:
 */
@Slf4j
@Service
public class CharityFundraisingTemplateServiceImpl implements CharityFundraisingTemplateService{
    @Autowired
    private CharityFundraisingTemplateDao dao;

    @Override
    public List<CharityFundraisingTemplateVo> queryAll() {
        return dao.queryList();
    }
}
