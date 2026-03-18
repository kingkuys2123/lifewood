package com.lifewood.lifewood.service;

import com.lifewood.lifewood.dto.notification.CreateNotificationDTO;
import com.lifewood.lifewood.dto.notification.MarkNotificationDTO;
import com.lifewood.lifewood.dto.notification.NotificationResponseDTO;
import com.lifewood.lifewood.entity.NotificationEntity;
import com.lifewood.lifewood.entity.UserEntity;
import com.lifewood.lifewood.enumeration.NotificationTypeEnum;
import com.lifewood.lifewood.repository.NotificationRepository;
import com.lifewood.lifewood.repository.UserRepository;
import com.lifewood.lifewood.util.NotificationSpecifications;
import com.lifewood.lifewood.util.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public NotificationResponseDTO createNotification(CreateNotificationDTO request) {
        UserEntity recipient = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        NotificationEntity notificationEntity = NotificationEntity.builder()
                .title(request.getTitle())
                .message(request.getMessage())
                .type(request.getType())
                .recipient(recipient)
                .isRead(false)
                .build();

        NotificationEntity savedNotification = notificationRepository.save(notificationEntity);
        sendWebSocketNotification(savedNotification);

        log.info("Created notification id={} for user id={} type={}", 
                savedNotification.getId(), recipient.getId(), request.getType());
        return mapToResponse(savedNotification);
    }

    @Transactional
    public void createNotificationInternal(NotificationEntity notificationEntity) {
        NotificationEntity savedNotification = notificationRepository.save(notificationEntity);
        sendWebSocketNotification(savedNotification);
        log.info("Created internal notification id={} for user id={} type={}", 
                savedNotification.getId(), notificationEntity.getRecipient().getId(), notificationEntity.getType());
    }

    @Transactional(readOnly = true)
    public NotificationResponseDTO getNotification(Long id) {
        NotificationEntity notificationEntity = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        return mapToResponse(notificationEntity);
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponseDTO> getAllNotifications(
            Long userId,
            NotificationTypeEnum type,
            Boolean isRead,
            String keyword,
            Pageable pageable) {
        Specification<NotificationEntity> specification = Specification.where(NotificationSpecifications.byUserId(userId))
                .and(NotificationSpecifications.byType(type))
                .and(NotificationSpecifications.byIsRead(isRead))
                .and(NotificationSpecifications.byKeyword(keyword));

        return notificationRepository.findAll(specification, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponseDTO> getUnreadNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByRecipientIdAndIsReadFalse(userId, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    @Transactional
    public NotificationResponseDTO markAsRead(MarkNotificationDTO request) {
        NotificationEntity notificationEntity = notificationRepository.findById(request.getNotificationId())
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + request.getNotificationId()));

        if (notificationEntity.isRead()) {
            log.warn("Notification already marked as read id={}", notificationEntity.getId());
        }

        notificationEntity.setRead(true);
        NotificationEntity updatedNotification = notificationRepository.save(notificationEntity);

        log.info("Marked notification as read id={} user id={}", 
                updatedNotification.getId(), updatedNotification.getRecipient().getId());
        return mapToResponse(updatedNotification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        Page<NotificationEntity> unreadNotifications = notificationRepository.findByRecipientIdAndIsReadFalse(userId, Pageable.unpaged());
        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });

        log.info("Marked all notifications as read for user id={}", userId);
    }

    @Transactional
    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Notification not found with id: " + id);
        }
        notificationRepository.deleteById(id);
        log.info("Deleted notification id={}", id);
    }

    private void sendWebSocketNotification(NotificationEntity notification) {
        try {
            NotificationResponseDTO notificationDTO = mapToResponse(notification);
            messagingTemplate.convertAndSendToUser(
                    notification.getRecipient().getId().toString(),
                    "/queue/notifications",
                    notificationDTO);
            log.debug("Sent WebSocket notification to user id={}", notification.getRecipient().getId());
        } catch (Exception ex) {
            log.error("Failed to send WebSocket notification id={}", notification.getId(), ex);
        }
    }

    private NotificationResponseDTO mapToResponse(NotificationEntity notificationEntity) {
        return NotificationResponseDTO.builder()
                .id(notificationEntity.getId())
                .title(notificationEntity.getTitle())
                .message(notificationEntity.getMessage())
                .type(notificationEntity.getType())
                .userId(notificationEntity.getRecipient().getId())
                .userName(notificationEntity.getRecipient().getUsername())
                .isRead(notificationEntity.isRead())
                .createdAt(notificationEntity.getCreatedAt())
                .updatedAt(notificationEntity.getUpdatedAt())
                .build();
    }
}
