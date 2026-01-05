package com.charity.x.web;

import com.charity.x.common.menu.RedisKeyEnum;
import com.charity.x.common.utils.JwtUtil;
import com.charity.x.common.utils.RedisCacheUtil;
import com.charity.x.dto.AuthUser;
import com.charity.x.dto.ResultCode;
import com.charity.x.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @Author: Lucass @Date: 2025/11/5 17:35 @Description:
 */
@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${server.servlet.context-path}")
    private String contextPath;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    @Autowired
    private JwtProperties jwtProperties;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private RedisCacheUtil redisCacheUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        try {
            String requestUri = request.getRequestURI();
            if (!isPermitUrl(requestUri)){
                String jwt = parseJwt(request);
                if (jwt == null) {
                    throw new BusinessException(ResultCode.UNAUTHORIZED);
                }
                String key = String.format(RedisKeyEnum.JWT_TOKEN.getKeyExpression(), jwt);
                AuthUser authUser = redisCacheUtil.get(key, AuthUser.class);
                if (authUser == null || !jwtUtil.validateToken(jwt, authUser)){
                    throw new BusinessException(ResultCode.UNAUTHORIZED);
                }
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(authUser, null, authUser.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("Set authentication for user: {}", authUser);
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication: {}", e.getMessage());
            response.getWriter().print("{\"code\":401,\"message\":\"Unauthorized\",\"success\":false}");
            return;
        }
        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }

    private boolean isPermitUrl(String requestUri) {
        for (String pattern : jwtProperties.getExcludeUrl()) {
            if (pathMatcher.match(contextPath + pattern, requestUri)){
                return true;
            }
        }
        return false;
    }
}
