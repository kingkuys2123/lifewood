package com.lifewood.lifewood.dto.email;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

/**
 * Unified Email Payload DTO for EmailJS Universal Template System
 * 
 * All email types (password reset, notifications, contact messages) are mapped to this structure
 * and passed to a single EmailJS template with dynamic variables.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmailPayloadDTO {

    /**
     * Recipient email address
     */
    private String to;

    /**
     * Email subject line (will be used by template if needed)
     */
    private String subject;

    /**
     * Email type identifier for template routing (e.g., "password-reset", "approval", "contact-confirmation")
     * Allows EmailJS to handle different email types within the universal template
     */
    private String emailType;

    /**
     * Recipient's first name (used in template greeting)
     */
    private String recipientName;

    /**
     * Main title/heading displayed in the email (e.g., "Password Reset", "Application Approved")
     */
    private String title;

    /**
     * Subtitle or brief description of the email purpose
     */
    private String subtitle;

    /**
     * Primary CTA (Call-To-Action) text (e.g., "Reset Password", "View Application")
     */
    private String ctaText;

    /**
     * Primary CTA URL link
     */
    private String ctaUrl;

    /**
     * Main body content in HTML format
     * This is the core message body of the email
     */
    private String bodyHtml;

    /**
     * Additional metadata for template customization
     * Example: {"applicantName": "John Doe", "projectName": "Engineering", "decision": "approved"}
     */
    private Map<String, String> metadata;

    /**
     * Brand name (defaults to "Lifewood")
     */
    private String brandName;

    /**
     * Brand website URL
     */
    private String brandWebsite;

    /**
     * Flag to indicate if this is a notification to admins (for filtering/routing)
     */
    private boolean isAdminNotification;

    /**
     * Add metadata key-value pair
     */
    public void addMetadata(String key, String value) {
        if (this.metadata == null) {
            this.metadata = new HashMap<>();
        }
        this.metadata.put(key, value);
    }

    /**
     * Get metadata value safely
     */
    public String getMetadata(String key) {
        return this.metadata != null ? this.metadata.get(key) : null;
    }
}

