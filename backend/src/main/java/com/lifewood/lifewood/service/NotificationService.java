package com.lifewood.lifewood.service;

import com.lifewood.lifewood.dto.notification.CreateNotificationDTO;
import com.lifewood.lifewood.dto.notification.MarkNotificationDTO;
import com.lifewood.lifewood.dto.notification.NotificationResponseDTO;
import com.lifewood.lifewood.entity.NotificationEntity;
import com.lifewood.lifewood.entity.UserEntity;
import com.lifewood.lifewood.enumeration.NotificationTypeEnum;
import com.lifewood.lifewood.enumeration.UserRoleEnum;
import com.lifewood.lifewood.repository.NotificationRepository;
import com.lifewood.lifewood.repository.UserRepository;
import com.lifewood.lifewood.util.NotificationSpecifications;
import com.lifewood.lifewood.util.ResourceNotFoundException;
import com.lifewood.lifewood.util.UnauthorizedException;
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
    public NotificationResponseDTO getNotification(Long id, String username) {
        UserEntity currentUser = getCurrentUser(username);
        NotificationEntity notificationEntity = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));

        if (!canAccessNotification(currentUser, notificationEntity)) {
            throw new UnauthorizedException("You are not allowed to access this notification");
        }

        return mapToResponse(notificationEntity);
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponseDTO> getAllNotifications(
            String username,
            Long userId,
            NotificationTypeEnum type,
            Boolean isRead,
            String keyword,
            Pageable pageable) {
        UserEntity currentUser = getCurrentUser(username);
        Long targetUserId = resolveTargetUserId(currentUser, userId);

        Specification<NotificationEntity> specification = Specification.where(NotificationSpecifications.byUserId(targetUserId))
                .and(NotificationSpecifications.byType(type))
                .and(NotificationSpecifications.byIsRead(isRead))
                .and(NotificationSpecifications.byKeyword(keyword));

        return notificationRepository.findAll(specification, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponseDTO> getUnreadNotifications(String username, Long userId, Pageable pageable) {
        UserEntity currentUser = getCurrentUser(username);
        Long targetUserId = resolveTargetUserId(currentUser, userId);
        return notificationRepository.findByRecipientIdAndIsReadFalse(targetUserId, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(String username, Long userId) {
        UserEntity currentUser = getCurrentUser(username);
        Long targetUserId = resolveTargetUserId(currentUser, userId);
        return notificationRepository.countByRecipientIdAndIsReadFalse(targetUserId);
    }

    @Transactional
    public NotificationResponseDTO markAsRead(MarkNotificationDTO request, String username) {
        UserEntity currentUser = getCurrentUser(username);
        NotificationEntity notificationEntity = notificationRepository.findById(request.getNotificationId())
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + request.getNotificationId()));

        if (!canAccessNotification(currentUser, notificationEntity)) {
            throw new UnauthorizedException("You are not allowed to update this notification");
        }

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
    public NotificationResponseDTO markAsUnread(MarkNotificationDTO request, String username) {
        UserEntity currentUser = getCurrentUser(username);
        NotificationEntity notificationEntity = notificationRepository.findById(request.getNotificationId())
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + request.getNotificationId()));

        if (!canAccessNotification(currentUser, notificationEntity)) {
            throw new UnauthorizedException("You are not allowed to update this notification");
        }

        if (!notificationEntity.isRead()) {
            log.warn("Notification already marked as unread id={}", notificationEntity.getId());
        }

        notificationEntity.setRead(false);
        NotificationEntity updatedNotification = notificationRepository.save(notificationEntity);

        log.info("Marked notification as unread id={} user id={}",
                updatedNotification.getId(), updatedNotification.getRecipient().getId());
        return mapToResponse(updatedNotification);
    }

    @Transactional
    public void markAllAsRead(String username, Long userId) {
        UserEntity currentUser = getCurrentUser(username);
        Long targetUserId = resolveTargetUserId(currentUser, userId);
        int updated = notificationRepository.markAllAsReadByRecipientId(targetUserId);
        log.info("Marked all notifications as read for user id={} updatedCount={}", targetUserId, updated);
    }

    @Transactional
    public void deleteNotification(Long id, String username) {
        UserEntity currentUser = getCurrentUser(username);

        if (!notificationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Notification not found with id: " + id);
        }

        if (!isAdmin(currentUser) && !notificationRepository.existsByIdAndRecipientId(id, currentUser.getId())) {
            throw new UnauthorizedException("You are not allowed to delete this notification");
        }

        notificationRepository.deleteById(id);
        log.info("Deleted notification id={}", id);
    }

    private void sendWebSocketNotification(NotificationEntity notification) {
        try {
            NotificationResponseDTO notificationDTO = mapToResponse(notification);
            messagingTemplate.convertAndSendToUser(
                    notification.getRecipient().getUsername(),
                    "/queue/notifications",
                    notificationDTO);
            log.debug("Sent WebSocket notification to user={} id={}",
                    notification.getRecipient().getUsername(),
                    notification.getRecipient().getId());
        } catch (Exception ex) {
            log.error("Failed to send WebSocket notification id={}", notification.getId(), ex);
        }
    }

    private UserEntity getCurrentUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));
    }

    private Long resolveTargetUserId(UserEntity currentUser, Long requestedUserId) {
        if (requestedUserId == null) {
            return currentUser.getId();
        }

        if (isAdmin(currentUser)) {
            return requestedUserId;
        }

        if (!requestedUserId.equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not allowed to access notifications for another user");
        }
        return requestedUserId;
    }

    private boolean canAccessNotification(UserEntity currentUser, NotificationEntity notificationEntity) {
        return isAdmin(currentUser) || notificationEntity.getRecipient().getId().equals(currentUser.getId());
    }

    private boolean isAdmin(UserEntity currentUser) {
        return currentUser.getRole() == UserRoleEnum.ADMIN;
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
