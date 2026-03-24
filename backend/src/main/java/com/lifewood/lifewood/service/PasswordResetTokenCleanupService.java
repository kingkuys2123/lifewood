package com.lifewood.lifewood.service;

import com.lifewood.lifewood.repository.PasswordResetTokenRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetTokenCleanupService {

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Transactional
    @Scheduled(cron = "${app.auth.reset-token-purge-cron:0 30 3 * * *}")
    public void purgeExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        passwordResetTokenRepository.deleteByExpiresAtBefore(now);
        log.debug("Purged expired password reset tokens at {}", now);
    }
}

