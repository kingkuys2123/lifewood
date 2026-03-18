package com.lifewood.lifewood.service;

import com.lifewood.lifewood.dto.applicant.AddApplicantDTO;
import com.lifewood.lifewood.dto.applicant.ApplicantResponseDTO;
import com.lifewood.lifewood.dto.applicant.UpdateApplicantDTO;
import com.lifewood.lifewood.entity.Applicant;
import com.lifewood.lifewood.repository.ApplicantRepository;
import com.lifewood.lifewood.util.ApplicantSpecifications;
import com.lifewood.lifewood.util.FileUtil;
import com.lifewood.lifewood.util.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        Applicant applicant = Applicant.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .age(request.getAge())
                .email(request.getEmail())
                .degree(request.getDegree())
                .projectAppliedFor(request.getProjectAppliedFor())
                .experience(request.getExperience())
                .resumePath(resumePath)
                .build();

        Applicant savedApplicant = applicantRepository.save(applicant);
        emailService.sendApplicantSubmissionNotification(
                savedApplicant.getEmail(),
                savedApplicant.getFirstName() + " " + savedApplicant.getLastName(),
                savedApplicant.getProjectAppliedFor());

        log.info("Created applicant id={} email={}", savedApplicant.getId(), savedApplicant.getEmail());
        return mapToResponse(savedApplicant);
    }

    @Transactional(readOnly = true)
    public ApplicantResponseDTO getApplicant(Long id) {
        Applicant applicant = applicantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant not found with id: " + id));
        return mapToResponse(applicant);
    }

    @Transactional(readOnly = true)
    public Page<ApplicantResponseDTO> getAllApplicants(String keyword, Pageable pageable) {
        return applicantRepository.findAll(ApplicantSpecifications.withKeyword(keyword), pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    public ApplicantResponseDTO updateApplicant(Long id, UpdateApplicantDTO request) {
        Applicant applicant = applicantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant not found with id: " + id));

        applicant.setFirstName(request.getFirstName());
        applicant.setLastName(request.getLastName());
        applicant.setAge(request.getAge());
        applicant.setEmail(request.getEmail());
        applicant.setDegree(request.getDegree());
        applicant.setProjectAppliedFor(request.getProjectAppliedFor());
        applicant.setExperience(request.getExperience());

        if (request.getResume() != null && !request.getResume().isEmpty()) {
            applicant.setResumePath(fileUtil.storeResume(request.getResume()));
        }

        return mapToResponse(applicantRepository.save(applicant));
    }

    @Transactional
    public void deleteApplicant(Long id) {
        if (!applicantRepository.existsById(id)) {
            throw new ResourceNotFoundException("Applicant not found with id: " + id);
        }
        applicantRepository.deleteById(id);
    }

    private ApplicantResponseDTO mapToResponse(Applicant applicant) {
        return ApplicantResponseDTO.builder()
                .id(applicant.getId())
                .firstName(applicant.getFirstName())
                .lastName(applicant.getLastName())
                .age(applicant.getAge())
                .email(applicant.getEmail())
                .degree(applicant.getDegree())
                .projectAppliedFor(applicant.getProjectAppliedFor())
                .experience(applicant.getExperience())
                .resumePath(applicant.getResumePath())
                .createdAt(applicant.getCreatedAt())
                .updatedAt(applicant.getUpdatedAt())
                .build();
    }
}
