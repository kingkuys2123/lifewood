package com.lifewood.lifewood.dto.auth;

import lombok.Builder;

@Builder
public record AdminGateUnlockResponseDTO(
        String gateToken,
        String tokenType,
        long expiresInMs) {
}

