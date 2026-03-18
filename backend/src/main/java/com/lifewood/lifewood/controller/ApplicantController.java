package com.lifewood.lifewood.controller;

import com.lifewood.lifewood.dto.ApiResponse;
import com.lifewood.lifewood.dto.applicant.AddApplicantDTO;
import com.lifewood.lifewood.dto.applicant.ApplicantResponseDTO;
import com.lifewood.lifewood.dto.applicant.UpdateApplicantDTO;
import com.lifewood.lifewood.service.ApplicantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/applicant")
@RequiredArgsConstructor
public class ApplicantController {

    private final ApplicantService applicantService;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ApplicantResponseDTO>> createApplicant(@Valid @ModelAttribute AddApplicantDTO request) {
        return ResponseEntity.ok(ApiResponse.success("Applicant created successfully", applicantService.createApplicant(request)));
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/get")
    public ResponseEntity<ApiResponse<ApplicantResponseDTO>> getApplicant(@RequestParam("id") Long id) {
        return ResponseEntity.ok(ApiResponse.success("Applicant fetched successfully", applicantService.getApplicant(id)));
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/get/all")
    public ResponseEntity<ApiResponse<Page<ApplicantResponseDTO>>> getAllApplicants(
            @RequestParam(value = "keyword", required = false) String keyword,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(
                ApiResponse.success("Applicants fetched successfully", applicantService.getAllApplicants(keyword, pageable)));
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ApplicantResponseDTO>> updateApplicant(
            @RequestParam("id") Long id,
            @Valid @ModelAttribute UpdateApplicantDTO request) {
        return ResponseEntity.ok(ApiResponse.success("Applicant updated successfully", applicantService.updateApplicant(id, request)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse<Object>> deleteApplicant(@RequestParam("id") Long id) {
        applicantService.deleteApplicant(id);
        return ResponseEntity.ok(ApiResponse.success("Applicant deleted successfully", null));
    }
}
