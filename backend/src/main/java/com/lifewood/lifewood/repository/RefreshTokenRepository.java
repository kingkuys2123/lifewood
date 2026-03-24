package com.lifewood.lifewood.repository;

import com.lifewood.lifewood.entity.RefreshTokenEntity;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, Long> {

    Optional<RefreshTokenEntity> findByTokenId(String tokenId);

    List<RefreshTokenEntity> findByUser_IdAndRevokedAtIsNull(Long userId);

    void deleteByExpiresAtBefore(LocalDateTime timestamp);
}

