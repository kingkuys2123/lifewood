package com.lifewood.lifewood.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

	@Value("${app.jwt.secret}")
	private String secret;

	@Value("${app.jwt.access-token-validity-ms}")
	private long accessTokenValidityMs;

	@Value("${app.jwt.refresh-token-validity-ms}")
	private long refreshTokenValidityMs;

	public String generateAccessToken(String username, String role) {
		return buildToken(username, role, accessTokenValidityMs);
	}

	public String generateRefreshToken(String username, String role) {
		return buildToken(username, role, refreshTokenValidityMs);
	}

	public String extractUsername(String token) {
		return extractClaims(token).getSubject();
	}

	public String extractRole(String token) {
		return extractClaims(token).get("role", String.class);
	}

	public boolean isTokenValid(String token) {
		try {
			return extractClaims(token).getExpiration().after(new Date());
		} catch (Exception ex) {
			return false;
		}
	}

	public long getAccessTokenValidityMs() {
		return accessTokenValidityMs;
	}

	private String buildToken(String username, String role, long validityMs) {
		Date now = new Date();
		Date expiry = new Date(now.getTime() + validityMs);
		return Jwts.builder()
				.subject(username)
				.claim("role", role)
				.issuedAt(now)
				.expiration(expiry)
				.signWith(getSigningKey())
				.compact();
	}

	private Claims extractClaims(String token) {
		return Jwts.parser()
				.verifyWith(getSigningKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}

	private SecretKey getSigningKey() {
		return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	}
}

