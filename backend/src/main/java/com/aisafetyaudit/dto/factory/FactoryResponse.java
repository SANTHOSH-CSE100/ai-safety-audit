package com.aisafetyaudit.dto.factory;

import java.time.Instant;
import java.util.UUID;

public record FactoryResponse(
        UUID id,
        String name,
        String location,
        String timezone,
        Instant createdAt
) {}
