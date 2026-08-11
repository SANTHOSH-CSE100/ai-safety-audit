package com.aisafetyaudit.service;

import com.aisafetyaudit.dto.upload.UploadResponse;
import com.aisafetyaudit.entity.Factory;
import com.aisafetyaudit.entity.Upload;
import com.aisafetyaudit.entity.User;
import com.aisafetyaudit.exception.ResourceNotFoundException;
import com.aisafetyaudit.repository.FactoryRepository;
import com.aisafetyaudit.repository.ReportRepository;
import com.aisafetyaudit.repository.UploadRepository;
import com.aisafetyaudit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UploadService {

    private final UploadRepository uploadRepository;
    private final UserRepository userRepository;
    private final FactoryRepository factoryRepository;
    private final ReportRepository reportRepository;
    private final StorageService storageService;
    private final AiDetectionClient aiDetectionClient;

    @Transactional
    public UploadResponse createUpload(String userEmail, UUID factoryId, MultipartFile file) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Factory factory = factoryRepository.findById(factoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Factory not found"));

        String objectKey = storageService.storeVideo(file);

        Upload upload = Upload.builder()
                .factory(factory)
                .uploadedBy(user)
                .fileKey(objectKey)
                .originalName(file.getOriginalFilename())
                .status(Upload.Status.PENDING)
                .build();

        upload = uploadRepository.save(upload);

        // Kick off async AI processing — fire-and-forget, status updates via webhook/poll.
        aiDetectionClient.submitForProcessing(upload.getId(), objectKey);

        return toResponse(upload);
    }

    public List<UploadResponse> listForFactory(UUID factoryId) {
        return uploadRepository.findByFactoryIdOrderByCreatedAtDesc(factoryId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public UploadResponse getById(UUID id) {
        Upload upload = uploadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Upload not found: " + id));
        return toResponse(upload);
    }

    private UploadResponse toResponse(Upload upload) {
        UUID reportId = upload.getStatus() == Upload.Status.COMPLETED
                ? reportRepository.findByUploadId(upload.getId()).map(r -> r.getId()).orElse(null)
                : null;

        return new UploadResponse(
                upload.getId(),
                upload.getOriginalName(),
                upload.getStatus().name(),
                reportId,
                upload.getCreatedAt()
        );
    }
}
