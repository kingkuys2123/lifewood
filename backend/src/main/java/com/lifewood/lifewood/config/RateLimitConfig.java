package com.lifewood.lifewood.config;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.google.common.util.concurrent.RateLimiter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

/**
 * Rate limiting configuration using Guava for authentication endpoints.
 */
@Slf4j
@Component
public class RateLimitConfig {

    private final LoadingCache<String, RateLimiter> limiters;
    private final int requestCapacity;
    private final int windowSeconds;

    public RateLimitConfig(
            @Value("${app.auth.rate-limit.request-capacity:5}") int requestCapacity,
            @Value("${app.auth.rate-limit.window-seconds:60}") int windowSeconds,
            @Value("${app.auth.rate-limit.cache-expiry-minutes:10}") int cacheExpiryMinutes) {
        this.requestCapacity = requestCapacity;
        this.windowSeconds = windowSeconds;

        double permitsPerSecond = Math.max(1, requestCapacity) / (double) Math.max(1, windowSeconds);
        this.limiters = CacheBuilder.newBuilder()
                .expireAfterAccess(Math.max(1, cacheExpiryMinutes), TimeUnit.MINUTES)
                .build(new CacheLoader<String, RateLimiter>() {
                    @Override
                    public RateLimiter load(String key) {
                        return RateLimiter.create(permitsPerSecond);
                    }
                });
    }

    /**
     * Get or create a rate limiter for an IP address.
     * Returns true if request is allowed, false if rate limit exceeded.
     */
    public boolean allowRequest(String ip) {
        return allowRequestForKey(ip);
    }

    /**
     * Get or create a rate limiter for a logical key (e.g. IP + endpoint + method).
     */
    public boolean allowRequestForKey(String key) {
        try {
            RateLimiter rateLimiter = limiters.get(key);
            return rateLimiter.tryAcquire();
        } catch (ExecutionException e) {
            log.error("Error retrieving rate limiter for key: {}", key, e);
            return false;
        }
    }

    /**
     * Get the wait time in seconds until next request is allowed.
     */
    public long getRetryAfterSeconds() {
        return Math.max(1L, (long) Math.ceil(windowSeconds / (double) Math.max(1, requestCapacity)));
    }
}
