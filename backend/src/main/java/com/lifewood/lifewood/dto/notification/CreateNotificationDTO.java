package com.lifewood.lifewood.dto.notification;

import com.lifewood.lifewood.enumeration.NotificationTypeEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateNotificationDTO {

    @NotBlank
    @Size(min = 1, max = 255)
    private String title;

    @NotBlank
    @Size(min = 1, max = 5000)
    private String message;

    @NotNull
    private NotificationTypeEnum type;

    @NotNull
    private Long userId;
}
