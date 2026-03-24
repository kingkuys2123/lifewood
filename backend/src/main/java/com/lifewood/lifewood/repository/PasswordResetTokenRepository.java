package com.lifewood.lifewood.repository;

import com.lifewood.lifewood.entity.PasswordResetTokenEntity;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetTokenEntity, Long> {

    Optional<PasswordResetTokenEntity> findByTokenHash(String tokenHash);

    void deleteByUser_Id(Long userId);

    void deleteByExpiresAtBefore(LocalDateTime timestamp);
}

