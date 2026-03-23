package com.lifewood.lifewood.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetUserPasswordDTO {

    @NotBlank
    @Size(min = 8, max = 72)
    private String newPassword;
}

