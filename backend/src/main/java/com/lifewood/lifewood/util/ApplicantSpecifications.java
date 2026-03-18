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
}

