package com.lifewood.lifewood.dto.notification;

import com.lifewood.lifewood.enumeration.NotificationTypeEnum;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NotificationResponseDTO {
    private Long id;
    private String title;
    private String message;
    private NotificationTypeEnum type;
    private Long userId;
    private String userName;
    private boolean isRead;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
