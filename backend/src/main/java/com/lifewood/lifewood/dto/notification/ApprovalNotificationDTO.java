package com.lifewood.lifewood.dto.notification;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApprovalNotificationDTO {

    @NotBlank
    @Email
    private String applicantEmail;

    @NotBlank
    @Size(max = 255)
    private String applicantName;

    @NotBlank
    @Size(max = 255)
    private String projectAppliedFor;

    @NotNull
    private Boolean approved;

    @Size(max = 500)
    private String adminMessage;
}

