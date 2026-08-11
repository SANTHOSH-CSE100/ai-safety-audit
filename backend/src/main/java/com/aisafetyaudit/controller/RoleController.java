package com.aisafetyaudit.controller;

import com.aisafetyaudit.repository.RoleRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
@Tag(name = "Roles", description = "Available platform roles")
public class RoleController {

    private final RoleRepository roleRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, String>>> list() {
        var roles = roleRepository.findAll().stream()
                .map(r -> Map.of("name", r.getName(), "description", r.getDescription() == null ? "" : r.getDescription()))
                .toList();
        return ResponseEntity.ok(roles);
    }
}
