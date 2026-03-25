package com.lifewood.lifewood.service;

import com.lifewood.lifewood.dto.applicant.ContactMessageDTO;
import com.lifewood.lifewood.dto.notification.ApprovalNotificationDTO;
import jakarta.annotation.PostConstruct;
import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.mail.notification-to}")
    private String notificationTo;

    @Value("${app.mail.templates.approval-subject:Application Update - Approved}")
    private String approvalSubjectTemplate;

    @Value("${app.mail.templates.rejection-subject:Application Update - Rejected}")
    private String rejectionSubjectTemplate;

    @Value("${app.mail.templates.approval-body:Hello {{name}},\n\nGreat news! Your application for {{project}} has been approved.\n\n{{message}}}")
    private String approvalBodyTemplate;

    @Value("${app.mail.templates.rejection-body:Hello {{name}},\n\nThank you for applying to {{project}}. Your application was not selected this time.\n\n{{message}}}")
    private String rejectionBodyTemplate;

    @Value("${app.mail.templates.reset-password-subject:Reset your Lifewood Admin password}")
    private String resetPasswordSubjectTemplate;

    @Value("${app.mail.templates.reset-password-body:Hello {{name}},\n\nWe received a request to reset your password.\n\nUse this link: {{resetUrl}}\n\nIf you did not request this, please ignore this message.}")
    private String resetPasswordBodyTemplate;

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
        String sender = sanitizeConfiguredValue(fromEmail);
        String recipient = sanitizeConfiguredValue(notificationTo);
        log.info("Mail configuration loaded senderConfigured={} notificationRecipientConfigured={} retryAttempts={} asyncMode={}",
                sender != null && !sender.isBlank(),
                recipient != null && !recipient.isBlank(),
                Math.max(1, maxRetryAttempts),
                true);
    }

    @Async("mailTaskExecutor")
    public void sendApplicantSubmissionNotification(String applicantEmail, String applicantName, String project) {
        String adminBody = """
                <p><strong>%s</strong> applied for <strong>%s</strong>.</p>
                <p>Email: %s</p>
                <p>Please review this application in the admin portal.</p>
                """.formatted(escapeHtml(applicantName), escapeHtml(project), escapeHtml(applicantEmail));

        String applicantBody = """
                <p>Hello %s,</p>
                <p>Thank you for applying to <strong>%s</strong>. We have successfully received your application.</p>
                <p>Our team will review your profile and share an update soon.</p>
                """.formatted(escapeHtml(applicantName), escapeHtml(project));

        sendHtmlMailWithRetry(notificationTo,
                "New applicant submission",
                composeTemplate("New Application", "A new applicant has submitted their profile.", adminBody));

        sendHtmlMailWithRetry(applicantEmail,
                "Application received",
                composeTemplate("Application Received", "Your submission is in review.", applicantBody));
    }

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

    @Async("mailTaskExecutor")
    public void sendDecisionNotification(ApprovalNotificationDTO request) {
        String decisionLabel = request.getApproved() ? "approved" : "rejected";
        String normalizedMessage = normalizeAdminMessage(request.getAdminMessage());

        String applicantBody = renderTemplate(
                request.getApproved() ? approvalBodyTemplate : rejectionBodyTemplate,
                request.getApplicantName(),
                request.getProjectAppliedFor(),
                normalizedMessage);
        String applicantSubject = request.getApproved() ? approvalSubjectTemplate : rejectionSubjectTemplate;

        String adminBody = """
                <p><strong>%s</strong> (%s) was <strong>%s</strong> for <strong>%s</strong>.</p>
                <p>Message: %s</p>
                """.formatted(
                escapeHtml(request.getApplicantName()),
                escapeHtml(request.getApplicantEmail()),
                escapeHtml(decisionLabel),
                escapeHtml(request.getProjectAppliedFor()),
                escapeHtml(normalizedMessage));

        sendHtmlMailWithRetry(notificationTo,
                "Applicant " + decisionLabel,
                composeTemplate("Application Decision", "A recruitment decision has been recorded.", adminBody));

        sendHtmlMailWithRetry(
                request.getApplicantEmail(),
                applicantSubject,
                composeTemplate(
                        request.getApproved() ? "Application Approved" : "Application Update",
                        "Status update for your " + escapeHtml(request.getProjectAppliedFor()) + " application.",
                        "<p>" + escapeHtml(renderTemplate(applicantBody, request.getApplicantName(),
                                request.getProjectAppliedFor(), normalizedMessage)).replace("\n", "<br/>") + "</p>"));
        log.info("Sent applicant decision emails applicantEmail={} decision={}", request.getApplicantEmail(), decisionLabel);
    }

    @Async("mailTaskExecutor")
    public void sendContactFormMessage(ContactMessageDTO request) {
        String adminBody = """
                <p><strong>From:</strong> %s (%s)</p>
                <p><strong>Subject:</strong> %s</p>
                <div style="margin-top: 12px; padding: 14px; border-radius: 12px; background: #f7f8f9; color: #1D1D1F;">
                  %s
                </div>
                """.formatted(
                escapeHtml(request.getName()),
                escapeHtml(request.getEmail()),
                escapeHtml(request.getSubject()),
                escapeHtml(request.getMessage()).replace("\n", "<br/>")
        );

        String senderBody = """
                <p>Hello %s,</p>
                <p>Thanks for contacting %s. We received your message and our team will respond as soon as possible.</p>
                <p>Subject: <strong>%s</strong></p>
                """.formatted(escapeHtml(request.getName()), escapeHtml(brandName), escapeHtml(request.getSubject()));

        sendHtmlMailWithRetry(notificationTo, "Contact Message: " + request.getSubject(),
                composeTemplate("New Contact Message", "A visitor submitted the contact form.", adminBody));
        sendHtmlMailWithRetry(request.getEmail(), "We received your message",
                composeTemplate("Message Received", "Thanks for reaching out!", senderBody));
    }

    @Async("mailTaskExecutor")
    public void sendPasswordResetEmail(String recipientEmail, String firstName, String resetUrl) {
        String safeName = firstName == null || firstName.isBlank() ? "there" : firstName;
        String templateBody = resetPasswordBodyTemplate
                .replace("{{name}}", safeName)
                .replace("{{resetUrl}}", "the secure reset link below");
        String templateBodyHtml = escapeHtml(templateBody).replace("\n", "<br/>");

        String body = """
                <p>Hello %s,</p>
                <p style="color:#4b5563;">%s</p>
                <p>
                  <a href=\"%s\" style=\"display:inline-block;padding:10px 16px;border-radius:999px;background:#133020;color:#ffffff;text-decoration:none;font-weight:600;\">Reset Password</a>
                </p>
                <p style=\"font-size:13px;color:#6b7280;\">This link expires soon and can only be used once.</p>
                """.formatted(
                escapeHtml(safeName),
                templateBodyHtml,
                escapeHtml(resetUrl));

        sendHtmlMailWithRetry(
                recipientEmail,
                resetPasswordSubjectTemplate,
                composeTemplate("Password Reset", "Secure account recovery", body));
    }

    private void sendHtmlMailWithRetry(String to, String subject, String htmlBody) {
        String sender = sanitizeConfiguredValue(fromEmail);
        String recipient = sanitizeConfiguredValue(to);

        if (sender == null || sender.isBlank()) {
            log.error("Email sender (SPRING_MAIL_USERNAME) is not configured");
            return;
        }

        if (recipient == null || recipient.isBlank()) {
            log.warn("Skipping email with blank recipient. subject={}", subject);
            return;
        }

        int attempts = Math.max(1, maxRetryAttempts);
        long baseDelayMs = Math.max(200L, initialRetryDelayMs);

        for (int attempt = 1; attempt <= attempts; attempt++) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
                helper.setFrom(sender);
                helper.setTo(recipient);
                helper.setSubject(subject);
                helper.setText(htmlBody, true);
                mailSender.send(message);

                log.info("Email delivery accepted recipient={} subject={} attempt={}/{} messageId={}",
                        maskEmail(recipient),
                        subject,
                        attempt,
                        attempts,
                        message.getMessageID());
                return;
            } catch (Exception ex) {
                boolean canRetry = attempt < attempts;
                log.warn("Email delivery failed recipient={} subject={} attempt={}/{} retryable={} reason={}",
                        maskEmail(recipient),
                        subject,
                        attempt,
                        attempts,
                        canRetry,
                        ex.getMessage());
                if (!canRetry) {
                    log.error("Email delivery permanently failed recipient={} subject={} after {} attempts",
                            maskEmail(recipient),
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
                    log.warn("Email retry interrupted for recipient={} subject={}", maskEmail(recipient), subject);
                    return;
                }
            }
        }
    }

    private String sanitizeConfiguredValue(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        if (trimmed.length() >= 2 && ((trimmed.startsWith("\"") && trimmed.endsWith("\""))
                || (trimmed.startsWith("'") && trimmed.endsWith("'")))) {
            return trimmed.substring(1, trimmed.length() - 1).trim();
        }
        return trimmed;
    }

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

    private String composeTemplate(String title, String subtitle, String bodyHtml) {
        return """
                <div style="background:#f2f4f5;padding:24px;font-family:Arial,sans-serif;color:#1D1D1F;">
                  <table role="presentation" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
                    <tr>
                      <td style="padding:24px;background:linear-gradient(135deg,#133020,#1f4d33);color:#ffffff;">
                        <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:.9;">%s</div>
                        <h1 style="margin:10px 0 6px;font-size:24px;line-height:1.2;">%s</h1>
                        <p style="margin:0;font-size:14px;opacity:.95;">%s</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:24px;font-size:15px;line-height:1.65;">%s</td>
                    </tr>
                    <tr>
                      <td style="padding:18px 24px;border-top:1px solid #eceff2;color:#6b7280;font-size:12px;">
                        Sent by %s | <a href="%s" style="color:#133020;text-decoration:none;">Visit website</a>
                      </td>
                    </tr>
                  </table>
                </div>
                """.formatted(
                escapeHtml(brandName),
                escapeHtml(title),
                escapeHtml(subtitle),
                bodyHtml,
                escapeHtml(brandName),
                escapeHtml(brandWebsite));
    }

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

    private String normalizeAdminMessage(String adminMessage) {
        String message = adminMessage == null ? "" : adminMessage.trim();
        return message.isEmpty() ? "No additional message from the recruitment team." : message;
    }

    private String renderTemplate(String template, String name, String project, String message) {
        return template
                .replace("{{name}}", name)
                .replace("{{project}}", project)
                .replace("{{message}}", message);
    }
}

