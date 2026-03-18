package com.lifewood.lifewood.util;

import com.lifewood.lifewood.entity.ApplicantEntity;
import org.springframework.data.jpa.domain.Specification;

public final class ApplicantSpecifications {

    private ApplicantSpecifications() {
    }

    public static Specification<ApplicantEntity> withKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }
            String like = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("email")), like),
                    cb.like(cb.lower(root.get("degree")), like),
                    cb.like(cb.lower(root.get("projectAppliedFor")), like),
                    cb.like(cb.lower(root.get("firstName")), like),
                    cb.like(cb.lower(root.get("lastName")), like));
        };
    }

    public static Specification<ApplicantEntity> withApproved(Boolean approved) {
        return (root, query, cb) -> approved == null ? cb.conjunction() : cb.equal(root.get("approved"), approved);
    }

    public static Specification<ApplicantEntity> withReviewed(Boolean reviewed) {
        return (root, query, cb) -> reviewed == null ? cb.conjunction() : cb.equal(root.get("reviewed"), reviewed);
    }
}

