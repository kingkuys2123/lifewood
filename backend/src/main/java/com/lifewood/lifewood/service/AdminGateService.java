package com.lifewood.lifewood.service;

import com.lifewood.lifewood.dto.auth.AdminGateUnlockResponseDTO;
import com.lifewood.lifewood.util.UnauthorizedException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AdminGateService {

    private static final String GATE_SCOPE = "admin_gate_unlock";

    @Value("${app.admin-gate.keyword:kingkuys2123}")
    private String adminGateKeyword;

    @Value("${app.admin-gate.secret:lifewood-admin-gate-secret-change-me-32-chars-min}")
    private String adminGateSecret;

    @Value("${app.admin-gate.token-validity-ms:900000}")
    private long adminGateTokenValidityMs;

    public AdminGateUnlockResponseDTO unlock(String submittedKeyword, String clientIp) {
        String normalizedKeyword = normalize(submittedKeyword);
        if (!normalize(adminGateKeyword).equals(normalizedKeyword)) {
            log.warn("Admin gate unlock failed ip={} reason=invalid-keyword", clientIp);
            throw new UnauthorizedException("Admin portal access is restricted");
        }

        String token = generateGateToken();
        log.info("Admin gate unlock succeeded ip={}", clientIp);
        return AdminGateUnlockResponseDTO.builder()
                .gateToken(token)
                .tokenType("Bearer")
                .expiresInMs(adminGateTokenValidityMs)
                .build();
    }

    public void assertValidGateToken(String gateToken, String source) {
        String token = normalize(gateToken);
        if (token.isBlank() || !isGateTokenValid(token)) {
            log.warn("Blocked login attempt because admin gate token is missing/invalid source={}", source);
            throw new UnauthorizedException("Admin portal is locked. Return to homepage.");
        }
    }

    private String generateGateToken() {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + adminGateTokenValidityMs);
        return Jwts.builder()
                .subject("admin-gate")
                .claim("scope", GATE_SCOPE)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSigningKey())
                .compact();
    }

    private boolean isGateTokenValid(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String scope = claims.get("scope", String.class);
            return GATE_SCOPE.equals(scope) && claims.getExpiration().after(new Date());
        } catch (Exception ex) {
            return false;
        }
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(adminGateSecret.getBytes(StandardCharsets.UTF_8));
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}

