package com.lifewood.lifewood.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.lifewood.lifewood.dto.auth.ForgotPasswordRequestDTO;
import com.lifewood.lifewood.dto.auth.LoginRequestDTO;
import com.lifewood.lifewood.dto.auth.ResetPasswordRequestDTO;
import com.lifewood.lifewood.entity.PasswordResetTokenEntity;
import com.lifewood.lifewood.entity.UserEntity;
import com.lifewood.lifewood.enumeration.UserRoleEnum;
import com.lifewood.lifewood.filter.JwtUtil;
import com.lifewood.lifewood.repository.PasswordResetTokenRepository;
import com.lifewood.lifewood.repository.UserRepository;
import com.lifewood.lifewood.util.BadRequestException;
import com.lifewood.lifewood.util.UnauthorizedException;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private UserEntity user;

    @BeforeEach
    void setUp() {
        user = UserEntity.builder()
                .id(10L)
                .username("portal.user")
                .email("portal@example.com")
                .firstName("Portal")
                .lastName("User")
                .role(UserRoleEnum.ADMIN)
                .password("hashed-old")
                .build();

        ReflectionTestUtils.setField(authService, "resetTokenValidityMinutes", 30L);
        ReflectionTestUtils.setField(authService, "resetPasswordUrl", "http://localhost:5173/reset-password");
    }

    @Test
    void login_acceptsEmailIdentifier() {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setUsername("portal@example.com");
        request.setPassword("pass12345");

        when(userRepository.findByUsernameIgnoreCase("portal@example.com")).thenReturn(Optional.empty());
        when(userRepository.findByEmailIgnoreCase("portal@example.com")).thenReturn(Optional.of(user));
        when(jwtUtil.generateAccessToken("portal.user", "ADMIN")).thenReturn("access-token");
        when(jwtUtil.generateRefreshToken("portal.user", "ADMIN")).thenReturn("refresh-token");
        when(jwtUtil.getAccessTokenValidityMs()).thenReturn(3600000L);

        var response = authService.login(request);

        assertEquals("access-token", response.getAccessToken());
        assertEquals("refresh-token", response.getRefreshToken());
    }

    @Test
    void requestPasswordReset_isSilentWhenEmailDoesNotExist() {
        ForgotPasswordRequestDTO request = new ForgotPasswordRequestDTO();
        request.setEmail("missing@example.com");
        when(userRepository.findByEmailIgnoreCase("missing@example.com")).thenReturn(Optional.empty());

        authService.requestPasswordReset(request);

        verify(emailService, never()).sendPasswordResetEmail(any(), any(), any());
    }

    @Test
    void resetPassword_rejectsExpiredToken() {
        ResetPasswordRequestDTO request = new ResetPasswordRequestDTO();
        request.setToken("raw-token");
        request.setNewPassword("newpass123");

        PasswordResetTokenEntity token = PasswordResetTokenEntity.builder()
                .user(user)
                .tokenHash("ignored")
                .expiresAt(LocalDateTime.now().minusMinutes(1))
                .build();

        when(passwordResetTokenRepository.findByTokenHash(any())).thenReturn(Optional.of(token));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> authService.resetPassword(request));

        assertEquals("Invalid or expired reset token", ex.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_throwsForInvalidCredentials() {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setUsername("portal@example.com");
        request.setPassword("wrong");

        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        var ex = assertThrows(UnauthorizedException.class, () -> authService.login(request));
        assertEquals("Wrong Username/Password", ex.getMessage());
    }
}


