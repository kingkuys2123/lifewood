package com.lifewood.lifewood.controller;

import com.lifewood.lifewood.dto.ApiResponse;
import com.lifewood.lifewood.dto.applicant.ContactMessageDTO;
import com.lifewood.lifewood.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/contact")
@RequiredArgsConstructor
public class ContactController {

    private final EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<Object>> sendMessage(@Valid @RequestBody ContactMessageDTO request) {
        emailService.sendContactFormMessage(request);
        return ResponseEntity.ok(ApiResponse.success("Message sent successfully", null));
    }
}
