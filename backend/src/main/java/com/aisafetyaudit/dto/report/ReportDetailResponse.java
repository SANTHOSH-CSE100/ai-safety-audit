package com.aisafetyaudit.dto.report;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record ReportDetailResponse(
        UUID id,
        UUID uploadId,
        int riskScore,
        int safetyScore,
        Map<String, Integer> summary,
        List<ViolationResponse> violations,
        Instant createdAt
) {
    public record ViolationResponse(
            UUID id,
            String type,
            String severity,
            double confidence,
            double timestampSec,
            Integer trackId
    ) {}
}
