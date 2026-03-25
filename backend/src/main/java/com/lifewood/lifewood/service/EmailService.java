package com.lifewood.lifewood.service;

import com.lifewood.lifewood.dto.applicant.ContactMessageDTO;
import com.lifewood.lifewood.dto.notification.ApprovalNotificationDTO;
import jakarta.annotation.PostConstruct;
import java.util.concurrent.TimeUnit;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

/**
 * Email Service using EmailJS HTTP API
 * 
 * This service sends emails via EmailJS using secure private key authentication.
 * Private key is sent as the "user_id" field in the request body for server-side authentication.
 * 
 * Works on Railway Free/Trial without SMTP restrictions.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final RestTemplate emailRestTemplate;

    @Value("${app.mail.emailjs.service-id:}")
    private String serviceId;

    @Value("${app.mail.emailjs.template-id:}")
    private String templateId;

    @Value("${app.mail.emailjs.public-key:}")
    private String publicKey;

    @Value("${app.mail.emailjs.private-key:}")
    private String privateKey;

    @Value("${app.mail.emailjs.api-url:https://api.emailjs.com/api/v1.0/email/send}")
    private String apiUrl;

    @Value("${app.mail.notification-to:}")
    private String notificationTo;

    @Value("${app.mail.brand.name:Lifewood}")
    private String brandName;

    @Value("${app.mail.brand.website:https://www.lifewood.com}")
    private String brandWebsite;

    @Value("${app.mail.brand.logo-url:}")
    private String brandLogoUrl;

    @Value("${app.mail.retry.max-attempts:3}")
    private int maxRetryAttempts;

    @Value("${app.mail.retry.initial-delay-ms:800}")
    private long initialRetryDelayMs;

    @PostConstruct
    void logMailConfigurationStatus() {
        boolean hasServiceId = serviceId != null && !serviceId.isBlank();
        boolean hasTemplateId = templateId != null && !templateId.isBlank();
        boolean hasPublicKey = publicKey != null && !publicKey.isBlank();
        boolean hasPrivateKey = privateKey != null && !privateKey.isBlank();

        log.info("Mail configuration loaded provider=emailjs serviceIdConfigured={} templateIdConfigured={} publicKeyConfigured={} privateKeyConfigured={} asyncMode=true",
                hasServiceId, hasTemplateId, hasPublicKey, hasPrivateKey);

        if (!hasServiceId || !hasTemplateId || !hasPublicKey || !hasPrivateKey) {
            log.warn("EmailJS configuration is incomplete. Please set all environment variables: APP_MAIL_EMAILJS_SERVICE_ID, APP_MAIL_EMAILJS_TEMPLATE_ID, APP_MAIL_EMAILJS_PUBLIC_KEY, APP_MAIL_EMAILJS_PRIVATE_KEY");
        }
    }

    /**
     * Send applicant submission notification
     */
    @Async("mailTaskExecutor")
    public void sendApplicantSubmissionNotification(String applicantEmail, String applicantName, String project) {
        if (!isEmailJsConfigured()) {
            log.warn("EmailJS not configured; skipping applicant submission notification");
            return;
        }

        // Admin notification
        String adminBodyHtml = """
                <p><strong>%s</strong> applied for <strong>%s</strong>.</p>
                <p>Email: %s</p>
                <p>Please review this application in the admin portal.</p>
                """.formatted(escapeHtml(applicantName), escapeHtml(project), escapeHtml(applicantEmail));

        sendEmailWithRetry(notificationTo, "Admin Notification", "New applicant submission",
                "A new applicant profile is ready for review.", adminBodyHtml,
                "Open Admin Portal", brandWebsite + "/admin/applicants");

        // Applicant confirmation
        String applicantBodyHtml = """
                <p>Thank you for applying to <strong>%s</strong>. We have successfully received your application.</p>
                <p>Our team will review your profile and share an update soon.</p>
                """.formatted(escapeHtml(project));

        sendEmailWithRetry(applicantEmail, applicantName, "Application received",
                "Your submission is in review.", applicantBodyHtml,
                "Visit Lifewood", brandWebsite);
    }

    /**
     * Send applicant decision notification
     */
    @Async("mailTaskExecutor")
    public void sendApplicantDecisionNotification(
            String applicantEmail,
            String applicantName,
            String project,
            boolean approved,
            String customMessage) {

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

        sendEmailWithRetry(notificationTo, "Admin Notification", "Applicant " + decisionLabel,
                "A recruitment decision has been recorded.", adminBodyHtml,
                "Open Admin Portal", brandWebsite + "/admin/applicants");

        // Applicant notification
        String applicantBodyHtml;
        if (request.getApproved()) {
            applicantBodyHtml = """
                    <p>Great news! Your application for <strong>%s</strong> has been approved.</p>
                    <p>%s</p>
                    """.formatted(escapeHtml(request.getProjectAppliedFor()), escapeHtml(normalizedMessage));
        } else {
            applicantBodyHtml = """
                    <p>Thank you for applying to <strong>%s</strong>. Your application was not selected this time.</p>
                    <p>%s</p>
                    """.formatted(escapeHtml(request.getProjectAppliedFor()), escapeHtml(normalizedMessage));
        }

        String applicantSubject = request.getApproved() ? "Application Update - Approved" : "Application Update - Rejected";
        sendEmailWithRetry(request.getApplicantEmail(), request.getApplicantName(), applicantSubject,
                "Status update for your " + request.getProjectAppliedFor() + " application.", applicantBodyHtml,
                "Visit Lifewood", brandWebsite);

        log.info("Sent applicant decision emails applicantEmail={} decision={}", 
                maskEmail(request.getApplicantEmail()), decisionLabel);
    }

    /**
     * Send contact form message
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

        sendEmailWithRetry(notificationTo, "Admin Notification", "Contact Message: " + request.getSubject(),
                "A new message was submitted from the contact form.", adminBodyHtml,
                "Open Admin Portal", brandWebsite + "/admin");

        // Sender confirmation
        String senderBodyHtml = """
                <p>Thanks for contacting %s. We received your message and our team will respond as soon as possible.</p>
                <p>Subject: <strong>%s</strong></p>
                """.formatted(escapeHtml(brandName), escapeHtml(request.getSubject()));

        sendEmailWithRetry(request.getEmail(), request.getName(), "We received your message",
                "Thanks for reaching out.", senderBodyHtml,
                "Visit Lifewood", brandWebsite);
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
                <p style="color:#4b5563;">We received a request to reset your password. Click the button below to proceed.</p>
                <p style="font-size:13px;color:#6b7280;">This link expires in 30 minutes and can only be used once. If you did not request this, please ignore this email.</p>
                """;

        sendEmailWithRetry(recipientEmail, safeName, "Reset your " + brandName + " Admin password",
                "Secure account recovery", bodyHtml,
                "Reset Password", resetUrl);
    }

    /**
     * Send email via EmailJS HTTP API with retry logic
     */
    private void sendEmailWithRetry(
            String toEmail,
            String toName,
            String subject,
            String subtitle,
            String bodyHtml,
            String ctaText,
            String ctaUrl) {
        if (toEmail == null || toEmail.isBlank()) {
            log.warn("Skipping email with blank recipient");
            return;
        }

        int attempts = Math.max(1, maxRetryAttempts);
        long baseDelayMs = Math.max(200L, initialRetryDelayMs);

        for (int attempt = 1; attempt <= attempts; attempt++) {
            try {
                deliverViaEmailJs(toEmail, toName, subject, subtitle, bodyHtml, ctaText, ctaUrl);
                log.info("Email delivery accepted recipient={} subject={} attempt={}/{}",
                        maskEmail(toEmail),
                        subject,
                        attempt,
                        attempts);
                return;
            } catch (Exception ex) {
                boolean retryableError = isRetryableEmailError(ex);
                boolean canRetry = attempt < attempts && retryableError;
                log.warn("Email delivery failed recipient={} subject={} attempt={}/{} retryable={} reason={}",
                        maskEmail(toEmail),
                        subject,
                        attempt,
                        attempts,
                        canRetry,
                        ex.getMessage());

                if (!canRetry) {
                    log.error("Email delivery permanently failed recipient={} subject={} after {} attempts",
                            maskEmail(toEmail),
                            subject,
                            attempts,
                            ex);
                    return;
                }

                long sleepMs = Math.min(5000L, baseDelayMs * (1L << (attempt - 1)));
                try {
                    TimeUnit.MILLISECONDS.sleep(sleepMs);
                } catch (InterruptedException interruptedException) {
                    Thread.currentThread().interrupt();
                    log.warn("Email retry interrupted for recipient={} subject={}", maskEmail(toEmail), subject);
                    return;
                }
            }
        }
    }

    /**
     * Deliver email via EmailJS HTTP API.
     *
     * EmailJS expects:
     * - user_id: Public Key
     * - accessToken: Private Key (required when account is in strict mode)
     */
    private void deliverViaEmailJs(
            String toEmail,
            String toName,
            String subject,
            String subtitle,
            String bodyHtml,
            String ctaText,
            String ctaUrl) {
        if (!isEmailJsConfigured()) {
            throw new IllegalStateException("EmailJS credentials not configured");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN, MediaType.ALL));

        String effectivePublicKey = publicKey == null ? "" : publicKey.trim();
        String effectivePrivateKey = privateKey == null ? "" : privateKey.trim();

        // Build request payload with correct EmailJS key mapping.
        java.util.Map<String, Object> request = new java.util.HashMap<>();
        request.put("service_id", serviceId);
        request.put("template_id", templateId);
        request.put("user_id", effectivePublicKey);
        request.put("accessToken", effectivePrivateKey);
        java.util.Map<String, Object> templateParams = new java.util.HashMap<>();
        templateParams.put("to_email", safeTemplateValue(toEmail));
        templateParams.put("to_name", safeTemplateValue(toName));
        templateParams.put("subject", safeTemplateValue(subject));

        // Support both legacy and current template variable names.
        templateParams.put("message_html", safeTemplateValue(bodyHtml));
        templateParams.put("body_html", safeTemplateValue(bodyHtml));

        // Values used by your current EmailJS template.
        templateParams.put("title", safeTemplateValue(subject));
        templateParams.put("subtitle", safeTemplateValue(subtitle));
        templateParams.put("cta_text", safeTemplateValue(ctaText));
        templateParams.put("cta_url", safeTemplateValue(ctaUrl));

        templateParams.put("brand_name", safeTemplateValue(brandName));
        templateParams.put("brand_website", safeTemplateValue(brandWebsite));
        templateParams.put("logo_url", safeTemplateValue(brandLogoUrl));

        request.put("template_params", templateParams);

        ResponseEntity<String> response = emailRestTemplate.postForEntity(
                apiUrl,
                new HttpEntity<>(request, headers),
                String.class);

        if (response.getStatusCode().value() < 200 || response.getStatusCode().value() >= 300) {
            String errorBody = response.getBody() != null ? response.getBody() : "Unknown error";
            throw new IllegalStateException("EmailJS API error (" + response.getStatusCode().value() + "): " + errorBody);
        }

        log.debug("EmailJS request sent successfully for recipient={}", maskEmail(toEmail));
    }

    /**
     * Retries only transient failures.
     * 4xx responses (especially auth/config issues) are treated as non-retryable.
     */
    private boolean isRetryableEmailError(Exception ex) {
        if (ex instanceof HttpClientErrorException clientError) {
            int status = clientError.getStatusCode().value();
            if (status >= 400 && status < 500) {
                if (status == 412) {
                    log.error("EmailJS/Gmail precondition failed (412). This is typically a Gmail OAuth scope issue in the EmailJS service. Reconnect Gmail in EmailJS and re-consent required scopes.");
                }
                return false;
            }
        }
        return true;
    }

    /**
     * Check if EmailJS is properly configured
     */
    private boolean isEmailJsConfigured() {
        return (serviceId != null && !serviceId.isBlank())
                && (templateId != null && !templateId.isBlank())
                && (publicKey != null && !publicKey.isBlank())
                && (privateKey != null && !privateKey.isBlank());
    }

    /**
     * Mask email for logging
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
     * Normalize admin message
     */
    private String normalizeAdminMessage(String adminMessage) {
        String message = adminMessage == null ? "" : adminMessage.trim();
        return message.isEmpty() ? "No additional message from the recruitment team." : message;
    }

    private String safeTemplateValue(String value) {
        return value == null ? "" : value;
    }
}


