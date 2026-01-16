package com.charity.x.common.utils;

import com.github.benmanes.caffeine.cache.*;
import java.util.concurrent.*;

/**
 * @Author: Lucass @Date: 2025/11/6 11:00 @Description:
 */
public class MemeryCache<K, V> {

    /**
     * Store expiration time for each key (nanoseconds)
     */
    private final ConcurrentHashMap<K, Long> expireMap = new ConcurrentHashMap<>();

    /**
     * Cache body: Based on Caffeine + custom Expiry strategy
     */
    private final Cache<K, V> cache = Caffeine.newBuilder()
            .maximumSize(10000)
            // Custom expiration strategy: dynamically read TTL for each key from expireMap
            .expireAfter(new Expiry<K, V>() {
                @Override
                public long expireAfterCreate(K key, V value, long currentTime) {
                    return expireMap.getOrDefault(key, TimeUnit.MINUTES.toNanos(5)); // Default 5 minutes
                }

                @Override
                public long expireAfterUpdate(K key, V value, long currentTime, long currentDuration) {
                    return expireAfterCreate(key, value, currentTime);
                }

                @Override
                public long expireAfterRead(K key, V value, long currentTime, long currentDuration) {
                    return currentDuration; // Reading does not affect expiration time
                }
            })
            .removalListener((K key, V value, RemovalCause cause) -> expireMap.remove(key))
            .build();

    /**
     * Write to cache and specify TTL
     *
     * @param key key
     * @param value value
     * @param ttl Expiration duration
     * @param unit Time unit
     */
    public void put(K key, V value, long ttl, TimeUnit unit) {
        expireMap.put(key, unit.toNanos(ttl));
        cache.put(key, value);
    }

    /**
     * Get cache
     */
    public V get(K key) {
        return cache.getIfPresent(key);
    }

    /**
     * Delete cache
     */
    public void remove(K key) {
        expireMap.remove(key);
        cache.invalidate(key);
    }

    /**
     * Clear cache
     */
    public void clear() {
        expireMap.clear();
        cache.invalidateAll();
    }

    /**
     * Get current cache size
     */
    public long size() {
        return cache.estimatedSize();
    }
}

