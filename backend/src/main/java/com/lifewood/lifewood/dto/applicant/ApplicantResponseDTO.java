package com.lifewood.lifewood.dto.applicant;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApplicantResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private Integer age;
    private String email;
    private String degree;
    private String projectAppliedFor;
    private String experience;
    private String resumePath;
    private boolean approved;
    private boolean reviewed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

