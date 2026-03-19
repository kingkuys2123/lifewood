package com.lifewood.lifewood.enumeration;

public enum NotificationTypeEnum {
    APPROVAL("Approval"),
    REJECTION("Rejection"),
    APPLICATION_APPROVED("Application Approved"),
    APPLICATION_DENIED("Application Denied"),
    APPLICANT_SUBMISSION("New Applicant"),
    SYSTEM_INFO("System Information"),
    USER_ACTION("User Action"),
    OTHER("Other");

    private final String displayName;

    NotificationTypeEnum(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
