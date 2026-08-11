package com.aisafetyaudit.service;

import com.aisafetyaudit.dto.factory.FactoryRequest;
import com.aisafetyaudit.dto.factory.FactoryResponse;
import com.aisafetyaudit.entity.Factory;
import com.aisafetyaudit.exception.ResourceNotFoundException;
import com.aisafetyaudit.repository.FactoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FactoryService {

    private final FactoryRepository factoryRepository;

    @Transactional
    public FactoryResponse create(FactoryRequest request) {
        Factory factory = Factory.builder()
                .name(request.name())
                .location(request.location())
                .timezone(request.timezone() != null ? request.timezone() : "Asia/Kolkata")
                .build();
        return toResponse(factoryRepository.save(factory));
    }

    public List<FactoryResponse> list() {
        return factoryRepository.findAll().stream().map(this::toResponse).toList();
    }

    public FactoryResponse getById(UUID id) {
        return toResponse(findEntity(id));
    }

    @Transactional
    public FactoryResponse update(UUID id, FactoryRequest request) {
        Factory factory = findEntity(id);
        factory.setName(request.name());
        factory.setLocation(request.location());
        if (request.timezone() != null) factory.setTimezone(request.timezone());
        return toResponse(factory);
    }

    @Transactional
    public void delete(UUID id) {
        factoryRepository.delete(findEntity(id));
    }

    private Factory findEntity(UUID id) {
        return factoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Factory not found: " + id));
    }

    private FactoryResponse toResponse(Factory f) {
        return new FactoryResponse(f.getId(), f.getName(), f.getLocation(), f.getTimezone(), f.getCreatedAt());
    }
}
