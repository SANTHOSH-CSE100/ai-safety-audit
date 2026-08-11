package com.aisafetyaudit.dto.upload;

import java.time.Instant;
import java.util.UUID;

public record UploadResponse(
        UUID id,
        String originalName,
        String status,
        UUID reportId,
        Instant createdAt
) {}
