package com.lifewood.lifewood.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lifewood.lifewood.dto.applicant.ContactMessageDTO;
import com.lifewood.lifewood.dto.email.EmailPayloadDTO;
import com.lifewood.lifewood.dto.notification.ApprovalNotificationDTO;
import jakarta.annotation.PostConstruct;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * Email Service using EmailJS HTTP API with Universal Template System
 * 
 * This service transforms all email types (password reset, applicant notifications, contact messages)
 * into a unified EmailPayloadDTO structure and sends them via EmailJS HTTP API.
 * 
 * All HTML composition, template rendering, and email logic stays in the backend (Java).
 * The universal EmailJS template receives dynamic variables via the payload structure.
 * 
 * Key design:
 * - Backend is the source of truth for all email content and branding
 * - Each public sendXxxEmail() method builds an EmailPayloadDTO with structured data
 * - Payloads are passed to deliverViaEmailJs() which handles HTTP API communication
 * - EmailJS template dynamically renders the email based on payload variables
 * - No SMTP setup needed; relies on HTTPS, compatible with Railway Free/Trial
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final RestTemplate emailRestTemplate;
    private final ObjectMapper objectMapper;

    @Value("${app.mail.emailjs.api-key:}")
    private String emailJsApiKey;

    @Value("${app.mail.emailjs.service-id:}")
    private String emailJsServiceId;

    @Value("${app.mail.emailjs.template-id:}")
    private String emailJsTemplateId;

    @Value("${app.mail.emailjs.api-url:https://api.emailjs.com/api/v1.0/email/send}")
    private String emailJsApiUrl;

    @Value("${app.mail.notification-to:}")
    private String notificationTo;

    @Value("${app.mail.brand.name:Lifewood}")
    private String brandName;

    @Value("${app.mail.brand.website:https://www.lifewood.com}")
    private String brandWebsite;

    @Value("${app.mail.retry.max-attempts:3}")
    private int maxRetryAttempts;

    @Value("${app.mail.retry.initial-delay-ms:800}")
    private long initialRetryDelayMs;

    @PostConstruct
    void logMailConfigurationStatus() {
        boolean hasApiKey = emailJsApiKey != null && !emailJsApiKey.isBlank();
        boolean hasServiceId = emailJsServiceId != null && !emailJsServiceId.isBlank();
        boolean hasTemplateId = emailJsTemplateId != null && !emailJsTemplateId.isBlank();

        log.info("Mail configuration loaded provider=emailjs apiKeyConfigured={} serviceIdConfigured={} templateIdConfigured={} asyncMode=true",
                hasApiKey, hasServiceId, hasTemplateId);

        if (!hasApiKey || !hasServiceId || !hasTemplateId) {
            log.warn("EmailJS configuration is incomplete. Email sending will fail until all env vars are set: APP_MAIL_EMAILJS_API_KEY, APP_MAIL_EMAILJS_SERVICE_ID, APP_MAIL_EMAILJS_TEMPLATE_ID");
        }
    }

    /**
     * Send applicant submission notification
     * 
     * Composed of:
     * 1. Admin notification: New applicant alert
     * 2. Applicant confirmation: Submission received confirmation
     * 
     * Both emails are built from the same backend logic but sent to different recipients
     * with customized content via EmailPayloadDTO mapping.
     */
    @Async("mailTaskExecutor")
    public void sendApplicantSubmissionNotification(String applicantEmail, String applicantName, String project) {
        if (!isEmailJsConfigured()) {
            log.warn("EmailJS not configured; skipping applicant submission notification");
            return;
        }

        // Admin notification payload
        String adminBodyHtml = """
                <p><strong>%s</strong> applied for <strong>%s</strong>.</p>
                <p>Email: %s</p>
                <p>Please review this application in the admin portal.</p>
                """.formatted(escapeHtml(applicantName), escapeHtml(project), escapeHtml(applicantEmail));

        EmailPayloadDTO adminPayload = EmailPayloadDTO.builder()
                .to(notificationTo)
                .subject("New applicant submission")
                .emailType("applicant-submission-admin")
                .recipientName("Admin")
                .title("New Application")
                .subtitle("A new applicant has submitted their profile.")
                .bodyHtml(adminBodyHtml)
                .brandName(brandName)
                .brandWebsite(brandWebsite)
                .isAdminNotification(true)
                .build();
        adminPayload.addMetadata("applicantName", applicantName);
        adminPayload.addMetadata("projectName", project);
        adminPayload.addMetadata("applicantEmail", applicantEmail);

        sendEmailWithRetry(adminPayload);

        // Applicant confirmation payload
        String applicantBodyHtml = """
                <p>Hello %s,</p>
                <p>Thank you for applying to <strong>%s</strong>. We have successfully received your application.</p>
                <p>Our team will review your profile and share an update soon.</p>
                """.formatted(escapeHtml(applicantName), escapeHtml(project));

        EmailPayloadDTO applicantPayload = EmailPayloadDTO.builder()
                .to(applicantEmail)
                .subject("Application received")
                .emailType("applicant-submission-confirmation")
                .recipientName(applicantName)
                .title("Application Received")
                .subtitle("Your submission is in review.")
                .bodyHtml(applicantBodyHtml)
                .brandName(brandName)
                .brandWebsite(brandWebsite)
                .isAdminNotification(false)
                .build();
        applicantPayload.addMetadata("projectName", project);

        sendEmailWithRetry(applicantPayload);
    }

    /**
     * Send applicant decision notification (approval or rejection)
     * 
     * Composed of:
     * 1. Admin notification: Decision recorded
     * 2. Applicant notification: Personalized approval/rejection message
     */
    @Async("mailTaskExecutor")
    public void sendApplicantDecisionNotification(
            String applicantEmail,
            String applicantName,
            String project,
            boolean approved,
            String customMessage) {

        if (!isEmailJsConfigured()) {
            log.warn("EmailJS not configured; skipping decision notification");
            return;
        }

        sendDecisionNotification(ApprovalNotificationDTO.builder()
                .applicantEmail(applicantEmail)
                .applicantName(applicantName)
                .projectAppliedFor(project)
                .approved(approved)
                .adminMessage(customMessage)
                .build());
    }

    /**
     * Send decision notification from DTO
     */
    @Async("mailTaskExecutor")
    public void sendDecisionNotification(ApprovalNotificationDTO request) {
        if (!isEmailJsConfigured()) {
            log.warn("EmailJS not configured; skipping decision notification");
            return;
        }

        String decisionLabel = request.getApproved() ? "approved" : "rejected";
        String normalizedMessage = normalizeAdminMessage(request.getAdminMessage());

        // Admin notification
        String adminBodyHtml = """
                <p><strong>%s</strong> (%s) was <strong>%s</strong> for <strong>%s</strong>.</p>
                <p>Message: %s</p>
                """.formatted(
                escapeHtml(request.getApplicantName()),
                escapeHtml(request.getApplicantEmail()),
                escapeHtml(decisionLabel),
                escapeHtml(request.getProjectAppliedFor()),
                escapeHtml(normalizedMessage));

        EmailPayloadDTO adminPayload = EmailPayloadDTO.builder()
                .to(notificationTo)
                .subject("Applicant " + decisionLabel)
                .emailType("applicant-decision-admin")
                .recipientName("Admin")
                .title("Application Decision")
                .subtitle("A recruitment decision has been recorded.")
                .bodyHtml(adminBodyHtml)
                .brandName(brandName)
                .brandWebsite(brandWebsite)
                .isAdminNotification(true)
                .build();
        adminPayload.addMetadata("applicantName", request.getApplicantName());
        adminPayload.addMetadata("applicantEmail", request.getApplicantEmail());
        adminPayload.addMetadata("projectName", request.getProjectAppliedFor());
        adminPayload.addMetadata("decision", decisionLabel);
        adminPayload.addMetadata("adminMessage", normalizedMessage);

        sendEmailWithRetry(adminPayload);

        // Applicant notification
        String applicantBodyHtml;
        if (request.getApproved()) {
            applicantBodyHtml = """
                    <p>Hello %s,</p>
                    <p>Great news! Your application for <strong>%s</strong> has been approved.</p>
                    <p>%s</p>
                    """.formatted(escapeHtml(request.getApplicantName()), escapeHtml(request.getProjectAppliedFor()), escapeHtml(normalizedMessage));
        } else {
            applicantBodyHtml = """
                    <p>Hello %s,</p>
                    <p>Thank you for applying to <strong>%s</strong>. Your application was not selected this time.</p>
                    <p>%s</p>
                    """.formatted(escapeHtml(request.getApplicantName()), escapeHtml(request.getProjectAppliedFor()), escapeHtml(normalizedMessage));
        }

        EmailPayloadDTO applicantPayload = EmailPayloadDTO.builder()
                .to(request.getApplicantEmail())
                .subject(request.getApproved() ? "Application Update - Approved" : "Application Update - Rejected")
                .emailType(request.getApproved() ? "applicant-approved" : "applicant-rejected")
                .recipientName(request.getApplicantName())
                .title(request.getApproved() ? "Application Approved" : "Application Update")
                .subtitle("Status update for your " + escapeHtml(request.getProjectAppliedFor()) + " application.")
                .bodyHtml(applicantBodyHtml)
                .brandName(brandName)
                .brandWebsite(brandWebsite)
                .isAdminNotification(false)
                .build();
        applicantPayload.addMetadata("projectName", request.getProjectAppliedFor());
        applicantPayload.addMetadata("decision", decisionLabel);

        sendEmailWithRetry(applicantPayload);

        log.info("Sent applicant decision emails applicantEmail={} decision={}", 
                maskEmail(request.getApplicantEmail()), decisionLabel);
    }

    /**
     * Send contact form message
     * 
     * Composed of:
     * 1. Admin notification: New message received
     * 2. Sender confirmation: Thank you message
     */
    @Async("mailTaskExecutor")
    public void sendContactFormMessage(ContactMessageDTO request) {
        if (!isEmailJsConfigured()) {
            log.warn("EmailJS not configured; skipping contact form message");
            return;
        }

        // Admin notification
        String adminBodyHtml = """
                <p><strong>From:</strong> %s (%s)</p>
                <p><strong>Subject:</strong> %s</p>
                <div style="margin-top: 12px; padding: 14px; border-radius: 12px; background: #f7f8f9; color: #1D1D1F;">
                  %s
                </div>
                """.formatted(
                escapeHtml(request.getName()),
                escapeHtml(request.getEmail()),
                escapeHtml(request.getSubject()),
                escapeHtml(request.getMessage()).replace("\n", "<br/>"));

        EmailPayloadDTO adminPayload = EmailPayloadDTO.builder()
                .to(notificationTo)
                .subject("Contact Message: " + request.getSubject())
                .emailType("contact-admin")
                .recipientName("Admin")
                .title("New Contact Message")
                .subtitle("A visitor submitted the contact form.")
                .bodyHtml(adminBodyHtml)
                .brandName(brandName)
                .brandWebsite(brandWebsite)
                .isAdminNotification(true)
                .build();
        adminPayload.addMetadata("senderName", request.getName());
        adminPayload.addMetadata("senderEmail", request.getEmail());
        adminPayload.addMetadata("messageSubject", request.getSubject());

        sendEmailWithRetry(adminPayload);

        // Sender confirmation
        String senderBodyHtml = """
                <p>Hello %s,</p>
                <p>Thanks for contacting %s. We received your message and our team will respond as soon as possible.</p>
                <p>Subject: <strong>%s</strong></p>
                """.formatted(escapeHtml(request.getName()), escapeHtml(brandName), escapeHtml(request.getSubject()));

        EmailPayloadDTO senderPayload = EmailPayloadDTO.builder()
                .to(request.getEmail())
                .subject("We received your message")
                .emailType("contact-confirmation")
                .recipientName(request.getName())
                .title("Message Received")
                .subtitle("Thanks for reaching out!")
                .bodyHtml(senderBodyHtml)
                .brandName(brandName)
                .brandWebsite(brandWebsite)
                .isAdminNotification(false)
                .build();

        sendEmailWithRetry(senderPayload);
    }

    /**
     * Send password reset email with secure reset link
     */
    @Async("mailTaskExecutor")
    public void sendPasswordResetEmail(String recipientEmail, String firstName, String resetUrl) {
        if (!isEmailJsConfigured()) {
            log.warn("EmailJS not configured; skipping password reset email");
            return;
        }

        String safeName = firstName == null || firstName.isBlank() ? "there" : firstName;

        String bodyHtml = """
                <p>Hello %s,</p>
                <p style="color:#4b5563;">We received a request to reset your password. Click the button below to proceed.</p>
                <p>
                  <a href="%s" style="display:inline-block;padding:10px 16px;border-radius:999px;background:#133020;color:#ffffff;text-decoration:none;font-weight:600;">Reset Password</a>
                </p>
                <p style="font-size:13px;color:#6b7280;">This link expires in 30 minutes and can only be used once. If you did not request this, please ignore this email.</p>
                """.formatted(escapeHtml(safeName), escapeHtml(resetUrl));

        EmailPayloadDTO payload = EmailPayloadDTO.builder()
                .to(recipientEmail)
                .subject("Reset your Lifewood Admin password")
                .emailType("password-reset")
                .recipientName(safeName)
                .title("Password Reset")
                .subtitle("Secure account recovery")
                .ctaText("Reset Password")
                .ctaUrl(resetUrl)
                .bodyHtml(bodyHtml)
                .brandName(brandName)
                .brandWebsite(brandWebsite)
                .isAdminNotification(false)
                .build();

        sendEmailWithRetry(payload);
    }

    /**
     * Send email via EmailJS HTTP API with retry logic
     * 
     * This method:
     * 1. Wraps the EmailPayloadDTO in EmailJS format
     * 2. Makes HTTP POST request to EmailJS API
     * 3. Implements exponential backoff retry on failure
     * 4. Logs masked email addresses and response status
     */
    private void sendEmailWithRetry(EmailPayloadDTO payload) {
        if (payload == null || payload.getTo() == null || payload.getTo().isBlank()) {
            log.warn("Skipping email with blank recipient");
            return;
        }

        int attempts = Math.max(1, maxRetryAttempts);
        long baseDelayMs = Math.max(200L, initialRetryDelayMs);

        for (int attempt = 1; attempt <= attempts; attempt++) {
            try {
                String messageId = deliverViaEmailJs(payload);
                log.info("Email delivery accepted recipient={} subject={} emailType={} attempt={}/{} messageId={}",
                        maskEmail(payload.getTo()),
                        payload.getSubject(),
                        payload.getEmailType(),
                        attempt,
                        attempts,
                        messageId);
                return;
            } catch (Exception ex) {
                boolean canRetry = attempt < attempts;
                log.warn("Email delivery failed recipient={} subject={} attempt={}/{} retryable={} reason={}",
                        maskEmail(payload.getTo()),
                        payload.getSubject(),
                        attempt,
                        attempts,
                        canRetry,
                        ex.getMessage());

                if (!canRetry) {
                    log.error("Email delivery permanently failed recipient={} subject={} after {} attempts",
                            maskEmail(payload.getTo()),
                            payload.getSubject(),
                            attempts,
                            ex);
                    return;
                }

                long sleepMs = Math.min(5000L, baseDelayMs * (1L << (attempt - 1)));
                try {
                    TimeUnit.MILLISECONDS.sleep(sleepMs);
                } catch (InterruptedException interruptedException) {
                    Thread.currentThread().interrupt();
                    log.warn("Email retry interrupted for recipient={} subject={}", maskEmail(payload.getTo()), payload.getSubject());
                    return;
                }
            }
        }
    }

    /**
     * Deliver email via EmailJS HTTP API
     * 
     * Transforms EmailPayloadDTO into EmailJS request format:
     * {
     *   "service_id": "...",
     *   "template_id": "...",
     *   "user_id": "...",
     *   "template_params": { ... EmailPayloadDTO fields as template variables ... }
     * }
     * 
     * The EmailJS universal template receives all payload fields as variables
     * and dynamically renders the email based on emailType and content.
     */
    private String deliverViaEmailJs(EmailPayloadDTO payload) {
        if (!isEmailJsConfigured()) {
            throw new IllegalStateException("EmailJS API key, service ID, or template ID not configured");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Build template parameters from payload
        // All EmailPayloadDTO fields become available as variables in the EmailJS template
        java.util.Map<String, Object> templateParams = new java.util.HashMap<>();
        templateParams.put("to_email", payload.getTo());
        templateParams.put("to_name", payload.getRecipientName());
        templateParams.put("subject", payload.getSubject());
        templateParams.put("email_type", payload.getEmailType());
        templateParams.put("title", payload.getTitle());
        templateParams.put("subtitle", payload.getSubtitle());
        templateParams.put("body_html", payload.getBodyHtml());
        templateParams.put("cta_text", payload.getCtaText());
        templateParams.put("cta_url", payload.getCtaUrl());
        templateParams.put("brand_name", payload.getBrandName());
        templateParams.put("brand_website", payload.getBrandWebsite());
        
        // Include metadata if present
        if (payload.getMetadata() != null) {
            payload.getMetadata().forEach(templateParams::put);
        }

        // Build EmailJS request
        java.util.Map<String, Object> emailJsRequest = new java.util.HashMap<>();
        emailJsRequest.put("service_id", emailJsServiceId);
        emailJsRequest.put("template_id", emailJsTemplateId);
        emailJsRequest.put("user_id", emailJsApiKey);
        emailJsRequest.put("template_params", templateParams);

        ResponseEntity<java.util.Map> response = emailRestTemplate.postForEntity(
                emailJsApiUrl,
                new HttpEntity<>(emailJsRequest, headers),
                java.util.Map.class);

        if (response.getStatusCode().value() < 200 || response.getStatusCode().value() >= 300) {
            throw new IllegalStateException("EmailJS API returned non-success status: " + response.getStatusCode().value());
        }

        // EmailJS returns message_id in response body
        if (response.getBody() != null) {
            Object messageId = response.getBody().get("message_id");
            return messageId != null ? messageId.toString() : "success-" + response.getStatusCode().value();
        }

        return "success-" + response.getStatusCode().value();
    }

    /**
     * Check if EmailJS is properly configured
     */
    private boolean isEmailJsConfigured() {
        boolean hasApiKey = emailJsApiKey != null && !emailJsApiKey.isBlank();
        boolean hasServiceId = emailJsServiceId != null && !emailJsServiceId.isBlank();
        boolean hasTemplateId = emailJsTemplateId != null && !emailJsTemplateId.isBlank();
        return hasApiKey && hasServiceId && hasTemplateId;
    }

    /**
     * Mask email for logging purposes
     */
    private String maskEmail(String email) {
        if (email == null || email.isBlank() || !email.contains("@")) {
            return "unknown";
        }

        String[] parts = email.split("@", 2);
        String local = parts[0];
        String domain = parts[1];
        if (local.length() <= 2) {
            return "**@" + domain;
        }
        return local.substring(0, 2) + "***@" + domain;
    }

    /**
     * Escape HTML special characters
     */
    private String escapeHtml(String value) {
        if (value == null) {
            return "";
        }

        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }

    /**
     * Normalize admin message for template inclusion
     */
    private String normalizeAdminMessage(String adminMessage) {
        String message = adminMessage == null ? "" : adminMessage.trim();
        return message.isEmpty() ? "No additional message from the recruitment team." : message;
    }
}

