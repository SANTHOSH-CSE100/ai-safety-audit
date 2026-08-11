package com.aisafetyaudit.dto.auth;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String email,
        String fullName,
        String role
) {}
