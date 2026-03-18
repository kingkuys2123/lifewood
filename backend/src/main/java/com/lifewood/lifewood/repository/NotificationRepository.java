package com.lifewood.lifewood.repository;

import com.lifewood.lifewood.entity.NotificationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long>, JpaSpecificationExecutor<NotificationEntity> {

    Page<NotificationEntity> findByRecipientId(Long userId, Pageable pageable);

    Page<NotificationEntity> findByRecipientIdAndIsReadFalse(Long userId, Pageable pageable);

    long countByRecipientIdAndIsReadFalse(Long userId);
}
