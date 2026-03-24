package com.lifewood.lifewood.config;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class RailwayCompatiblePasswordEncoder implements PasswordEncoder {

    private static final String PREFIX = "{b64bcrypt}";
    private final BCryptPasswordEncoder delegate = new BCryptPasswordEncoder();

    @Override
    public String encode(CharSequence rawPassword) {
        String bcrypt = delegate.encode(rawPassword);
        String encoded = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(bcrypt.getBytes(StandardCharsets.UTF_8));
        return PREFIX + encoded;
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        if (encodedPassword == null || encodedPassword.isBlank()) {
            return false;
        }

        if (encodedPassword.startsWith(PREFIX)) {
            String payload = encodedPassword.substring(PREFIX.length());
            try {
                byte[] decoded = Base64.getUrlDecoder().decode(payload);
                String bcrypt = new String(decoded, StandardCharsets.UTF_8);
                return delegate.matches(rawPassword, bcrypt);
            } catch (IllegalArgumentException ex) {
                return false;
            }
        }

        // Backward compatibility for existing BCrypt values in DB.
        return delegate.matches(rawPassword, encodedPassword);
    }
}

