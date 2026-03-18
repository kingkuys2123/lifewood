package com.lifewood.lifewood.util;

import com.lifewood.lifewood.entity.NotificationEntity;
import com.lifewood.lifewood.enumeration.NotificationTypeEnum;
import org.springframework.data.jpa.domain.Specification;

public final class NotificationSpecifications {

    private NotificationSpecifications() {
    }

    public static Specification<NotificationEntity> byUserId(Long userId) {
        return (root, query, cb) -> userId == null ? cb.conjunction() : cb.equal(root.get("recipient").get("id"), userId);
    }

    public static Specification<NotificationEntity> byType(NotificationTypeEnum type) {
        return (root, query, cb) -> type == null ? cb.conjunction() : cb.equal(root.get("type"), type);
    }

    public static Specification<NotificationEntity> byIsRead(Boolean isRead) {
        return (root, query, cb) -> isRead == null ? cb.conjunction() : cb.equal(root.get("isRead"), isRead);
    }

    public static Specification<NotificationEntity> byKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }
            String like = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("title")), like),
                    cb.like(cb.lower(root.get("message")), like));
        };
    }
}
