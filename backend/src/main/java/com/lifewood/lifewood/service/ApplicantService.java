package com.lifewood.lifewood.service;

import com.lifewood.lifewood.dto.applicant.AddApplicantDTO;
import com.lifewood.lifewood.dto.applicant.ApproveApplicantDTO;
import com.lifewood.lifewood.dto.applicant.ApplicantResponseDTO;
import com.lifewood.lifewood.dto.applicant.DenyApplicantDTO;
import com.lifewood.lifewood.dto.applicant.UpdateApplicantDTO;
import com.lifewood.lifewood.dto.notification.ApprovalNotificationDTO;
import com.lifewood.lifewood.entity.ApplicantEntity;
import com.lifewood.lifewood.entity.NotificationEntity;
import com.lifewood.lifewood.entity.UserEntity;
import com.lifewood.lifewood.enumeration.NotificationTypeEnum;
import com.lifewood.lifewood.enumeration.UserRoleEnum;
import com.lifewood.lifewood.repository.ApplicantRepository;
import com.lifewood.lifewood.repository.UserRepository;
import com.lifewood.lifewood.util.ApplicantSpecifications;
import com.lifewood.lifewood.util.BadRequestException;
import com.lifewood.lifewood.util.FileUtil;
import com.lifewood.lifewood.util.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicantService {

    public record ResumeFile(Resource resource, String fileName, String contentType) {
    }

    private final ApplicantRepository applicantRepository;
    private final FileUtil fileUtil;
    private final EmailService emailService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @Transactional
    public ApplicantResponseDTO createApplicant(AddApplicantDTO request) {
        ensureEmailAvailable(request.getEmail(), null);

        String resumePath = fileUtil.storeResume(request.getResume());
        ApplicantEntity applicantEntity = ApplicantEntity.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .age(request.getAge())
                .email(request.getEmail())
                .degree(request.getDegree())
                .projectAppliedFor(request.getProjectAppliedFor())
                .experience(request.getExperience())
                .resumePath(resumePath)
                .build();

        ApplicantEntity savedApplicantEntity = applicantRepository.save(applicantEntity);
        emailService.sendApplicantSubmissionNotification(
                savedApplicantEntity.getEmail(),
                savedApplicantEntity.getFirstName() + " " + savedApplicantEntity.getLastName(),
                savedApplicantEntity.getProjectAppliedFor());

        log.info("Created applicantEntity id={} email={}", savedApplicantEntity.getId(), savedApplicantEntity.getEmail());
        return mapToResponse(savedApplicantEntity);
    }

    @Transactional(readOnly = true)
    public ApplicantResponseDTO getApplicant(Long id) {
        ApplicantEntity applicantEntity = applicantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ApplicantEntity not found with id: " + id));
        return mapToResponse(applicantEntity);
    }

    @Transactional(readOnly = true)
    public ResumeFile getApplicantResume(Long id) {
        ApplicantEntity applicantEntity = applicantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ApplicantEntity not found with id: " + id));

        Resource resource = fileUtil.loadResumeResource(applicantEntity.getResumePath());
        String fileName = resource.getFilename() == null ? "resume" : resource.getFilename();
        String contentType = null;
        try {
            contentType = fileUtil.resolveContentType(resource.getFile().toPath());
        } catch (Exception ex) {
            log.debug("Unable to resolve resume content type for applicant id={}", id, ex);
        }
        return new ResumeFile(resource, fileName, contentType);
    }

    @Transactional(readOnly = true)
    public Page<ApplicantResponseDTO> getAllApplicants(String keyword, Boolean approved, Boolean reviewed, Pageable pageable) {
        Specification<ApplicantEntity> specification = Specification.where(ApplicantSpecifications.withKeyword(keyword))
                .and(ApplicantSpecifications.withApproved(approved))
                .and(ApplicantSpecifications.withReviewed(reviewed));
        return applicantRepository.findAll(specification, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<ApplicantResponseDTO> getPendingApplicants(Pageable pageable) {
        return applicantRepository.findAllByReviewedFalse(pageable).map(this::mapToResponse);
    }

    @Transactional
    public ApplicantResponseDTO updateApplicant(Long id, UpdateApplicantDTO request) {
        ApplicantEntity applicantEntity = applicantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ApplicantEntity not found with id: " + id));

        ensureEmailAvailable(request.getEmail(), id);

        applicantEntity.setFirstName(request.getFirstName());
        applicantEntity.setLastName(request.getLastName());
        applicantEntity.setAge(request.getAge());
        applicantEntity.setEmail(request.getEmail());
        applicantEntity.setDegree(request.getDegree());
        applicantEntity.setProjectAppliedFor(request.getProjectAppliedFor());
        applicantEntity.setExperience(request.getExperience());

        if (request.getResume() != null && !request.getResume().isEmpty()) {
            applicantEntity.setResumePath(fileUtil.storeResume(request.getResume()));
        }

        return mapToResponse(applicantRepository.save(applicantEntity));
    }

    @Transactional(readOnly = true)
    public boolean isEmailAvailable(String email, Long excludeApplicantId) {
        String normalizedEmail = normalizeEmail(email);
        if (normalizedEmail.isEmpty()) {
            return false;
        }

        if (excludeApplicantId != null) {
            return !applicantRepository.existsByEmailIgnoreCaseAndIdNot(normalizedEmail, excludeApplicantId);
        }

        return !applicantRepository.existsByEmailIgnoreCase(normalizedEmail);
    }

    @Transactional
    public void deleteApplicant(Long id) {
        if (!applicantRepository.existsById(id)) {
            throw new ResourceNotFoundException("ApplicantEntity not found with id: " + id);
        }
        applicantRepository.deleteById(id);
    }

    @Transactional
    public ApplicantResponseDTO approveApplicant(ApproveApplicantDTO request) {
        ApplicantEntity applicantEntity = getApplicantById(request.getApplicantId());
        ensurePending(applicantEntity);

        applicantEntity.setApproved(true);
        applicantEntity.setReviewed(true);
        ApplicantEntity savedApplicantEntity = applicantRepository.save(applicantEntity);

        ApprovalNotificationDTO decisionNotification = ApprovalNotificationDTO.builder()
                .applicantEmail(savedApplicantEntity.getEmail())
                .applicantName(savedApplicantEntity.getFirstName() + " " + savedApplicantEntity.getLastName())
                .projectAppliedFor(savedApplicantEntity.getProjectAppliedFor())
                .approved(true)
                .adminMessage(request.getMessage())
                .build();
        emailService.sendDecisionNotification(decisionNotification);
        createDecisionNotifications(savedApplicantEntity, true, request.getMessage());

        log.info("Approved applicant id={} email={}", savedApplicantEntity.getId(), savedApplicantEntity.getEmail());
        return mapToResponse(savedApplicantEntity);
    }

    @Transactional
    public ApplicantResponseDTO denyApplicant(DenyApplicantDTO request) {
        ApplicantEntity applicantEntity = getApplicantById(request.getApplicantId());
        ensurePending(applicantEntity);

        applicantEntity.setApproved(false);
        applicantEntity.setReviewed(true);
        ApplicantEntity savedApplicantEntity = applicantRepository.save(applicantEntity);

        ApprovalNotificationDTO decisionNotification = ApprovalNotificationDTO.builder()
                .applicantEmail(savedApplicantEntity.getEmail())
                .applicantName(savedApplicantEntity.getFirstName() + " " + savedApplicantEntity.getLastName())
                .projectAppliedFor(savedApplicantEntity.getProjectAppliedFor())
                .approved(false)
                .adminMessage(request.getMessage())
                .build();
        emailService.sendDecisionNotification(decisionNotification);
        createDecisionNotifications(savedApplicantEntity, false, request.getMessage());

        log.info("Denied applicant id={} email={}", savedApplicantEntity.getId(), savedApplicantEntity.getEmail());
        return mapToResponse(savedApplicantEntity);
    }

    private ApplicantEntity getApplicantById(Long id) {
        return applicantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ApplicantEntity not found with id: " + id));
    }

    private void ensurePending(ApplicantEntity applicantEntity) {
        if (applicantEntity.isReviewed()) {
            log.warn("Applicant already processed id={} approved={}", applicantEntity.getId(), applicantEntity.isApproved());
            throw new BadRequestException("Applicant has already been processed");
        }
    }

    private void ensureEmailAvailable(String email, Long excludeApplicantId) {
        if (!isEmailAvailable(email, excludeApplicantId)) {
            throw new BadRequestException("Email has already been used");
        }
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim();
    }

    private ApplicantResponseDTO mapToResponse(ApplicantEntity applicantEntity) {
        return ApplicantResponseDTO.builder()
                .id(applicantEntity.getId())
                .firstName(applicantEntity.getFirstName())
                .lastName(applicantEntity.getLastName())
                .age(applicantEntity.getAge())
                .email(applicantEntity.getEmail())
                .degree(applicantEntity.getDegree())
                .projectAppliedFor(applicantEntity.getProjectAppliedFor())
                .experience(applicantEntity.getExperience())
                .resumePath(applicantEntity.getResumePath())
                .approved(applicantEntity.isApproved())
                .reviewed(applicantEntity.isReviewed())
                .createdAt(applicantEntity.getCreatedAt())
                .updatedAt(applicantEntity.getUpdatedAt())
                .build();
    }

    private void createDecisionNotifications(ApplicantEntity applicantEntity, boolean approved, String customMessage) {
        try {
            NotificationTypeEnum type = approved ? NotificationTypeEnum.APPROVAL : NotificationTypeEnum.REJECTION;
            String decision = approved ? "approved" : "denied";
            String normalizedMessage = normalizeDecisionMessage(customMessage);

            Optional<UserEntity> applicantUserOptional = userRepository.findByEmail(applicantEntity.getEmail());
            applicantUserOptional.ifPresent(recipient -> {
                NotificationEntity applicantNotification = NotificationEntity.builder()
                        .title("Application " + (approved ? "Approved" : "Denied"))
                        .message("Your application for " + applicantEntity.getProjectAppliedFor() + " was " + decision
                                + ". " + normalizedMessage)
                        .type(type)
                        .recipient(recipient)
                        .isRead(false)
                        .build();
                notificationService.createNotificationInternal(applicantNotification);
            });

            if (applicantUserOptional.isEmpty()) {
                log.info("Skipping applicant in-app notification because no user account exists for email={}",
                        applicantEntity.getEmail());
            }

            List<UserEntity> admins = userRepository.findAllByRole(UserRoleEnum.ADMIN);
            for (UserEntity adminUser : admins) {
                NotificationEntity adminNotification = NotificationEntity.builder()
                        .title("Applicant " + (approved ? "Approved" : "Denied"))
                        .message("Applicant " + applicantEntity.getFirstName() + " " + applicantEntity.getLastName()
                                + " was " + decision + " for " + applicantEntity.getProjectAppliedFor() + ".")
                        .type(type)
                        .recipient(adminUser)
                        .isRead(false)
                        .build();
                notificationService.createNotificationInternal(adminNotification);
            }
        } catch (Exception ex) {
            log.error("Failed to create in-app decision notifications for applicant id={}", applicantEntity.getId(), ex);
        }
    }

    private String normalizeDecisionMessage(String customMessage) {
        String message = customMessage == null ? "" : customMessage.trim();
        return message.isEmpty() ? "" : "Message: " + message;
    }
}
