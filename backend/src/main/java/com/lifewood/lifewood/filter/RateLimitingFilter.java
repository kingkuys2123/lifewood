package com.lifewood.lifewood.filter;

import com.lifewood.lifewood.config.RateLimitConfig;
import com.lifewood.lifewood.dto.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * Rate limiting filter for authentication endpoints.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitingFilter extends OncePerRequestFilter {

    private final RateLimitConfig rateLimitConfig;
    private final ObjectMapper objectMapper;

    @Value("${app.auth.rate-limit.endpoints:/auth/login,/auth/forgot-password,/auth/reset-password,/auth/reset-password/validate}")
    private String rateLimitedEndpoints;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Limit only state-changing auth operations to avoid penalizing CORS preflight/reads.
        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String requestPath = request.getRequestURI();
        List<String> limitedPaths = Arrays.stream(rateLimitedEndpoints.split(","))
                .map(String::trim)
                .filter(path -> !path.isBlank())
                .toList();

        String matchedPath = limitedPaths.stream().filter(requestPath::endsWith).findFirst().orElse(null);
        if (matchedPath == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String ip = getClientIp(request);
        String limiterKey = ip + "|" + request.getMethod() + "|" + matchedPath;
        if (!rateLimitConfig.allowRequestForKey(limiterKey)) {
            long retryAfterSeconds = rateLimitConfig.getRetryAfterSeconds();
            log.warn("Rate limit exceeded for IP: {} on endpoint: {}", ip, requestPath);

            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.addHeader("Retry-After", String.valueOf(retryAfterSeconds));

            ApiResponse<Map<String, Object>> payload = ApiResponse.failure(
                    "Too many requests. Please try again in " + retryAfterSeconds + " seconds.",
                    Map.of("retryAfterSeconds", retryAfterSeconds, "endpoint", matchedPath));
            response.getWriter().write(objectMapper.writeValueAsString(payload));
            return;
        }

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
