package com.lifewood.lifewood.controller;

import com.lifewood.lifewood.dto.ApiResponse;
import com.lifewood.lifewood.dto.notification.CreateNotificationDTO;
import com.lifewood.lifewood.dto.notification.MarkNotificationDTO;
import com.lifewood.lifewood.dto.notification.NotificationResponseDTO;
import com.lifewood.lifewood.enumeration.NotificationTypeEnum;
import com.lifewood.lifewood.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<NotificationResponseDTO>> createNotification(@Valid @RequestBody CreateNotificationDTO request) {
        return ResponseEntity.ok(ApiResponse.success("Notification created successfully", notificationService.createNotification(request)));
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/get")
    public ResponseEntity<ApiResponse<NotificationResponseDTO>> getNotification(@RequestParam("id") Long id) {
        return ResponseEntity.ok(ApiResponse.success("Notification fetched successfully", notificationService.getNotification(id)));
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/get/all")
    public ResponseEntity<ApiResponse<Page<NotificationResponseDTO>>> getAllNotifications(
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam(value = "type", required = false) NotificationTypeEnum type,
            @RequestParam(value = "isRead", required = false) Boolean isRead,
            @RequestParam(value = "keyword", required = false) String keyword,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched successfully",
                notificationService.getAllNotifications(userId, type, isRead, keyword, pageable)));
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/get/unread")
    public ResponseEntity<ApiResponse<Page<NotificationResponseDTO>>> getUnreadNotifications(
            @RequestParam("userId") Long userId,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Unread notifications fetched successfully",
                notificationService.getUnreadNotifications(userId, pageable)));
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/get/unread/count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@RequestParam("userId") Long userId) {
        return ResponseEntity.ok(ApiResponse.success("Unread count fetched successfully",
                notificationService.getUnreadCount(userId)));
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @PatchMapping("/mark/read")
    public ResponseEntity<ApiResponse<NotificationResponseDTO>> markAsRead(@Valid @RequestBody MarkNotificationDTO request) {
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", notificationService.markAsRead(request)));
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @PatchMapping("/mark/all/read")
    public ResponseEntity<ApiResponse<Object>> markAllAsRead(@RequestParam("userId") Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse<Object>> deleteNotification(@RequestParam("id") Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(ApiResponse.success("Notification deleted successfully", null));
    }
}
