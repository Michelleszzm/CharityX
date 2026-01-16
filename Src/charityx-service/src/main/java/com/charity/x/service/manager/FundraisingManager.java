package com.charity.x.service.manager;

import com.charity.x.common.utils.MapstructUtils;
import com.charity.x.dto.vo.CharityFundraisingTemplateVo;
import com.charity.x.dto.vo.CharityNonprofitFundraisingConfigDraftVo;
import com.charity.x.dto.vo.CharityNonprofitFundraisingConfigVo;
import com.charity.x.service.CharityFundraisingTemplateService;
import com.charity.x.service.CharityNonprofitFundraisingConfigDraftService;
import com.charity.x.service.CharityNonprofitFundraisingConfigService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/6 21:02 @Description:
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FundraisingManager {
    private final CharityFundraisingTemplateService charityFundraisingTemplateService;
    private final CharityNonprofitFundraisingConfigService charityNonprofitFundraisingConfigService;
    private final CharityNonprofitFundraisingConfigDraftService charityNonprofitFundraisingConfigDraftService;


    public List<CharityFundraisingTemplateVo> queryAllTemplate() {
        return charityFundraisingTemplateService.queryAll();
    }

    public CharityNonprofitFundraisingConfigVo customerQueryConfigBySitWithCache(String site) {
        // Query published configuration, prioritize published configuration, draft configuration is invalid
        return charityNonprofitFundraisingConfigService.queryBySiteWithCache(site);
    }

    public CharityNonprofitFundraisingConfigVo queryConfigByUserId(Integer userId) {
        CharityNonprofitFundraisingConfigVo vo = MapstructUtils.convert(charityNonprofitFundraisingConfigDraftService.queryByUserId(userId), CharityNonprofitFundraisingConfigVo.class);
        if (vo != null){
            vo.setPublishStatusDraft(vo.getPublishStatus());
            vo.setPublishStatus(-1);
            CharityNonprofitFundraisingConfigVo configVo = charityNonprofitFundraisingConfigService.queryByUserId(userId);
            if (configVo != null){
                vo.setPublishStatus(configVo.getPublishStatus());
            }
        }
        return vo;
    }

    public Boolean siteSubmit(CharityNonprofitFundraisingConfigVo vo) {
        CharityNonprofitFundraisingConfigVo exitVo = charityNonprofitFundraisingConfigService.queryBySite(vo.getSite());
        if (exitVo != null && !exitVo.getUserId().equals(vo.getUserId())) {
            return Boolean.FALSE;
        }
        return Boolean.TRUE;
    }

    public Boolean saveConfig(CharityNonprofitFundraisingConfigVo charityNonprofitFundraisingConfigVo) {
        CharityNonprofitFundraisingConfigDraftVo draftVo = MapstructUtils.convert(charityNonprofitFundraisingConfigVo, CharityNonprofitFundraisingConfigDraftVo.class);
        return charityNonprofitFundraisingConfigDraftService.saveOrUpdate(draftVo) > 0;
    }

    @Transactional(rollbackFor = Exception.class, timeout = 5)
    public Boolean publish(CharityNonprofitFundraisingConfigVo charityNonprofitFundraisingConfigVo) {
        if (charityNonprofitFundraisingConfigVo.getPublishStatus() == 1) {
            // Sync draft configuration to published configuration
            CharityNonprofitFundraisingConfigDraftVo draftVo = charityNonprofitFundraisingConfigDraftService.queryByUserId(charityNonprofitFundraisingConfigVo.getUserId());
            CharityNonprofitFundraisingConfigVo saveVo = MapstructUtils.convert(draftVo, CharityNonprofitFundraisingConfigVo.class);
            assert saveVo != null;
            saveVo.setId(null);
            charityNonprofitFundraisingConfigService.saveOrUpdate(saveVo);
        }
        CharityNonprofitFundraisingConfigVo vo = new CharityNonprofitFundraisingConfigVo();
        vo.setPublishStatus(charityNonprofitFundraisingConfigVo.getPublishStatus());
        vo.setUserId(charityNonprofitFundraisingConfigVo.getUserId());
        Boolean publish = charityNonprofitFundraisingConfigService.publish(charityNonprofitFundraisingConfigVo);
        CharityNonprofitFundraisingConfigDraftVo draftVo = MapstructUtils.convert(vo, CharityNonprofitFundraisingConfigDraftVo.class);
        Boolean draftPublish = charityNonprofitFundraisingConfigDraftService.publish(draftVo);
        log.info("Publish result: {}", publish);
        return publish && draftPublish;
    }
}
