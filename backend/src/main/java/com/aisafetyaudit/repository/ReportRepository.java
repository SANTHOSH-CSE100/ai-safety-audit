package com.aisafetyaudit.repository;

import com.aisafetyaudit.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReportRepository extends JpaRepository<Report, UUID> {
    List<Report> findByFactoryIdOrderByCreatedAtDesc(UUID factoryId);
    Optional<Report> findByUploadId(UUID uploadId);
}
