package com.lifewood.lifewood.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.lifewood.lifewood.dto.notification.CreateNotificationDTO;
import com.lifewood.lifewood.dto.notification.MarkNotificationDTO;
import com.lifewood.lifewood.dto.notification.NotificationResponseDTO;
import com.lifewood.lifewood.entity.NotificationEntity;
import com.lifewood.lifewood.entity.UserEntity;
import com.lifewood.lifewood.enumeration.NotificationTypeEnum;
import com.lifewood.lifewood.enumeration.UserRoleEnum;
import com.lifewood.lifewood.repository.NotificationRepository;
import com.lifewood.lifewood.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private NotificationService notificationService;

    private UserEntity testUser;

    @BeforeEach
    void setUp() {
        testUser = UserEntity.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .role(UserRoleEnum.USER)
                .password("hashed")
                .build();
    }

    @Test
    void createNotification_successfully() {
        CreateNotificationDTO request = new CreateNotificationDTO();
        request.setTitle("Test Notification");
        request.setMessage("This is a test");
        request.setType(NotificationTypeEnum.SYSTEM_INFO);
        request.setUserId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(notificationRepository.save(any(NotificationEntity.class))).thenAnswer(invocation -> {
            NotificationEntity entity = invocation.getArgument(0);
            entity.setId(10L);
            return entity;
        });

        NotificationResponseDTO response = notificationService.createNotification(request);

        assertEquals("Test Notification", response.getTitle());
        assertEquals("This is a test", response.getMessage());
        assertEquals(NotificationTypeEnum.SYSTEM_INFO, response.getType());
        assertFalse(response.isRead());

        verify(messagingTemplate, times(1)).convertAndSendToUser(anyString(), anyString(), any());
    }

    @Test
    void markAsRead_successfully() {
        NotificationEntity notification = NotificationEntity.builder()
                .id(10L)
                .title("Test")
                .message("Test message")
                .type(NotificationTypeEnum.SYSTEM_INFO)
                .recipient(testUser)
                .isRead(false)
                .build();

        MarkNotificationDTO request = new MarkNotificationDTO();
        request.setNotificationId(10L);

        when(notificationRepository.findById(10L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(NotificationEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        NotificationResponseDTO response = notificationService.markAsRead(request);

        assertTrue(response.isRead());
        verify(notificationRepository, times(1)).save(notification);
    }

    @Test
    void getUnreadCount_returnsCorrectValue() {
        when(notificationRepository.countByRecipientIdAndIsReadFalse(1L)).thenReturn(5L);

        long count = notificationService.getUnreadCount(1L);

        assertEquals(5L, count);
        verify(notificationRepository, times(1)).countByRecipientIdAndIsReadFalse(1L);
    }
}
