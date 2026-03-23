package com.lifewood.lifewood.controller;

import com.lifewood.lifewood.dto.ApiResponse;
import com.lifewood.lifewood.dto.applicant.AddApplicantDTO;
import com.lifewood.lifewood.dto.applicant.ApproveApplicantDTO;
import com.lifewood.lifewood.dto.applicant.ApplicantResponseDTO;
import com.lifewood.lifewood.dto.applicant.DenyApplicantDTO;
import com.lifewood.lifewood.dto.applicant.UpdateApplicantDTO;
import com.lifewood.lifewood.service.ApplicantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/applicant")
@RequiredArgsConstructor
public class ApplicantController {

    private final ApplicantService applicantService;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ApplicantResponseDTO>> createApplicant(@Valid @ModelAttribute AddApplicantDTO request) {
        return ResponseEntity.ok(ApiResponse.success("ApplicantEntity created successfully", applicantService.createApplicant(request)));
    }

    @GetMapping("/check-email")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkEmailAvailability(
            @RequestParam("email") String email,
            @RequestParam(value = "excludeId", required = false) Long excludeId) {
        boolean available = applicantService.isEmailAvailable(email, excludeId);
        return ResponseEntity.ok(ApiResponse.success("Applicant email availability fetched",
                Map.of("available", available)));
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/get")
    public ResponseEntity<ApiResponse<ApplicantResponseDTO>> getApplicant(@RequestParam("id") Long id) {
        return ResponseEntity.ok(ApiResponse.success("ApplicantEntity fetched successfully", applicantService.getApplicant(id)));
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/resume")
    public ResponseEntity<?> getApplicantResume(
            @RequestParam("id") Long id,
            @RequestParam(value = "download", defaultValue = "false") boolean download) {
        ApplicantService.ResumeFile resumeFile = applicantService.getApplicantResume(id);
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        if (resumeFile.contentType() != null && !resumeFile.contentType().isBlank()) {
            mediaType = MediaType.parseMediaType(resumeFile.contentType());
        }

        String disposition = (download ? "attachment" : "inline") + "; filename=\"" + resumeFile.fileName() + "\"";
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition)
                .body(resumeFile.resource());
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/get/all")
    public ResponseEntity<ApiResponse<Page<ApplicantResponseDTO>>> getAllApplicants(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "approved", required = false) Boolean approved,
            @RequestParam(value = "reviewed", required = false) Boolean reviewed,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(
                ApiResponse.success("Applicants fetched successfully", applicantService.getAllApplicants(keyword, approved, reviewed, pageable)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/get/pending")
    public ResponseEntity<ApiResponse<Page<ApplicantResponseDTO>>> getPendingApplicants(
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Pending applicants fetched successfully", applicantService.getPendingApplicants(pageable)));
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ApplicantResponseDTO>> updateApplicant(
            @RequestParam("id") Long id,
            @Valid @ModelAttribute UpdateApplicantDTO request) {
        return ResponseEntity.ok(ApiResponse.success("ApplicantEntity updated successfully", applicantService.updateApplicant(id, request)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse<Object>> deleteApplicant(@RequestParam("id") Long id) {
        applicantService.deleteApplicant(id);
        return ResponseEntity.ok(ApiResponse.success("ApplicantEntity deleted successfully", null));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/approve")
    public ResponseEntity<ApiResponse<ApplicantResponseDTO>> approveApplicant(@Valid @RequestBody ApproveApplicantDTO request) {
        return ResponseEntity.ok(ApiResponse.success("Applicant approved successfully", applicantService.approveApplicant(request)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/deny")
    public ResponseEntity<ApiResponse<ApplicantResponseDTO>> denyApplicant(@Valid @RequestBody DenyApplicantDTO request) {
        return ResponseEntity.ok(ApiResponse.success("Applicant denied successfully", applicantService.denyApplicant(request)));
    }
}
