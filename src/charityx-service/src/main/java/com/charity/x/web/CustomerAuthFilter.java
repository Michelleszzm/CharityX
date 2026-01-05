package com.charity.x.web;

import com.charity.x.common.CharityXContextHolder;
import com.charity.x.common.menu.NonprofitMergeStatusEnum;
import com.charity.x.common.menu.SysRoleCodeEnum;
import com.charity.x.dto.ResultCode;
import com.charity.x.dto.vo.CharityNonprofitFundraisingConfigVo;
import com.charity.x.dto.vo.CharityNonprofitVo;
import com.charity.x.exception.BusinessException;
import com.charity.x.service.CharityNonprofitFundraisingConfigService;
import com.charity.x.service.CharityNonprofitService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * @Author: Lucass @Date: 2025/11/5 17:35 @Description:
 */
@Slf4j
@Component
@Order(1)
public class CustomerAuthFilter extends OncePerRequestFilter {

    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    @Value("${server.servlet.context-path}")
    private String contextPath;
    @Autowired
    private CharityNonprofitService nonprofitService;
    @Autowired
    private CharityNonprofitFundraisingConfigService configService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            if (isPermitUrl(request.getRequestURI())){
                String site = parseSiteWithCheck(request);
                CharityNonprofitFundraisingConfigVo configVo = configService.queryBySiteWithCache(site);
                if (configVo == null || configVo.getPublishStatus() != 1){
                    throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "The configuration information corresponding to [Released] cannot be found according to SITE：SITE=" + site);
                }
                CharityNonprofitVo nonprofitVo = nonprofitService.getByUserId(configVo.getUserId());
                if (nonprofitVo == null || nonprofitVo.getStatus() != NonprofitMergeStatusEnum.MERGE_STATUS_ACTIVE.getStatus()){
                    throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "Organization review status is not Active" + site);
                }
                CharityXContextHolder.setRole(SysRoleCodeEnum.CUSTOMER.getCode());
                CharityXContextHolder.setUserId(configVo.getUserId());
                CharityXContextHolder.setSite(site);
            }
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            log.error("Customer Auth FaiL : {}", e.getMessage());
            response.getWriter().print("{\"code\":404,\"message\":\"NOT FUND\",\"success\":false}");
        }finally{
            CharityXContextHolder.clear();
        }
    }

    private String parseSiteWithCheck(HttpServletRequest request) {
        String headerSite = request.getHeader("site");
        if (!StringUtils.hasText(headerSite)) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "SITE information in request header is empty, access denied");
        }
        return headerSite;
    }

    private boolean isPermitUrl(String requestUri) {
        return pathMatcher.match(contextPath + "/customer/**", requestUri);
    }
}
