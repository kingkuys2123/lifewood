package com.lifewood.lifewood.dto.applicant;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApproveApplicantDTO {

    @NotNull
    private Long applicantId;

    @Size(max = 500)
    private String message;
}

