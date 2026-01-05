package com.charity.x.web;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

/**
 * @Author: Lucass @Date: 2025/11/6 08:34 @Description:
 */
@Slf4j
@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Value("${oauth.redirect-url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {

        //log.error("OAuth2 authentication failed: {}", exception.getMessage(), exception);
        log.error("OAuth2 authentication failed..........");
        String errorRedirectUrl = UriComponentsBuilder.fromHttpUrl(frontendUrl)
                .queryParam("isSuccess",false)
                //.queryParam("error", exception.getMessage())
                .queryParam("error_type", "authentication_failed")
                .build().toUriString();

        response.sendRedirect(errorRedirectUrl);
    }
}
