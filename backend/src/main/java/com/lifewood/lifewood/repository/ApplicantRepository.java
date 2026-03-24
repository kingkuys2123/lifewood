package com.lifewood.lifewood.repository;

import com.lifewood.lifewood.entity.ApplicantEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ApplicantRepository extends JpaRepository<ApplicantEntity, Long>, JpaSpecificationExecutor<ApplicantEntity> {

	Page<ApplicantEntity> findAllByReviewedFalseAndDeletedAtIsNull(Pageable pageable);

	boolean existsByEmailIgnoreCaseAndDeletedAtIsNull(String email);

	boolean existsByEmailIgnoreCaseAndDeletedAtIsNullAndIdNot(String email, Long id);

	boolean existsByIdAndReviewedTrue(Long id);

	@Modifying
	@Query("delete from ApplicantEntity a where a.deletedAt is not null and a.deletedAt <= :threshold")
	int deleteAllSoftDeletedBefore(LocalDateTime threshold);
}

