package com.aisafetyaudit.service;

import com.aisafetyaudit.entity.Report;
import com.aisafetyaudit.entity.Upload;
import com.aisafetyaudit.event.UploadCreatedEvent;
import com.aisafetyaudit.repository.UploadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

/**
 * Talks to the FastAPI AI Detection Service (Project 3) — or, in demo mode
 * (the default), generates a realistic mock analysis instead so the whole
 * upload → report pipeline works without that service running at all. The
 * backend never touches model code directly either way — this is the only
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
    private final MockAiAnalysisService mockAiAnalysisService;

    /**
     * Demo mode by default: the AI service is optional. Set
     * AI_SERVICE_MOCK_ENABLED=false once a real AI service is wired up to
     * route uploads through it instead.
     */
    @Value("${app.ai-service.mock-enabled:true}")
    private boolean mockEnabled;

    /**
     * Listens for UploadService's post-commit event instead of being called
     * directly, so this never starts before the Upload row it looks up is
     * actually visible outside the transaction that created it.
     * `fallbackExecution = true` covers the (test/edge-case) scenario where
     * the event is published with no transaction active — it just runs
     * immediately instead of silently dropping the event.
     */
    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onUploadCreated(UploadCreatedEvent event) {
        submitForProcessing(event.uploadId(), event.objectKey());
    }

    public void submitForProcessing(UUID uploadId, String objectKey) {
        Upload upload = uploadRepository.findById(uploadId).orElseThrow();
        upload.setStatus(Upload.Status.PROCESSING);
        uploadRepository.save(upload);
        pushStatus(upload);

        try {
            AiDetectionResult result = mockEnabled
                    ? runMockAnalysis(uploadId)
                    : aiServiceWebClient.post()
                            .uri("/detect/video")
                            .bodyValue(Map.of(
                                    "video_id", uploadId.toString(),
                                    "object_key", objectKey
                            ))
                            .retrieve()
                            .bodyToMono(AiDetectionResult.class)
                            .block();

            if (result.durationSec() != null) {
                upload.setDurationSec(BigDecimal.valueOf(result.durationSec()));
            }

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

    /**
     * Stands in for the real AI service call. A short sleep keeps the
     * upload visibly in PROCESSING for a couple of seconds — long enough
     * for the mobile app's WebSocket subscription/polling backstop to
     * observe the state transition, same as a real inference call would.
     */
    private AiDetectionResult runMockAnalysis(UUID uploadId) throws InterruptedException {
        Thread.sleep(2500 + (int) (Math.random() * 1500));
        return mockAiAnalysisService.analyze(uploadId);
    }

    private void pushStatus(Upload upload) {
        messagingTemplate.convertAndSend(
                "/topic/uploads." + upload.getId() + ".status",
                Map.of("uploadId", upload.getId().toString(), "status", upload.getStatus().name())
        );
    }

    /**
     * Mirrors the AI service's structured JSON response contract (see
     * docs/ARCHITECTURE.md). `title`/`recommendations` are populated by
     * {@link MockAiAnalysisService} today; a future real AI service response
     * that omits them just falls back to sensible defaults below.
     */
    public record AiDetectionResult(
            String videoId,
            Double durationSec,
            Integer framesAnalyzed,
            java.util.List<Violation> violations,
            Integer riskScore,
            Integer safetyScore,
            Map<String, Integer> summary,
            String title,
            java.util.List<String> recommendations
    ) {
        public AiDetectionResult {
            if (title == null) title = "AI Safety Audit";
            if (recommendations == null) recommendations = java.util.List.of();
        }

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
