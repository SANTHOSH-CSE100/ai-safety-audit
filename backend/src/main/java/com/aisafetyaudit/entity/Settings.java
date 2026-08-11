package com.aisafetyaudit.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "settings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Settings {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "factory_id", nullable = false, unique = true)
    private Factory factory;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "settings_json", nullable = false)
    @Builder.Default
    private Map<String, Object> settingsJson = Map.of();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    void onSave() { updatedAt = Instant.now(); }
}
