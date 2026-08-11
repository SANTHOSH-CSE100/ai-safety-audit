package com.aisafetyaudit.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record UserRequest(
        @NotBlank @Email String email,
        @NotBlank String password,
        @NotBlank String fullName,
        @NotBlank String roleName,   // ADMIN, SAFETY_OFFICER, VIEWER
        UUID factoryId
) {}
