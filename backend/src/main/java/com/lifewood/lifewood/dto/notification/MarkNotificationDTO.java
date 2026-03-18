package com.lifewood.lifewood.dto.notification;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MarkNotificationDTO {

    @NotNull
    private Long notificationId;
}
