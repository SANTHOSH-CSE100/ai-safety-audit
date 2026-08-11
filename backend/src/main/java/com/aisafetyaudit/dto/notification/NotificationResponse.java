package com.aisafetyaudit.dto.notification;

import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        String title,
        String body,
        boolean read,
        UUID relatedReportId,
        Instant createdAt
) {}
