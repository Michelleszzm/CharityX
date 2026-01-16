package com.charity.x.web;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/6 15:22 @Description:
 */
@Configuration
@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtProperties {

    private String secret;

    private Long expiration;

    private List<String> excludeUrl;
}
