package com.charity.x.common.utils;

import com.charity.x.common.menu.RedisKeyEnum;
import com.charity.x.dto.AuthUser;
import com.charity.x.web.JwtProperties;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * @Author: Lucass @Date: 2025/11/5 17:20 @Description:
 */
@Slf4j
@Data
@Component
public class JwtUtil {

    @Autowired
    private JwtProperties jwtProperties;
    @Autowired
    private RedisCacheUtil redisCacheUtil;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes());
    }

    public String extractSub(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            log.warn("JWT token expired: {}", e.getMessage());
            throw e;
        } catch (JwtException e) {
            log.error("JWT token validation failed: {}", e.getMessage());
            throw new RuntimeException("Invalid JWT token");
        }
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    public String generateTokenWithToRedis(AuthUser authUser) {
        String token = generateToken(authUser);
        String key = String.format(RedisKeyEnum.JWT_TOKEN.getKeyExpression(), token);
        authUser.setToken(token);
        redisCacheUtil.set(key,authUser,jwtProperties.getExpiration() + 60, TimeUnit.SECONDS);
        return token;
    }

    private String generateToken(AuthUser authUser) {
        Map<String, Object> claims = new HashMap<>();
        // Add role information
        claims.put("roles", authUser.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));
        claims.put("email", authUser.getEmail());
        claims.put("userId", authUser.getUserId());
        return createToken(claims, authUser.getEmail());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getExpiration() * 1000))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Boolean validateToken(String token, AuthUser authUser) {
        final String email = extractSub(token);
        return (email.equals(authUser.getEmail()) && !isTokenExpired(token));
    }

    public Long extractUserId(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("userId", Long.class);
    }
}
