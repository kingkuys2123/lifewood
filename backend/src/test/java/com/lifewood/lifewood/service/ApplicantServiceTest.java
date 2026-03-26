package com.lifewood.lifewood.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.lifewood.lifewood.dto.applicant.ApproveApplicantDTO;
import com.lifewood.lifewood.dto.applicant.ApplicantResponseDTO;
import com.lifewood.lifewood.dto.applicant.DenyApplicantDTO;
import com.lifewood.lifewood.dto.notification.ApprovalNotificationDTO;
import com.lifewood.lifewood.entity.ApplicantEntity;
import com.lifewood.lifewood.repository.ApplicantRepository;
import com.lifewood.lifewood.repository.UserRepository;
import com.lifewood.lifewood.util.BadRequestException;
import com.lifewood.lifewood.util.FileUtil;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ApplicantServiceTest {

    @Mock
    private ApplicantRepository applicantRepository;

    @Mock
    private FileUtil fileUtil;

    @Mock
    private EmailService emailService;

    @Mock
    private NotificationService notificationService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ApplicantService applicantService;

    private ApplicantEntity pendingApplicant;

    @BeforeEach
    void setUp() {
        pendingApplicant = ApplicantEntity.builder()
                .id(10L)
                .firstName("Jane")
                .lastName("Doe")
                .age(25)
                .email("jane@example.com")
                .degree("BS Computer Science")
                .projectAppliedFor("Backend")
                .experience("2 years")
                .resumePath("uploads/resume.pdf")
                .approved(false)
                .reviewed(false)
                .build();
    }

    @Test
    void approveApplicant_marksAsApprovedAndReviewed() {
        ApproveApplicantDTO request = new ApproveApplicantDTO();
        request.setApplicantId(10L);
        request.setMessage("Welcome aboard");

        when(applicantRepository.findById(10L)).thenReturn(Optional.of(pendingApplicant));
        when(applicantRepository.save(any(ApplicantEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.empty());
        when(userRepository.findAllByRole(any())).thenReturn(List.of());

        ApplicantResponseDTO response = applicantService.approveApplicant(request, "admin.ops");

        assertTrue(response.isApproved());
        assertTrue(response.isReviewed());

        ArgumentCaptor<ApplicantEntity> applicantCaptor = ArgumentCaptor.forClass(ApplicantEntity.class);
        verify(applicantRepository, times(1)).save(applicantCaptor.capture());
        assertTrue(applicantCaptor.getValue().isApproved());
        assertTrue(applicantCaptor.getValue().isReviewed());
        assertEquals("admin.ops", applicantCaptor.getValue().getReviewedBy());

        ArgumentCaptor<ApprovalNotificationDTO> notificationCaptor = ArgumentCaptor.forClass(ApprovalNotificationDTO.class);
        verify(emailService, times(1)).sendDecisionNotification(notificationCaptor.capture());
        assertTrue(notificationCaptor.getValue().getApproved());
        assertEquals("jane@example.com", notificationCaptor.getValue().getApplicantEmail());
    }

    @Test
    void denyApplicant_marksAsReviewedAndNotApproved() {
        DenyApplicantDTO request = new DenyApplicantDTO();
        request.setApplicantId(10L);
        request.setMessage("We are moving with other candidates");

        when(applicantRepository.findById(10L)).thenReturn(Optional.of(pendingApplicant));
        when(applicantRepository.save(any(ApplicantEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.empty());
        when(userRepository.findAllByRole(any())).thenReturn(List.of());

        ApplicantResponseDTO response = applicantService.denyApplicant(request, "admin.ops");

        assertFalse(response.isApproved());
        assertTrue(response.isReviewed());

        ArgumentCaptor<ApprovalNotificationDTO> notificationCaptor = ArgumentCaptor.forClass(ApprovalNotificationDTO.class);
        verify(emailService, times(1)).sendDecisionNotification(notificationCaptor.capture());
        assertFalse(notificationCaptor.getValue().getApproved());
        assertEquals("jane@example.com", notificationCaptor.getValue().getApplicantEmail());
    }

    @Test
    void approveApplicant_throwsWhenAlreadyProcessed() {
        ApproveApplicantDTO request = new ApproveApplicantDTO();
        request.setApplicantId(10L);

        pendingApplicant.setReviewed(true);
        pendingApplicant.setApproved(true);
        when(applicantRepository.findById(10L)).thenReturn(Optional.of(pendingApplicant));

        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> applicantService.approveApplicant(request, "admin.ops"));

        assertEquals("Applicant has already been processed", exception.getMessage());
    }
}

