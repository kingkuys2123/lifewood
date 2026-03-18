package com.lifewood.lifewood.dto.applicant;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class UpdateApplicantDTO {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotNull
    @Min(16)
    @Max(100)
    private Integer age;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String degree;

    @NotBlank
    private String projectAppliedFor;

    private String experience;

    private MultipartFile resume;
}

