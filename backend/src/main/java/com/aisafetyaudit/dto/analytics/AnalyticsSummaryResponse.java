package com.aisafetyaudit.dto.analytics;

import java.util.List;
import java.util.Map;

public record AnalyticsSummaryResponse(
        int totalUploadsLast30Days,
        int totalViolationsLast30Days,
        double avgSafetyScoreLast30Days,
        Map<String, Integer> violationBreakdown,
        List<DailyPoint> trend
) {
    public record DailyPoint(String date, int uploads, int violations, double avgSafetyScore) {}
}
