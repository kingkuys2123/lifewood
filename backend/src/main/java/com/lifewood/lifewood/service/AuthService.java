package com.lifewood.lifewood.service;

import com.lifewood.lifewood.dto.auth.AuthResponseDTO;
import com.lifewood.lifewood.dto.auth.LoginRequestDTO;
import com.lifewood.lifewood.dto.auth.RefreshTokenRequestDTO;
import com.lifewood.lifewood.entity.UserEntity;
import com.lifewood.lifewood.filter.JwtUtil;
import com.lifewood.lifewood.repository.UserRepository;
import com.lifewood.lifewood.util.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthResponseDTO login(LoginRequestDTO request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        } catch (AuthenticationException ex) {
            throw new UnauthorizedException("Wrong Username/Password");
        }

        UserEntity userEntity = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Wrong Username/Password"));

        String accessToken = jwtUtil.generateAccessToken(userEntity.getUsername(), userEntity.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(userEntity.getUsername(), userEntity.getRole().name());
        log.info("UserEntity authenticated: {}", userEntity.getUsername());

        return AuthResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getAccessTokenValidityMs())
                .build();
    }

    public AuthResponseDTO refresh(RefreshTokenRequestDTO request) {
        if (!jwtUtil.isTokenValid(request.getRefreshToken())) {
            throw new UnauthorizedException("Invalid refresh token");
        }
        String username = jwtUtil.extractUsername(request.getRefreshToken());
        UserEntity userEntity = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        String accessToken = jwtUtil.generateAccessToken(userEntity.getUsername(), userEntity.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(userEntity.getUsername(), userEntity.getRole().name());

        return AuthResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getAccessTokenValidityMs())
                .build();
    }
}

