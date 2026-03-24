package com.lifewood.lifewood.config;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.google.common.util.concurrent.RateLimiter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

/**
 * Rate limiting configuration using Guava for authentication endpoints.
 * Prevents brute force attacks on login, forgot-password, and reset-password endpoints.
 * Configuration: 5 requests per minute for auth endpoints
 */
@Slf4j
@Component
@Configuration
public class RateLimitConfig {

    private final LoadingCache<String, RateLimiter> limiters = CacheBuilder.newBuilder()
            .expireAfterAccess(10, TimeUnit.MINUTES)
            .build(new CacheLoader<String, RateLimiter>() {
                @Override
                public RateLimiter load(String key) {
                    return RateLimiter.create(5.0 / 60.0); // 5 requests per 60 seconds (1 minute)
                }
            });

    /**
     * Get or create a rate limiter for an IP address.
     * Returns true if request is allowed, false if rate limit exceeded.
     */
    public boolean allowRequest(String ip) {
        try {
            RateLimiter rateLimiter = limiters.get(ip);
            return rateLimiter.tryAcquire();
        } catch (ExecutionException e) {
            log.error("Error retrieving rate limiter for IP: {}", ip, e);
            return false;
        }
    }

    /**
     * Get the wait time in seconds until next request is allowed.
     */
    public double getWaitTime(String ip) {
        try {
            RateLimiter rateLimiter = limiters.get(ip);
            return 1.0 / rateLimiter.getRate();
        } catch (ExecutionException e) {
            log.error("Error retrieving rate limiter for IP: {}", ip, e);
            return 60.0;
        }
    }
}

