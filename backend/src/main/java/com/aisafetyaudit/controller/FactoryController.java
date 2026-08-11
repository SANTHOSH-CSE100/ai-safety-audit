package com.aisafetyaudit.controller;

import com.aisafetyaudit.dto.factory.FactoryRequest;
import com.aisafetyaudit.dto.factory.FactoryResponse;
import com.aisafetyaudit.service.FactoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/factories")
@RequiredArgsConstructor
@Tag(name = "Factories", description = "Factory management (admin)")
public class FactoryController {

    private final FactoryService factoryService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FactoryResponse> create(@Valid @RequestBody FactoryRequest request) {
        return ResponseEntity.status(201).body(factoryService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<FactoryResponse>> list() {
        return ResponseEntity.ok(factoryService.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FactoryResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(factoryService.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FactoryResponse> update(@PathVariable UUID id, @Valid @RequestBody FactoryRequest request) {
        return ResponseEntity.ok(factoryService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        factoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
