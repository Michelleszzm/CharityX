package com.charity.x.web;

import com.charity.x.common.menu.SysRoleCodeEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/5 17:36 @Description:
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final MyAccessDeniedHandler myAccessDeniedHandler;

    private final JwtProperties jwtProperties;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final UserOAuth2UserService userOAuth2UserService;

    private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;

    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    private final OAuth2FailureFilter oAuth2FailureFilter;

    @Bean
    public OidcUserService oidcUserService() {
        return new OidcUserService();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, OidcUserService oidcUserService, ClientRegistrationRepository clientRegistrationRepository) throws Exception {

        MyOAuth2AuthorizationRequestResolver resolver =
                new MyOAuth2AuthorizationRequestResolver(clientRegistrationRepository);
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authz -> authz
                        // Public endpoints - no authentication required
                        .requestMatchers(
                                "/health-check",
                                "/auth/**",
                                "/public/**",
                                "/error",
                                "/customer/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/webjars/**"
                        ).permitAll()

                        .requestMatchers(jwtProperties.getExcludeUrl().toArray(new String[0])).permitAll()

                        // User endpoints - require USER role
                        .requestMatchers("/user/**").hasRole(SysRoleCodeEnum.USER.getCode())
                        // Admin endpoints - require ADMIN role
                        .requestMatchers("/admin/**").hasRole(SysRoleCodeEnum.ADMIN.getCode())

                        // All other requests require authentication
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(authorization -> authorization
                                .baseUri("/unAuth/oauth2/authorize")
                                .authorizationRequestResolver(resolver)
                        )
                        .redirectionEndpoint(redirection -> redirection
                                .baseUri("/unAuth/oauth2/callback/*")
                        )
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(oAuth2UserRequest -> {
                                    String registrationId = oAuth2UserRequest.getClientRegistration().getRegistrationId();
                                    if ("google".equals(registrationId)) {
                                        return oidcUserService.loadUser((OidcUserRequest) oAuth2UserRequest);
                                    } else {
                                        return userOAuth2UserService.loadUser(oAuth2UserRequest);
                                    }
                                })
                        )
                        .successHandler(oAuth2AuthenticationSuccessHandler)
                        .failureHandler(oAuth2AuthenticationFailureHandler)
                )
                .exceptionHandling(ex -> ex.accessDeniedHandler(myAccessDeniedHandler))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(oAuth2FailureFilter, OAuth2LoginAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("*"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
