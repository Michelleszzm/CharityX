package com.charity.x.service;

import com.charity.x.dao.CharityNonprofitFundraisingConfigDraftDao;
import com.charity.x.dto.ResultCode;
import com.charity.x.dto.vo.*;
import com.charity.x.exception.BusinessException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;

/**
 * @Author: Lucass @Date: 2025/11/7 13:13 @Description:
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CharityNonprofitFundraisingConfigDraftServiceImpl implements CharityNonprofitFundraisingConfigDraftService {
    private final CharityNonprofitFundraisingConfigDraftDao dao;
    private final ObjectMapper objectMapper;

    @Override
    public int save(CharityNonprofitFundraisingConfigDraftVo charityNonprofitFundraisingConfigDraftVo) {
        serializationConfigVo(charityNonprofitFundraisingConfigDraftVo);
        return dao.save(charityNonprofitFundraisingConfigDraftVo);
    }

    @Override
    public int update(CharityNonprofitFundraisingConfigDraftVo charityNonprofitFundraisingConfigDraftVo) {
        serializationConfigVo(charityNonprofitFundraisingConfigDraftVo);
        return dao.updateById(charityNonprofitFundraisingConfigDraftVo);
    }

    @Override
    public CharityNonprofitFundraisingConfigDraftVo queryByUserId(Integer userId) {
        CharityNonprofitFundraisingConfigDraftVo vo = dao.queryByUserId(userId);
        deserializationConfigVo(vo);
        return vo;
    }

    @Override
    public int saveOrUpdate(CharityNonprofitFundraisingConfigDraftVo charityNonprofitFundraisingConfigDraftVo) {
        CharityNonprofitFundraisingConfigDraftVo configVo = queryByUserId(charityNonprofitFundraisingConfigDraftVo.getUserId());
        int row;
        if (configVo == null) {
            row = save(charityNonprofitFundraisingConfigDraftVo);
        } else {
            charityNonprofitFundraisingConfigDraftVo.setId(configVo.getId());
            row = update(charityNonprofitFundraisingConfigDraftVo);
        }
        return row;
    }

    @Override
    public Boolean publish(CharityNonprofitFundraisingConfigDraftVo charityNonprofitFundraisingConfigDraftVo) {
        CharityNonprofitFundraisingConfigDraftVo vo = dao.queryByUserId(charityNonprofitFundraisingConfigDraftVo.getUserId());
        if (vo == null) {
            throw new BusinessException(ResultCode.PARAM_ERROR.getCode(), "publish error: please complete your config");
        }
        deserializationConfigVo(vo);
        if (!StringUtils.hasText(vo.getFundraisingTemplateCode())) {
            throw new BusinessException(ResultCode.PARAM_ERROR.getCode(), "publish error: please complete your template");
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
        charityNonprofitFundraisingConfigDraftVo.setId(vo.getId());
        return dao.updateById(charityNonprofitFundraisingConfigDraftVo) > 0;
    }

    @Override
    public CharityNonprofitFundraisingConfigDraftVo queryBySite(String site) {
        CharityNonprofitFundraisingConfigDraftVo configVo = dao.queryBySite(site);
        deserializationConfigVo(configVo);
        return configVo;
    }

    private void serializationConfigVo(CharityNonprofitFundraisingConfigDraftVo charityNonprofitFundraisingConfigDraftVo) {
        if (charityNonprofitFundraisingConfigDraftVo != null) {
            try {
                if (charityNonprofitFundraisingConfigDraftVo.getStyleValue() != null) {
                    charityNonprofitFundraisingConfigDraftVo.setStyle(objectMapper.writeValueAsString(charityNonprofitFundraisingConfigDraftVo.getStyleValue()));
                }
                if (charityNonprofitFundraisingConfigDraftVo.getPaymentValue() != null) {
                    charityNonprofitFundraisingConfigDraftVo.setPayment(objectMapper.writeValueAsString(charityNonprofitFundraisingConfigDraftVo.getPaymentValue()));
                }
                if (charityNonprofitFundraisingConfigDraftVo.getFormValue() != null) {
                    charityNonprofitFundraisingConfigDraftVo.setForm(objectMapper.writeValueAsString(charityNonprofitFundraisingConfigDraftVo.getFormValue()));
                }
                if (charityNonprofitFundraisingConfigDraftVo.getAllocationValue() != null) {
                    charityNonprofitFundraisingConfigDraftVo.setAllocation(objectMapper.writeValueAsString(charityNonprofitFundraisingConfigDraftVo.getAllocationValue()));
                }
                if (charityNonprofitFundraisingConfigDraftVo.getPublishValue() != null) {
                    charityNonprofitFundraisingConfigDraftVo.setPublish(objectMapper.writeValueAsString(charityNonprofitFundraisingConfigDraftVo.getPublishValue()));
                    if (StringUtils.hasText(charityNonprofitFundraisingConfigDraftVo.getPublishValue().getSite())) {
                        charityNonprofitFundraisingConfigDraftVo.setSite(charityNonprofitFundraisingConfigDraftVo.getPublishValue().getSite());
                    }
                    if (StringUtils.hasText(charityNonprofitFundraisingConfigDraftVo.getPublishValue().getNftImage())) {
                        charityNonprofitFundraisingConfigDraftVo.setNftImage(charityNonprofitFundraisingConfigDraftVo.getPublishValue().getNftImage());
                    }
                }
            } catch (Exception e) {
                log.error("Donation configuration - serialization exception", e.getMessage());
                throw new RuntimeException(e);
            }
        }
    }

    private void deserializationConfigVo(CharityNonprofitFundraisingConfigDraftVo vo) {
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
