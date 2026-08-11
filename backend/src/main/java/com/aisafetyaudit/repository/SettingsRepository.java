package com.aisafetyaudit.repository;

import com.aisafetyaudit.entity.Settings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SettingsRepository extends JpaRepository<Settings, UUID> {
    Optional<Settings> findByFactoryId(UUID factoryId);
}
