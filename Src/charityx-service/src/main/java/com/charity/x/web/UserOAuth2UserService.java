package com.charity.x.web;

import com.charity.x.service.SysUserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * @Author: Lucass @Date: 2025/11/5 17:46 @Description:
 */

@Slf4j
@Service
@RequiredArgsConstructor
public class UserOAuth2UserService extends DefaultOAuth2UserService {

    private final SysUserService userService;
    private final RestTemplate restTemplate;
    private ObjectMapper objectMapper;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        //TODO Currently using org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService
        try{
            log.info("Processing OAuth2 User Request:{}",objectMapper.writeValueAsString(oAuth2User));
        }catch (Exception e){
            log.error("Failed to process OAuth2 user data", e);
        }
        // Print returned user information
        Map<String, Object> attributes = oAuth2User.getAttributes();
        log.info("OAuth Provider: " + registrationId);
        log.info("User Info: " + attributes);

        return oAuth2User; // You can also wrap it into your own user object and return
    }
}
