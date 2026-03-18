package com.lifewood.lifewood.dto.user;

import com.lifewood.lifewood.enumeration.UserRoleEnum;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponseDTO {
    private Long id;
    private String username;
    private String email;
    private String profilePicture;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private UserRoleEnum role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

