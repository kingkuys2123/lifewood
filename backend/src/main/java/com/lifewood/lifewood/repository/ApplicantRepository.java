package com.lifewood.lifewood.repository;

import com.lifewood.lifewood.entity.ApplicantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicantRepository extends JpaRepository<ApplicantEntity, Long>, JpaSpecificationExecutor<ApplicantEntity> {
}

