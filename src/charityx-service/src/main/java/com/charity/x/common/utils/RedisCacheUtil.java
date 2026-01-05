package com.charity.x.common.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.concurrent.TimeUnit;

/**
 * @Author: Lucass @Date: 2025/11/6 11:17 @Description:
 */
@Slf4j
@Component
public class RedisCacheUtil {

    @Value("${spring.profiles.active}")
    private String env;
    @Value("${spring.application.name}")
    private String applicationName;
    @Autowired
    private StringRedisTemplate stringRedisTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Set cache (with expiration time)
     */
    public void set(String key, String value, long timeout, TimeUnit unit) {
        stringRedisTemplate.opsForValue().set(standardKey(key), value, timeout, unit);
    }

    public void set(String key, Object value, long timeout, TimeUnit unit) {
        try {
            stringRedisTemplate.opsForValue().set(standardKey(key), objectMapper.writeValueAsString(value), timeout, unit);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public Boolean setIfAbsent(String key, String value, long timeout, TimeUnit unit) {
        return stringRedisTemplate.opsForValue().setIfAbsent(standardKey(key), value, timeout, unit);
    }

    /**
     * Get cache
     */
    public String get(String key) {
        return stringRedisTemplate.opsForValue().get(standardKey(key));
    }

    /**
     * Get cache
     */
    public <T> T get(String key, Class<T> clazz) {
        String value = stringRedisTemplate.opsForValue().get(standardKey(key));
        if (StringUtils.hasText(value)) {
            try {
                return objectMapper.readValue(value, clazz);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }
        return null;
    }

    public <T> T get(String key, TypeReference<T> clazz) {
        String value = stringRedisTemplate.opsForValue().get(standardKey(key));
        if (StringUtils.hasText(value)) {
            try {
                return objectMapper.readValue(value, clazz);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }
        return null;
    }

    /**
     * Delete cache
     */
    public boolean delete(String key) {
        return Boolean.TRUE.equals(stringRedisTemplate.delete(standardKey(key)));
    }

    /**
     * Check if exists
     */
    public boolean hasKey(String key) {
        return Boolean.TRUE.equals(stringRedisTemplate.hasKey(standardKey(key)));
    }

    /**
     * Set expiration time
     */
    public boolean expire(String key, long timeout, TimeUnit unit) {
        return Boolean.TRUE.equals(stringRedisTemplate.expire(standardKey(key), timeout, unit));
    }

    /**
     * Get remaining expiration time (seconds)
     */
    public long getExpire(String key) {
        return stringRedisTemplate.getExpire(standardKey(key), TimeUnit.SECONDS);
    }

    public String standardKey(String key) {
        return applicationName + ":" + env + ":" + key;
    }
}

