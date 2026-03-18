package com.lifewood.lifewood.dto.user;

import com.lifewood.lifewood.enumeration.UserRoleEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserDTO {

    @NotBlank
    @Email
    private String email;

    private String profilePicture;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private String phoneNumber;

    @NotNull
    private UserRoleEnum role;
}

