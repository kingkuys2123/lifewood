package com.lifewood.lifewood.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminGateUnlockRequestDTO {

    @NotBlank
    private String keyword;
}

