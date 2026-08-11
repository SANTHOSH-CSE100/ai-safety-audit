package com.aisafetyaudit.controller;

import com.aisafetyaudit.dto.settings.SettingsRequest;
import com.aisafetyaudit.dto.settings.SettingsResponse;
import com.aisafetyaudit.service.SettingsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/factories/{factoryId}/settings")
@RequiredArgsConstructor
@Tag(name = "Settings", description = "Per-factory configurable settings")
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping
    public ResponseEntity<SettingsResponse> get(@PathVariable UUID factoryId) {
        return ResponseEntity.ok(settingsService.get(factoryId));
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('ADMIN','SAFETY_OFFICER')")
    public ResponseEntity<SettingsResponse> upsert(@PathVariable UUID factoryId, @RequestBody SettingsRequest request) {
        return ResponseEntity.ok(settingsService.upsert(factoryId, request));
    }
}
