package com.aisafetyaudit.service;

import com.aisafetyaudit.entity.Report;
import com.aisafetyaudit.entity.Upload;
import com.aisafetyaudit.repository.UploadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.util.UUID;

/**
 * Talks to the FastAPI AI Detection Service (Project 3).
 * The backend never touches model code directly — this is the only
 * integration seam between Spring Boot and the Python service.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AiDetectionClient {

    private final WebClient aiServiceWebClient;
    private final UploadRepository uploadRepository;
    private final ReportService reportService;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;

    @Async
    public void submitForProcessing(UUID uploadId, String objectKey) {
        Upload upload = uploadRepository.findById(uploadId).orElseThrow();
        upload.setStatus(Upload.Status.PROCESSING);
        uploadRepository.save(upload);
        pushStatus(upload);

        try {
            AiDetectionResult result = aiServiceWebClient.post()
                    .uri("/detect/video")
                    .bodyValue(Map.of(
                            "video_id", uploadId.toString(),
                            "object_key", objectKey
                    ))
                    .retrieve()
                    .bodyToMono(AiDetectionResult.class)
                    .block();

            Report report = reportService.createFromDetectionResult(upload, result);

            upload.setStatus(Upload.Status.COMPLETED);
            uploadRepository.save(upload);
            pushStatus(upload);

            notificationService.notify(
                    upload.getUploadedBy(),
                    "Safety report ready",
                    "Report for \"%s\" is ready — safety score %d/100."
                            .formatted(upload.getOriginalName(), report.getSafetyScore()),
                    report
            );
        } catch (Exception ex) {
            log.error("AI detection failed for upload {}", uploadId, ex);
            upload.setStatus(Upload.Status.FAILED);
            upload.setErrorMessage(ex.getMessage());
            uploadRepository.save(upload);
            pushStatus(upload);

            notificationService.notify(
                    upload.getUploadedBy(),
                    "Processing failed",
                    "We couldn't process \"%s\". Please try re-uploading.".formatted(upload.getOriginalName()),
                    null
            );
        }
    }

    private void pushStatus(Upload upload) {
        messagingTemplate.convertAndSend(
                "/topic/uploads." + upload.getId() + ".status",
                Map.of("uploadId", upload.getId().toString(), "status", upload.getStatus().name())
        );
    }

    /** Mirrors the AI service's structured JSON response contract (see docs/ARCHITECTURE.md). */
    public record AiDetectionResult(
            String videoId,
            Double durationSec,
            Integer framesAnalyzed,
            java.util.List<Violation> violations,
            Integer riskScore,
            Integer safetyScore,
            Map<String, Integer> summary
    ) {
        public record Violation(
                String type,
                Double confidence,
                Double timestampSec,
                java.util.List<Integer> bbox,
                Integer trackId,
                String severity
        ) {}
    }
}
