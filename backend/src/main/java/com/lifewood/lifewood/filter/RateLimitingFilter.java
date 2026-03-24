package com.lifewood.lifewood.filter;

import com.lifewood.lifewood.config.RateLimitConfig;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Rate limiting filter for authentication endpoints.
 * Protects /auth/login, /auth/forgot-password, and /auth/reset-password from brute force attacks.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitingFilter extends OncePerRequestFilter {

    private final RateLimitConfig rateLimitConfig;

    private static final String[] RATE_LIMITED_PATHS = {
            "/auth/login",
            "/auth/forgot-password",
            "/auth/reset-password"
    };

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Check if this is a rate-limited endpoint
        String requestPath = request.getRequestURI();
        boolean isRateLimited = false;

        for (String path : RATE_LIMITED_PATHS) {
            if (requestPath.endsWith(path)) {
                isRateLimited = true;
                break;
            }
        }

        if (!isRateLimited) {
            filterChain.doFilter(request, response);
            return;
        }

        // Apply rate limiting based on IP address
        String ip = getClientIp(request);
        
        if (!rateLimitConfig.allowRequest(ip)) {
            // Rate limit exceeded
            double waitTime = rateLimitConfig.getWaitTime(ip);
            log.warn("Rate limit exceeded for IP: {} on endpoint: {}", ip, requestPath);

            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.addHeader("Retry-After", String.valueOf((long) Math.ceil(waitTime)));
            response.getWriter().write("{\"error\": \"Too many requests. Please try again in " + (int) Math.ceil(waitTime) + " seconds.\"}");
            return;
        }

        // Request allowed
        filterChain.doFilter(request, response);
    }

    /**
     * Extract client IP address from request, considering proxies.
     */
    private String getClientIp(HttpServletRequest request) {
        String[] headers = {"X-Forwarded-For", "Proxy-Client-IP", "WL-Proxy-Client-IP", "HTTP_CLIENT_IP", "HTTP_X_FORWARDED_FOR"};

        for (String header : headers) {
            String ip = request.getHeader(header);
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                return ip.split(",")[0];
            }
        }

        return request.getRemoteAddr();
    }
}

