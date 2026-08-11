package com.aisafetyaudit.dto.user;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String fullName,
        String role,
        UUID factoryId,
        boolean active,
        Instant createdAt
) {}
