package com.aisafetyaudit.repository;

import com.aisafetyaudit.entity.Upload;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UploadRepository extends JpaRepository<Upload, UUID> {
    List<Upload> findByFactoryIdOrderByCreatedAtDesc(UUID factoryId);
}
