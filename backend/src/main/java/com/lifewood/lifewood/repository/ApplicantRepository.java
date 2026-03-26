package com.lifewood.lifewood.repository;

import com.lifewood.lifewood.entity.ApplicantEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ApplicantRepository extends JpaRepository<ApplicantEntity, Long>, JpaSpecificationExecutor<ApplicantEntity> {

	Page<ApplicantEntity> findAllByReviewedFalseAndDeletedAtIsNull(Pageable pageable);

	boolean existsByEmailIgnoreCaseAndDeletedAtIsNull(String email);

	boolean existsByEmailIgnoreCaseAndDeletedAtIsNullAndIdNot(String email, Long id);

	boolean existsByIdAndReviewedTrue(Long id);

	long countByDeletedAtIsNullAndCreatedAtGreaterThanEqualAndCreatedAtLessThan(LocalDateTime from, LocalDateTime to);

	long countByDeletedAtIsNullAndReviewedFalse();

	long countByDeletedAtIsNullAndReviewedTrueAndApprovedTrue();

	long countByDeletedAtIsNullAndReviewedTrueAndApprovedFalse();

	long countByDeletedAtIsNullAndReviewedTrueAndReviewedByIgnoreCaseAndApprovedTrue(String reviewedBy);

	long countByDeletedAtIsNullAndReviewedTrueAndReviewedByIgnoreCaseAndApprovedFalse(String reviewedBy);

	@Query("""
			select function('date', a.createdAt), count(a.id)
			from ApplicantEntity a
			where a.deletedAt is null
			and a.createdAt >= :from
			and a.createdAt < :to
			group by function('date', a.createdAt)
			order by function('date', a.createdAt)
			""")
	List<Object[]> countDailySubmissionsBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

	@Modifying
	@Query("delete from ApplicantEntity a where a.deletedAt is not null and a.deletedAt <= :threshold")
	int deleteAllSoftDeletedBefore(LocalDateTime threshold);
}

