package com.aisafetyaudit.dto.factory;

import jakarta.validation.constraints.NotBlank;

public record FactoryRequest(
        @NotBlank String name,
        String location,
        String timezone
) {}
