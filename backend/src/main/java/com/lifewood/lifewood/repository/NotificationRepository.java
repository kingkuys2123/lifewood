package com.lifewood.lifewood.repository;

import com.lifewood.lifewood.entity.NotificationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long>, JpaSpecificationExecutor<NotificationEntity> {

    Page<NotificationEntity> findByRecipientId(Long userId, Pageable pageable);

    Page<NotificationEntity> findByRecipientIdAndIsReadFalse(Long userId, Pageable pageable);

    long countByRecipientIdAndIsReadFalse(Long userId);

    boolean existsByIdAndRecipientId(Long id, Long recipientId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update NotificationEntity n set n.isRead = true where n.recipient.id = :userId and n.isRead = false")
    int markAllAsReadByRecipientId(@Param("userId") Long userId);
}
