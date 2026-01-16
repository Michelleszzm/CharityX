package com.charity.x.config;


import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityScheme.In;
import io.swagger.v3.oas.models.security.SecurityScheme.Type;
import io.swagger.v3.oas.models.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @Author: Lucass @Date: 2025/11/6 14:56 @Description:
 */
@Slf4j
@Configuration
public class SwaggerConfig {

    @Value("${spring.application.name}")
    private String applicationName;

    @Value("${spring.profiles.active}")
    private String springProfilesActive;

    @ConditionalOnExpression("!'${spring.profiles.active:}'.contains('prd')")
    @Bean
    public OpenAPI customOpenAPI() {
        // Define JWT security scheme
        SecurityScheme jwtAuthScheme = new SecurityScheme()
                .type(Type.HTTP) // Type: HTTP
                .scheme("bearer") // Use Bearer Token
                .bearerFormat("JWT") // Format: JWT
                .in(In.HEADER) // Read from request header
                .name("Authorization"); // Header name

        OpenAPI openAPI = new OpenAPI()
                .info(new Info()
                        .title("Charity Pay API Documentation")
                        .description("Spring Boot 3.x Integration Swagger + JWT Example")
                        .version("v1.0.0")
                        .license(new License().name("Apache 2.0").url("https://springdoc.org")))
                .addTagsItem(new Tag().name("1.User Login"))
                .addTagsItem(new Tag().name("2.User Related Endpoints"))
                .addTagsItem(new Tag().name("3.Fundraising"))
                .addTagsItem(new Tag().name("4.Fundraising Records"))
                // Add JWT security settings globally
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", jwtAuthScheme));

        if ("dev".equals(springProfilesActive)){
            log.info("Swagger UI page http://localhost:8080/"+ applicationName +"/swagger-ui/index.html");
            log.info("OpenAPI JSON   http://localhost:8080/" +applicationName+ "/v3/api-docs");
        }else {
            log.info("Swagger UI page https://qa-service.charityx.pro/"+ applicationName +"/swagger-ui/index.html");
            log.info("OpenAPI JSON  https://qa-service.charityx.pro/" +applicationName+ "/v3/api-docs");
        }
        log.info("[Swagger UI] init success");
        return openAPI;
    }
}

