package com.lifewood.lifewood.service;

import com.lifewood.lifewood.dto.applicant.ContactMessageDTO;
import com.lifewood.lifewood.dto.notification.ApprovalNotificationDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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

    public void sendApplicantSubmissionNotification(String applicantEmail, String applicantName, String project) {
        sendMail(notificationTo,
                "New applicant submission",
                "ApplicantEntity " + applicantName + " applied for project: " + project + ".");

        sendMail(applicantEmail,
                "Application received",
                "Hello " + applicantName + ", your application has been received successfully.");
    }

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

    public void sendDecisionNotification(ApprovalNotificationDTO request) {
        String decisionLabel = request.getApproved() ? "approved" : "rejected";
        String normalizedMessage = normalizeAdminMessage(request.getAdminMessage());

        String applicantBody = renderTemplate(
                request.getApproved() ? approvalBodyTemplate : rejectionBodyTemplate,
                request.getApplicantName(),
                request.getProjectAppliedFor(),
                normalizedMessage);
        String applicantSubject = request.getApproved() ? approvalSubjectTemplate : rejectionSubjectTemplate;

        sendMail(notificationTo,
                "Applicant " + decisionLabel,
                "Applicant " + request.getApplicantName() + " (" + request.getApplicantEmail() + ") was "
                        + decisionLabel + " for " + request.getProjectAppliedFor() + ".\n\nMessage: " + normalizedMessage);

        sendMail(request.getApplicantEmail(), applicantSubject, applicantBody);
        log.info("Sent applicant decision emails applicantEmail={} decision={}", request.getApplicantEmail(), decisionLabel);
    }

    public void sendContactFormMessage(ContactMessageDTO request) {
        String body = "From: " + request.getName() + " <" + request.getEmail() + ">\n\n" + request.getMessage();
        sendMail(notificationTo, request.getSubject(), body);
    }

    private void sendMail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent to {} with subject {}", to, subject);
        } catch (Exception ex) {
            log.error("Failed to send email to {}", to, ex);
        }
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

