package com.lifewood.lifewood.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lifewood.lifewood.dto.auth.AuthResponseDTO;
import com.lifewood.lifewood.dto.auth.RefreshTokenRequestDTO;
import com.lifewood.lifewood.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    void refresh_returnsRotatedTokens() throws Exception {
        RefreshTokenRequestDTO request = new RefreshTokenRequestDTO();
        request.setRefreshToken("refresh-token");

        AuthResponseDTO response = AuthResponseDTO.builder()
                .accessToken("new-access")
                .refreshToken("new-refresh")
                .tokenType("Bearer")
                .expiresIn(3600000L)
                .build();

        when(authService.refresh(any(RefreshTokenRequestDTO.class))).thenReturn(response);

        mockMvc.perform(post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(true))
                .andExpect(jsonPath("$.message").value("Token refreshed"))
                .andExpect(jsonPath("$.data.accessToken").value("new-access"))
                .andExpect(jsonPath("$.data.refreshToken").value("new-refresh"));
    }

    @Test
    void logout_revokesRefreshTokenAndReturnsSuccess() throws Exception {
        RefreshTokenRequestDTO request = new RefreshTokenRequestDTO();
        request.setRefreshToken("refresh-token");

        doNothing().when(authService).logout(any(RefreshTokenRequestDTO.class));

        mockMvc.perform(post("/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(true))
                .andExpect(jsonPath("$.message").value("Logged out successfully"));
    }

    @Test
    void validateResetToken_returnsValidationResult() throws Exception {
        when(authService.isResetTokenValid(eq("token-abc"))).thenReturn(true);

        mockMvc.perform(post("/auth/reset-password/validate")
                        .param("token", "token-abc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(true))
                .andExpect(jsonPath("$.message").value("Token validation result"))
                .andExpect(jsonPath("$.data").value(true));
    }
}
