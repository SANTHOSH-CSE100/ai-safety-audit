package com.aisafetyaudit.repository;

import com.aisafetyaudit.entity.Violation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ViolationRepository extends JpaRepository<Violation, UUID> {
    List<Violation> findByReportId(UUID reportId);
}
