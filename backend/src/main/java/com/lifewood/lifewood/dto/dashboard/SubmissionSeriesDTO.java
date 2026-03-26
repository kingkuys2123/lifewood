package com.lifewood.lifewood.dto.dashboard;

import java.util.List;
import lombok.Builder;

@Builder
public record SubmissionSeriesDTO(
        String from,
        String to,
        long totalSubmissions,
        List<SubmissionPointDTO> points) {
}

