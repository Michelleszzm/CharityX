package com.charity.x.web;

import com.charity.x.common.menu.SysUserProviderEnum;
import com.charity.x.dto.vo.SysUserVo;
import com.charity.x.service.LoginService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

/**
 * @Author: Lucass @Date: 2025/11/6 08:32 @Description:
 */
@Slf4j
@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    @Lazy
    private LoginService loginService;

    @Value("${oauth.redirect-url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        if (authentication instanceof OAuth2AuthenticationToken){
            OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;
            String registrationId = oAuth2AuthenticationToken.getAuthorizedClientRegistrationId();
            SysUserVo sysUserVo = new SysUserVo();
            switch (registrationId){
                case "google":
                    OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
                    sysUserVo.setProvider(SysUserProviderEnum.GOOGLE.getProvider());
                    sysUserVo.setProviderId(oidcUser.getAttribute("sub"));
                    sysUserVo.setEmail(oidcUser.getAttribute("email"));
                    sysUserVo.setFirstName(oidcUser.getAttribute("given_name"));
                    sysUserVo.setLastName(oidcUser.getAttribute("family_name"));
                    sysUserVo.setAvatar(oidcUser.getAttribute("picture"));
                    log.info("google oauth2 success :{}", oidcUser);
                    break;
                default:
                    //throw new BusinessException(ResultCode.BUSINESS_OAUTH_CHANNEL_NOT_SUPPORT_ERROR);
                    break;
            }
            String token = loginService.oAuthLogin(sysUserVo);
            String redirectUrl = buildRedirectUrl(token,sysUserVo.getProvider());
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        }else {
            getRedirectStrategy().sendRedirect(request, response, UriComponentsBuilder.fromHttpUrl(frontendUrl).toUriString());
        }
    }

    private String buildRedirectUrl(String token,String provider) {
        return UriComponentsBuilder.fromHttpUrl(frontendUrl)
                .queryParam("isSuccess",true)
                .queryParam("provider", provider)
                .queryParam("token", token)
                .build().toUriString();
    }
}
