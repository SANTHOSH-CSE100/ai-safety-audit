package com.aisafetyaudit.controller;

import com.aisafetyaudit.dto.upload.UploadResponse;
import com.aisafetyaudit.service.UploadService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/uploads")
@RequiredArgsConstructor
@Tag(name = "Uploads", description = "Video upload and processing status")
public class UploadController {

    private final UploadService uploadService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<UploadResponse> upload(
            Authentication authentication,
            @RequestParam UUID factoryId,
            @RequestParam MultipartFile file) {

        UploadResponse response = uploadService.createUpload(authentication.getName(), factoryId, file);
        return ResponseEntity.accepted().body(response);
    }

    @GetMapping
    public ResponseEntity<List<UploadResponse>> list(@RequestParam UUID factoryId) {
        return ResponseEntity.ok(uploadService.listForFactory(factoryId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UploadResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(uploadService.getById(id));
    }
}
