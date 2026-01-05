package com.charity.x.web;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;

import java.util.HashMap;
import java.util.Map;
/**
 * @Author: Lucass
 * @CreateTime: 2025-11-20
 * @Description:
 * @Version: 1.0
 */
public class MyOAuth2AuthorizationRequestResolver implements OAuth2AuthorizationRequestResolver {

    private final DefaultOAuth2AuthorizationRequestResolver defaultResolver;

    public MyOAuth2AuthorizationRequestResolver(ClientRegistrationRepository repo) {
        this.defaultResolver = new DefaultOAuth2AuthorizationRequestResolver(
                repo, "/unAuth/oauth2/authorize"
        );
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
        OAuth2AuthorizationRequest requestResult = defaultResolver.resolve(request);
        return customize(requestResult);
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request, String clientRegistrationId) {
        OAuth2AuthorizationRequest requestResult = defaultResolver.resolve(request, clientRegistrationId);
        return customize(requestResult);
    }

    private OAuth2AuthorizationRequest customize(OAuth2AuthorizationRequest request) {
        if (request == null) {
            return null;
        }

        Map<String, Object> params = new HashMap<>(request.getAdditionalParameters());
        params.put("prompt", "consent select_account");

        return OAuth2AuthorizationRequest.from(request)
                .additionalParameters(params)
                .build();
    }
}

