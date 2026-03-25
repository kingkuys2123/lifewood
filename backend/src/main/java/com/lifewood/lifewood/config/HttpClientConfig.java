package com.lifewood.lifewood.config;

import java.time.Duration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * HTTP Client Configuration for EmailJS API calls
 * 
 * This configuration provides a RestTemplate bean with proper timeout settings
 * for making HTTP requests to the EmailJS API.
 */
@Slf4j
@Configuration
public class HttpClientConfig {

    /**
     * Create a RestTemplate bean configured for email API calls
     * 
     * Timeout values:
     * - Connection timeout: 6 seconds (time to establish connection)
     * - Read timeout: 12 seconds (time to receive response)
     */
    @Bean
    public RestTemplate emailRestTemplate(RestTemplateBuilder builder) {
        return builder
                .setConnectTimeout(Duration.ofSeconds(6))
                .setReadTimeout(Duration.ofSeconds(12))
                .build();
    }
}

