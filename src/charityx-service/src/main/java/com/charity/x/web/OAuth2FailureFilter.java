package com.charity.x.web;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-20
 * @Description:
 * @Version: 1.0
 */
@Slf4j
@Component
public class OAuth2FailureFilter extends OncePerRequestFilter {

    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    @Value("${server.servlet.context-path}")
    private String contextPath;
    @Value("${oauth.redirect-url}")
    private String frontendUrl;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        boolean match = pathMatcher.match(contextPath + "/unAuth/oauth2/callback/*", requestURI);
        if (match){
            Map<String, String[]> map = request.getParameterMap();
            if (requestURI.contains("google")){
                String[] errorArray = map.get("error");
                if (errorArray != null && errorArray.length > 0){
                    String error = errorArray[0];
                    if (StringUtils.hasText( error)){
                        log.warn("google auth error: {}", error);
                        MultiValueMap<String, String> multiValueMap = new LinkedMultiValueMap<>();
                        map.forEach((key, values) -> {
                            for (String v : values) {
                                multiValueMap.add(key, v);
                            }
                        });
                        String errorRedirectUrl = UriComponentsBuilder.fromHttpUrl(frontendUrl)
                                .queryParam("isSuccess",false)
                                .queryParams(multiValueMap)
                                .build().toUriString();

                        response.sendRedirect(errorRedirectUrl);
                        return;
                    }
                }
            }
        }
        filterChain.doFilter(request, response);
    }
}
