package com.aisafetyaudit.service;

import com.aisafetyaudit.dto.settings.SettingsRequest;
import com.aisafetyaudit.dto.settings.SettingsResponse;
import com.aisafetyaudit.entity.Factory;
import com.aisafetyaudit.entity.Settings;
import com.aisafetyaudit.exception.ResourceNotFoundException;
import com.aisafetyaudit.repository.FactoryRepository;
import com.aisafetyaudit.repository.SettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final SettingsRepository settingsRepository;
    private final FactoryRepository factoryRepository;

    public SettingsResponse get(UUID factoryId) {
        Settings settings = settingsRepository.findByFactoryId(factoryId)
                .orElseGet(() -> Settings.builder()
                        .factory(factoryRepository.findById(factoryId)
                                .orElseThrow(() -> new ResourceNotFoundException("Factory not found: " + factoryId)))
                        .settingsJson(Map.of())
                        .build());
        return toResponse(settings);
    }

    @Transactional
    public SettingsResponse upsert(UUID factoryId, SettingsRequest request) {
        Factory factory = factoryRepository.findById(factoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Factory not found: " + factoryId));

        Settings settings = settingsRepository.findByFactoryId(factoryId)
                .orElseGet(() -> Settings.builder().factory(factory).build());

        settings.setSettingsJson(request.settings());
        settings = settingsRepository.save(settings);
        return toResponse(settings);
    }

    private SettingsResponse toResponse(Settings s) {
        return new SettingsResponse(
                s.getFactory().getId(),
                s.getSettingsJson(),
                s.getUpdatedAt()
        );
    }
}
