package com.lifewood.lifewood.dto.dashboard;

import lombok.Builder;

@Builder
public record SubmissionPointDTO(String label, long submissions, Double changePercent) {
}

