package com.aisafetyaudit.repository;

import com.aisafetyaudit.entity.AnalyticsSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AnalyticsSnapshotRepository extends JpaRepository<AnalyticsSnapshot, UUID> {
    List<AnalyticsSnapshot> findByFactoryIdAndSnapshotDateBetweenOrderBySnapshotDateAsc(
            UUID factoryId, LocalDate from, LocalDate to);
}
