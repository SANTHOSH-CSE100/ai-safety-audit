package com.aisafetyaudit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "violations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Violation {

    public enum Severity { LOW, MEDIUM, HIGH, CRITICAL }

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;

    @Column(nullable = false)
    private String type; // NO_HELMET, NO_VEST, FIRE, RESTRICTED_AREA, NEAR_MISS...

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    @Column(nullable = false)
    private BigDecimal confidence;

    @Column(name = "timestamp_sec", nullable = false)
    private BigDecimal timestampSec;

    @Column(name = "bbox_x") private Integer bboxX;
    @Column(name = "bbox_y") private Integer bboxY;
    @Column(name = "bbox_w") private Integer bboxW;
    @Column(name = "bbox_h") private Integer bboxH;

    @Column(name = "track_id")
    private Integer trackId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }
}
