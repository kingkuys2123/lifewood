package com.lifewood.lifewood.service;

import com.lifewood.lifewood.dto.applicant.ContactMessageDTO;
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

    public void sendApplicantSubmissionNotification(String applicantEmail, String applicantName, String project) {
        sendMail(notificationTo,
                "New applicant submission",
                "ApplicantEntity " + applicantName + " applied for project: " + project + ".");

        sendMail(applicantEmail,
                "Application received",
                "Hello " + applicantName + ", your application has been received successfully.");
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
}

