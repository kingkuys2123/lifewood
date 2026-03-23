package com.lifewood.lifewood.repository;

import com.lifewood.lifewood.entity.ApplicantEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicantRepository extends JpaRepository<ApplicantEntity, Long>, JpaSpecificationExecutor<ApplicantEntity> {

	Page<ApplicantEntity> findAllByReviewedFalse(Pageable pageable);

	boolean existsByEmailIgnoreCase(String email);

	boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);

	boolean existsByIdAndReviewedTrue(Long id);
}

