package com.lifewood.lifewood.filter;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.lifewood.lifewood.config.RateLimitConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class RateLimitingFilterTest {

    @Mock
    private RateLimitConfig rateLimitConfig;

    private RateLimitingFilter filter;

    @BeforeEach
    void setUp() {
        ObjectMapper objectMapper = JsonMapper.builder().findAndAddModules().build();
        filter = new RateLimitingFilter(rateLimitConfig, objectMapper);
        ReflectionTestUtils.setField(filter, "rateLimitedEndpoints", "/auth/login,/auth/forgot-password");
    }

    @Test
    void nonPostRequest_skipsRateLimiting() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("OPTIONS", "/auth/forgot-password");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilter(request, response, chain);

        verify(rateLimitConfig, never()).allowRequestForKey(anyString());
        assertTrue(response.getStatus() < 400);
    }

    @Test
    void postRequest_usesEndpointSpecificLimiterKey() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/auth/forgot-password");
        request.addHeader("X-Forwarded-For", "203.0.113.25");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        when(rateLimitConfig.allowRequestForKey("203.0.113.25|POST|/auth/forgot-password")).thenReturn(true);

        filter.doFilter(request, response, chain);

        verify(rateLimitConfig).allowRequestForKey("203.0.113.25|POST|/auth/forgot-password");
        assertTrue(response.getStatus() < 400);
    }

    @Test
    void rateLimitExceeded_returnsRetryAfterAndApiResponse() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/auth/forgot-password");
        request.addHeader("X-Forwarded-For", "198.51.100.9");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        when(rateLimitConfig.allowRequestForKey("198.51.100.9|POST|/auth/forgot-password")).thenReturn(false);
        when(rateLimitConfig.getRetryAfterSeconds()).thenReturn(12L);

        filter.doFilter(request, response, chain);

        assertTrue(response.getStatus() == 429);
        assertTrue("12".equals(response.getHeader("Retry-After")));
        assertTrue(response.getContentAsString().contains("\"status\":false"));
        assertTrue(response.getContentAsString().contains("retryAfterSeconds"));
    }
}

