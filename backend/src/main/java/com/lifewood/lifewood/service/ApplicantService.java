package com.lifewood.lifewood.service;

import com.lifewood.lifewood.dto.applicant.AddApplicantDTO;
import com.lifewood.lifewood.dto.applicant.ApproveApplicantDTO;
import com.lifewood.lifewood.dto.applicant.ApplicantResponseDTO;
import com.lifewood.lifewood.dto.applicant.DenyApplicantDTO;
import com.lifewood.lifewood.dto.applicant.UpdateApplicantDTO;
import com.lifewood.lifewood.entity.ApplicantEntity;
import com.lifewood.lifewood.repository.ApplicantRepository;
import com.lifewood.lifewood.util.ApplicantSpecifications;
import com.lifewood.lifewood.util.BadRequestException;
import com.lifewood.lifewood.util.FileUtil;
import com.lifewood.lifewood.util.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicantService {

    private final ApplicantRepository applicantRepository;
    private final FileUtil fileUtil;
    private final EmailService emailService;

    @Transactional
    public ApplicantResponseDTO createApplicant(AddApplicantDTO request) {
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

        emailService.sendApplicantDecisionNotification(
                savedApplicantEntity.getEmail(),
                savedApplicantEntity.getFirstName() + " " + savedApplicantEntity.getLastName(),
                savedApplicantEntity.getProjectAppliedFor(),
                true,
                request.getMessage());

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

        emailService.sendApplicantDecisionNotification(
                savedApplicantEntity.getEmail(),
                savedApplicantEntity.getFirstName() + " " + savedApplicantEntity.getLastName(),
                savedApplicantEntity.getProjectAppliedFor(),
                false,
                request.getMessage());

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
}
