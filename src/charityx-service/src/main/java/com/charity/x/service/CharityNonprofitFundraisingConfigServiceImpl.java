package com.charity.x.service;

import com.charity.x.common.utils.RedisCacheUtil;
import com.charity.x.dao.CharityNonprofitFundraisingConfigDao;
import com.charity.x.dto.ResultCode;
import com.charity.x.dto.vo.*;
import com.charity.x.exception.BusinessException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.concurrent.TimeUnit;

/**
 * @Author: Lucass @Date: 2025/11/7 13:13 @Description:
 */
@Slf4j
@Service
public class CharityNonprofitFundraisingConfigServiceImpl implements CharityNonprofitFundraisingConfigService {
    private static final String CACHE_KEY = "CharityNonprofitFundraisingConfig:sit:%s";
    @Autowired
    private CharityNonprofitFundraisingConfigDao dao;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private RedisCacheUtil redisCacheUtil;

    @Override
    public int save(CharityNonprofitFundraisingConfigVo charityNonprofitFundraisingConfigVo) {
        serializationConfigVo(charityNonprofitFundraisingConfigVo);
        return dao.save(charityNonprofitFundraisingConfigVo);
    }

    @Override
    public int update(CharityNonprofitFundraisingConfigVo charityNonprofitFundraisingConfigVo) {
        serializationConfigVo(charityNonprofitFundraisingConfigVo);
        return dao.updateById(charityNonprofitFundraisingConfigVo);
    }

    @Override
    public CharityNonprofitFundraisingConfigVo queryByUserId(Integer userId) {
        CharityNonprofitFundraisingConfigVo vo = dao.queryByUserId(userId);
        deserializationConfigVo(vo);
        return vo;
    }

    @Override
    public int saveOrUpdate(CharityNonprofitFundraisingConfigVo charityNonprofitFundraisingConfigVo) {
        CharityNonprofitFundraisingConfigVo configVo = queryByUserId(charityNonprofitFundraisingConfigVo.getUserId());
        int row;
        if (configVo == null) {
            row = save(charityNonprofitFundraisingConfigVo);
        } else {
            redisCacheUtil.delete(String.format(CACHE_KEY, configVo.getSite()));
            charityNonprofitFundraisingConfigVo.setId(configVo.getId());
            row = update(charityNonprofitFundraisingConfigVo);
        }
        return row;
    }

    @Override
    public Boolean publish(CharityNonprofitFundraisingConfigVo charityNonprofitFundraisingConfigVo) {
        CharityNonprofitFundraisingConfigVo vo = dao.queryByUserId(charityNonprofitFundraisingConfigVo.getUserId());
        if (vo == null) {
            throw new BusinessException(ResultCode.PARAM_ERROR.getCode(), "publish error: please complete your config");
        }
        deserializationConfigVo(vo);
        if (!StringUtils.hasText(vo.getFundraisingTemplateCode())) {
            throw new BusinessException(ResultCode.PARAM_ERROR.getCode(), "publish error: please complete your template");
        }
        // Validate site
        if (StringUtils.hasText(vo.getSite())) {
            CharityNonprofitFundraisingConfigVo configVo = queryBySite(vo.getSite());
            if (configVo != null && !configVo.getUserId().equals(vo.getUserId())) {
                throw new BusinessException(ResultCode.PARAM_ERROR.getCode(), "publish error: site already exists");
            }
        }

        CharityNonprofitFundraisingConfigStyle styleValue = vo.getStyleValue();
        if (styleValue == null || !StringUtils.hasText(styleValue.getOrganizationName())
                || !StringUtils.hasText(styleValue.getMainTitle()) || !StringUtils.hasText(styleValue.getSubtitle()) || !StringUtils.hasText(styleValue.getChooseColor())) {
            throw new BusinessException(ResultCode.PARAM_ERROR.getCode(), "publish error: please complete your style");
        }
        CharityNonprofitFundraisingConfigPayment paymentValue = vo.getPaymentValue();
        if (paymentValue == null || paymentValue.getChainList() == null || paymentValue.getChainList().isEmpty()
                || paymentValue.getTokenList() == null || paymentValue.getTokenList().isEmpty()
                || paymentValue.getChainWalletList() == null || paymentValue.getChainWalletList().isEmpty()) {
            throw new BusinessException(ResultCode.PARAM_ERROR.getCode(), "publish error: please complete your payment");
        }
        CharityNonprofitFundraisingConfigForm formValue = vo.getFormValue();
        if (formValue == null || formValue.getAmountList() == null || formValue.getAmountList().isEmpty()
                || !StringUtils.hasText(formValue.getDefaultAmount())) {
            throw new BusinessException(ResultCode.PARAM_ERROR.getCode(), "publish error: please complete your form");
        }
        CharityNonprofitFundraisingConfigAllocation allocationValue = vo.getAllocationValue();
        if (allocationValue == null || allocationValue.getPurposeList() == null || allocationValue.getPurposeList().isEmpty()
                || allocationValue.getPurposeList().stream().map(CharityNonprofitFundraisingConfigAllocation.Purpose::getPercent).toList().stream().reduce(BigDecimal::add).get().compareTo(BigDecimal.valueOf(100)) != 0) {
            throw new BusinessException(ResultCode.PARAM_ERROR.getCode(), "publish error: please complete your allocation and ");
        }
        CharityNonprofitFundraisingConfigPublish publishValue = vo.getPublishValue();
        if (publishValue == null || !StringUtils.hasText(publishValue.getSite()) || !StringUtils.hasText(vo.getSite())) {
            throw new BusinessException(ResultCode.PARAM_ERROR.getCode(), "publish error: please complete your publish");
        }
        charityNonprofitFundraisingConfigVo.setId(vo.getId());
        redisCacheUtil.delete(String.format(CACHE_KEY, vo.getSite()));
        return dao.updateById(charityNonprofitFundraisingConfigVo) > 0;
    }

    @Override
    public CharityNonprofitFundraisingConfigVo queryBySite(String site) {
        CharityNonprofitFundraisingConfigVo configVo = dao.queryBySite(site);
        deserializationConfigVo(configVo);
        return configVo;
    }

    @Override
    public CharityNonprofitFundraisingConfigVo queryBySiteWithCache(String site) {
        String key = String.format(CACHE_KEY, site);
        CharityNonprofitFundraisingConfigVo cacheVo = redisCacheUtil.get(key, CharityNonprofitFundraisingConfigVo.class);
        if (cacheVo == null) {
            cacheVo = queryBySite(site);
            if (cacheVo != null) {
                redisCacheUtil.set(key, cacheVo, 60 * 60 * 24L, TimeUnit.SECONDS);
            }
        }
        return cacheVo;
    }

    private void serializationConfigVo(CharityNonprofitFundraisingConfigVo charityNonprofitFundraisingConfigVo) {
        if (charityNonprofitFundraisingConfigVo != null) {
            try {
                if (charityNonprofitFundraisingConfigVo.getStyleValue() != null) {
                    charityNonprofitFundraisingConfigVo.setStyle(objectMapper.writeValueAsString(charityNonprofitFundraisingConfigVo.getStyleValue()));
                }
                if (charityNonprofitFundraisingConfigVo.getPaymentValue() != null) {
                    charityNonprofitFundraisingConfigVo.setPayment(objectMapper.writeValueAsString(charityNonprofitFundraisingConfigVo.getPaymentValue()));
                }
                if (charityNonprofitFundraisingConfigVo.getFormValue() != null) {
                    charityNonprofitFundraisingConfigVo.setForm(objectMapper.writeValueAsString(charityNonprofitFundraisingConfigVo.getFormValue()));
                }
                if (charityNonprofitFundraisingConfigVo.getAllocationValue() != null) {
                    charityNonprofitFundraisingConfigVo.setAllocation(objectMapper.writeValueAsString(charityNonprofitFundraisingConfigVo.getAllocationValue()));
                }
                if (charityNonprofitFundraisingConfigVo.getPublishValue() != null) {
                    charityNonprofitFundraisingConfigVo.setPublish(objectMapper.writeValueAsString(charityNonprofitFundraisingConfigVo.getPublishValue()));
                    if (StringUtils.hasText(charityNonprofitFundraisingConfigVo.getPublishValue().getSite())) {
                        charityNonprofitFundraisingConfigVo.setSite(charityNonprofitFundraisingConfigVo.getPublishValue().getSite());
                    }
                    if (StringUtils.hasText(charityNonprofitFundraisingConfigVo.getPublishValue().getNftImage())) {
                        charityNonprofitFundraisingConfigVo.setNftImage(charityNonprofitFundraisingConfigVo.getPublishValue().getNftImage());
                    }
                }
            } catch (Exception e) {
                log.error("Donation configuration - serialization exception", e.getMessage());
                throw new RuntimeException(e);
            }
        }
    }

    private void deserializationConfigVo(CharityNonprofitFundraisingConfigVo vo) {
        if (vo != null) {
            try {
                if (StringUtils.hasText(vo.getStyle())) {
                    vo.setStyleValue(objectMapper.readValue(vo.getStyle(), CharityNonprofitFundraisingConfigStyle.class));
                }
                if (StringUtils.hasText(vo.getPayment())) {
                    vo.setPaymentValue(objectMapper.readValue(vo.getPayment(), CharityNonprofitFundraisingConfigPayment.class));
                }
                if (StringUtils.hasText(vo.getForm())) {
                    vo.setFormValue(objectMapper.readValue(vo.getForm(), CharityNonprofitFundraisingConfigForm.class));
                }
                if (StringUtils.hasText(vo.getAllocation())) {
                    vo.setAllocationValue(objectMapper.readValue(vo.getAllocation(), CharityNonprofitFundraisingConfigAllocation.class));
                }
                if (StringUtils.hasText(vo.getPublish())) {
                    vo.setPublishValue(objectMapper.readValue(vo.getPublish(), CharityNonprofitFundraisingConfigPublish.class));
                }
            } catch (Exception e) {
                log.error("Donation configuration - deserialization exception", e.getMessage());
                throw new RuntimeException(e);
            }
        }
    }
}
