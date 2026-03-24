package com.lifewood.lifewood.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "applicants")
public class ApplicantEntity extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "degree", nullable = false)
    private String degree;

    @Column(name = "project_applied_for", nullable = false)
    private String projectAppliedFor;

    @Column(name = "experience")
    private String experience;

    @Column(name = "resume_path", nullable = false)
    private String resumePath;

    @Builder.Default
    @Column(name = "approved", nullable = false)
    private boolean approved = false;

    @Builder.Default
    @Column(name = "reviewed", nullable = false)
    private boolean reviewed = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}

