package com.lifewood.lifewood.dto.dashboard;

import lombok.Builder;

@Builder
public record AdminPerformanceDTO(
        String adminUsername,
        long approvedCount,
        long deniedCount,
        long totalReviewed) {
}

