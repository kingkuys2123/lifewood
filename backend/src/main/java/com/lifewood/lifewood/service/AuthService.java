package com.lifewood.lifewood.service;

import com.lifewood.lifewood.dto.auth.AuthResponseDTO;
import com.lifewood.lifewood.dto.auth.AdminGateUnlockRequestDTO;
import com.lifewood.lifewood.dto.auth.AdminGateUnlockResponseDTO;
import com.lifewood.lifewood.dto.auth.ForgotPasswordRequestDTO;
import com.lifewood.lifewood.dto.auth.LoginRequestDTO;
import com.lifewood.lifewood.dto.auth.RefreshTokenRequestDTO;
import com.lifewood.lifewood.dto.auth.ResetPasswordRequestDTO;
import com.lifewood.lifewood.entity.PasswordResetTokenEntity;
import com.lifewood.lifewood.entity.RefreshTokenEntity;
import com.lifewood.lifewood.entity.UserEntity;
import com.lifewood.lifewood.filter.JwtUtil;
import com.lifewood.lifewood.repository.PasswordResetTokenRepository;
import com.lifewood.lifewood.repository.RefreshTokenRepository;
import com.lifewood.lifewood.repository.UserRepository;
import com.lifewood.lifewood.util.BadRequestException;
import com.lifewood.lifewood.util.UnauthorizedException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final int RESET_TOKEN_BYTES = 32;

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;
    private final AdminGateService adminGateService;

    @Value("${app.auth.reset-token-validity-minutes:30}")
    private long resetTokenValidityMinutes;

    @Value("${app.frontend.reset-password-url:http://localhost:5173/reset-password}")
    private String resetPasswordUrl;

    @Transactional
    public AdminGateUnlockResponseDTO unlockAdminGate(AdminGateUnlockRequestDTO request, String clientIp) {
        return adminGateService.unlock(request.getKeyword(), clientIp);
    }

    @Transactional
    public AuthResponseDTO login(LoginRequestDTO request, String adminGateToken, String source) {
        adminGateService.assertValidGateToken(adminGateToken, source);

        String identifier = normalize(request.getUsername());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(identifier, request.getPassword()));
        } catch (AuthenticationException ex) {
            log.warn("Failed login attempt source={} identifier={}", source, identifier);
            throw new UnauthorizedException("Wrong Username/Password");
        }

        UserEntity userEntity = userRepository.findByUsernameIgnoreCase(identifier)
                .or(() -> userRepository.findByEmailIgnoreCase(identifier))
                .orElseThrow(() -> new UnauthorizedException("Wrong Username/Password"));

        String accessToken = jwtUtil.generateAccessToken(userEntity.getUsername(), userEntity.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(userEntity.getUsername(), userEntity.getRole().name());
        rotatePersistedRefreshToken(userEntity, null, refreshToken);
        log.info("UserEntity authenticated: {} source={}", userEntity.getUsername(), source);

        return AuthResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getAccessTokenValidityMs())
                .build();
    }

    @Transactional
    public void requestPasswordReset(ForgotPasswordRequestDTO request) {
        String email = normalize(request.getEmail());
        log.debug("Processing password reset request for email: {}", email);

        var userOptional = userRepository.findByEmailIgnoreCase(email);
        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();
            passwordResetTokenRepository.deleteByUser_Id(user.getId());
            passwordResetTokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());

            String rawToken = generateRawToken();
            PasswordResetTokenEntity tokenEntity = PasswordResetTokenEntity.builder()
                    .user(user)
                    .tokenHash(hashToken(rawToken))
                    .expiresAt(LocalDateTime.now().plusMinutes(resetTokenValidityMinutes))
                    .build();
            passwordResetTokenRepository.save(tokenEntity);

            String resetUrl = buildResetUrl(rawToken);
            log.info("Dispatching password reset email to {} with expiry {} minutes", email, resetTokenValidityMinutes);
            emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), resetUrl);
        } else {
            log.info("Password reset requested for non-existent email: {}", email);
        }
    }

    @Transactional(readOnly = true)
    public boolean isResetTokenValid(String token) {
        String rawToken = normalize(token);
        if (rawToken.isBlank()) {
            return false;
        }

        return passwordResetTokenRepository.findByTokenHash(hashToken(rawToken))
                .map(this::isTokenUsable)
                .orElse(false);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequestDTO request) {
        String rawToken = normalize(request.getToken());
        String newPassword = normalize(request.getNewPassword());
        validatePasswordQuality(newPassword);

        PasswordResetTokenEntity tokenEntity = passwordResetTokenRepository.findByTokenHash(hashToken(rawToken))
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));

        if (!isTokenUsable(tokenEntity)) {
            throw new BadRequestException("Invalid or expired reset token");
        }

        UserEntity userEntity = tokenEntity.getUser();
        if (passwordEncoder.matches(newPassword, userEntity.getPassword())) {
            throw new BadRequestException("New password must be different from current password");
        }

        userEntity.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(userEntity);

        tokenEntity.setUsedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(tokenEntity);
        passwordResetTokenRepository.deleteByUser_Id(userEntity.getId());
    }

    @Transactional
    public AuthResponseDTO refresh(RefreshTokenRequestDTO request) {
        String incomingRefreshToken = normalize(request.getRefreshToken());
        if (!jwtUtil.isTokenValid(incomingRefreshToken)) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        String username = jwtUtil.extractUsername(incomingRefreshToken);
        String tokenId = jwtUtil.extractTokenId(incomingRefreshToken);

        UserEntity userEntity = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        RefreshTokenEntity persistedToken = refreshTokenRepository.findByTokenId(tokenId)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (!isRefreshTokenUsable(persistedToken, incomingRefreshToken, userEntity.getId())) {
            revokeRefreshToken(persistedToken, null);
            throw new UnauthorizedException("Invalid refresh token");
        }

        String accessToken = jwtUtil.generateAccessToken(userEntity.getUsername(), userEntity.getRole().name());
        String nextRefreshToken = jwtUtil.generateRefreshToken(userEntity.getUsername(), userEntity.getRole().name());
        rotatePersistedRefreshToken(userEntity, persistedToken, nextRefreshToken);

        return AuthResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(nextRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getAccessTokenValidityMs())
                .build();
    }

    @Transactional
    public void logout(RefreshTokenRequestDTO request) {
        String incomingRefreshToken = normalize(request.getRefreshToken());
        if (!jwtUtil.isTokenValid(incomingRefreshToken)) {
            return;
        }

        String tokenId = jwtUtil.extractTokenId(incomingRefreshToken);
        refreshTokenRepository.findByTokenId(tokenId)
                .ifPresent(tokenEntity -> revokeRefreshToken(tokenEntity, null));
    }

    private void rotatePersistedRefreshToken(UserEntity userEntity, RefreshTokenEntity currentToken, String nextRawToken) {
        purgeExpiredRefreshTokens();

        if (currentToken == null) {
            refreshTokenRepository.findByUser_IdAndRevokedAtIsNull(userEntity.getId())
                    .forEach(tokenEntity -> revokeRefreshToken(tokenEntity, null));
        }

        String nextTokenId = jwtUtil.extractTokenId(nextRawToken);
        if (currentToken != null) {
            revokeRefreshToken(currentToken, nextTokenId);
        }

        RefreshTokenEntity tokenEntity = RefreshTokenEntity.builder()
                .user(userEntity)
                .tokenId(nextTokenId)
                .tokenHash(hashToken(nextRawToken))
                .expiresAt(LocalDateTime.now().plusNanos(jwtUtil.getRefreshTokenValidityMs() * 1_000_000))
                .build();

        refreshTokenRepository.save(tokenEntity);
    }

    private boolean isRefreshTokenUsable(RefreshTokenEntity tokenEntity, String rawToken, Long expectedUserId) {
        if (tokenEntity.getRevokedAt() != null || tokenEntity.getExpiresAt().isBefore(LocalDateTime.now())) {
            return false;
        }

        if (!tokenEntity.getUser().getId().equals(expectedUserId)) {
            return false;
        }

        return tokenEntity.getTokenHash().equals(hashToken(rawToken));
    }

    private void revokeRefreshToken(RefreshTokenEntity tokenEntity, String replacedByTokenId) {
        if (tokenEntity.getRevokedAt() != null) {
            return;
        }

        tokenEntity.setRevokedAt(LocalDateTime.now());
        tokenEntity.setReplacedByTokenId(replacedByTokenId);
        refreshTokenRepository.save(tokenEntity);
    }

    private void purgeExpiredRefreshTokens() {
        refreshTokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }

    private boolean isTokenUsable(PasswordResetTokenEntity tokenEntity) {
        return tokenEntity.getUsedAt() == null && !tokenEntity.getExpiresAt().isBefore(LocalDateTime.now());
    }

    private String buildResetUrl(String rawToken) {
        String baseUrl = normalizeResetPasswordUrl(resetPasswordUrl);
        String separator = baseUrl.contains("?") ? "&" : "?";
        return baseUrl + separator + "token=" + rawToken;
    }

    private String normalizeResetPasswordUrl(String configuredUrl) {
        String fallback = "http://localhost:5173/reset-password";
        String candidate = stripWrappingQuotes(normalize(configuredUrl));
        if (candidate.isBlank()) {
            return fallback;
        }

        String value = candidate.endsWith("/") ? candidate.substring(0, candidate.length() - 1) : candidate;
        if (!value.endsWith("/reset-password") && !value.contains("/reset-password?")) {
            value = value + "/reset-password";
        }
        return value;
    }

    private String stripWrappingQuotes(String value) {
        if (value == null || value.length() < 2) {
            return value;
        }

        if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
            return value.substring(1, value.length() - 1).trim();
        }
        return value;
    }

    private String generateRawToken() {
        byte[] tokenBytes = new byte[RESET_TOKEN_BYTES];
        new SecureRandom().nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder(hash.length * 2);
            for (byte value : hash) {
                builder.append(String.format("%02x", value));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("Unable to hash reset token", ex);
        }
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private void validatePasswordQuality(String password) {
        if (password.length() < 8 || password.length() > 72) {
            throw new BadRequestException("Password must be between 8 and 72 characters");
        }

        boolean hasLetter = password.chars().anyMatch(Character::isLetter);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        if (!hasLetter || !hasDigit) {
            throw new BadRequestException("Password must include at least one letter and one number");
        }
    }
}

