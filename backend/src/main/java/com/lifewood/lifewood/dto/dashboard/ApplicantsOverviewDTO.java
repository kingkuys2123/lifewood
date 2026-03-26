package com.lifewood.lifewood.dto.dashboard;

import lombok.Builder;

@Builder
public record ApplicantsOverviewDTO(
        long todayNewApplicants,
        long pendingApplications,
        long approvedApplications,
        long deniedApplications) {
}

