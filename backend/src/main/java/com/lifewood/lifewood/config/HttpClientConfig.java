package com.lifewood.lifewood.config;

import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class HttpClientConfig {

    @Bean
    public RestTemplate emailRestTemplate(
            RestTemplateBuilder builder,
            @Value("${app.mail.resend.connect-timeout-ms:6000}") long connectTimeoutMs,
            @Value("${app.mail.resend.read-timeout-ms:12000}") long readTimeoutMs) {
        return builder
                .setConnectTimeout(Duration.ofMillis(Math.max(1000L, connectTimeoutMs)))
                .setReadTimeout(Duration.ofMillis(Math.max(1000L, readTimeoutMs)))
                .build();
    }
}

