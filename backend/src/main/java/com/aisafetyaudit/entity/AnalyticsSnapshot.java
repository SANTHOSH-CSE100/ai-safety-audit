package com.aisafetyaudit.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "analytics_snapshots")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AnalyticsSnapshot {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "factory_id", nullable = false)
    private Factory factory;

    @Column(name = "snapshot_date", nullable = false)
    private LocalDate snapshotDate;

    @Column(name = "total_uploads", nullable = false)
    @Builder.Default
    private Integer totalUploads = 0;

    @Column(name = "total_violations", nullable = false)
    @Builder.Default
    private Integer totalViolations = 0;

    @Column(name = "avg_safety_score")
    private BigDecimal avgSafetyScore;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() { createdAt = Instant.now(); }
}
