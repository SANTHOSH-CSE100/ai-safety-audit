package com.aisafetyaudit.dto.settings;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record SettingsResponse(
        UUID factoryId,
        Map<String, Object> settings,
        Instant updatedAt
) {}
