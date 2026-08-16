package com.aisafetyaudit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "upload_id", nullable = false)
    private Upload upload;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "factory_id", nullable = false)
    private Factory factory;

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore;

    @Column(name = "safety_score", nullable = false)
    private Integer safetyScore;

    /** Audit template name, e.g. "PPE Compliance Audit" — set by the (mock or real) AI result. */
    @Column(name = "title")
    private String title;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "summary_json")
    private Map<String, Integer> summaryJson;

    /** Human-readable follow-up actions surfaced alongside the violation list. */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "recommendations")
    private List<String> recommendations;

    @Column(name = "pdf_key")
    private String pdfKey;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }
}
