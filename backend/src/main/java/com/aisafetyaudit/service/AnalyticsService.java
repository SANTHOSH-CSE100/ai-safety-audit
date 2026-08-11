package com.aisafetyaudit.service;

import com.aisafetyaudit.dto.analytics.AnalyticsSummaryResponse;
import com.aisafetyaudit.entity.Report;
import com.aisafetyaudit.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ReportRepository reportRepository;

    /**
     * Computes analytics on the fly from `reports`/`violations` for the
     * trailing `days` days (defaults to 30 from the controller). For larger
     * factories, swap this for pre-aggregated reads from
     * `analytics_snapshots` (populated by a nightly job).
     */
    public AnalyticsSummaryResponse summarize(UUID factoryId, int days) {
        Instant cutoff = Instant.now().minusSeconds((long) days * 24 * 3600);

        List<Report> reports = reportRepository.findByFactoryIdOrderByCreatedAtDesc(factoryId)
                .stream()
                .filter(r -> r.getCreatedAt().isAfter(cutoff))
                .toList();

        int totalUploads = reports.size();
        int totalViolations = reports.stream()
                .mapToInt(r -> r.getSummaryJson() == null ? 0 :
                        r.getSummaryJson().values().stream().mapToInt(Integer::intValue).sum())
                .sum();

        double avgSafetyScore = reports.stream()
                .mapToInt(Report::getSafetyScore)
                .average()
                .orElse(100.0);

        Map<String, Integer> breakdown = new HashMap<>();
        for (Report r : reports) {
            if (r.getSummaryJson() == null) continue;
            r.getSummaryJson().forEach((type, count) -> breakdown.merge(type, count, Integer::sum));
        }

        Map<String, List<Report>> byDay = reports.stream()
                .collect(Collectors.groupingBy(r ->
                        r.getCreatedAt().atZone(ZoneOffset.UTC).toLocalDate()
                                .format(DateTimeFormatter.ISO_LOCAL_DATE)));

        List<AnalyticsSummaryResponse.DailyPoint> trend = byDay.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> new AnalyticsSummaryResponse.DailyPoint(
                        e.getKey(),
                        e.getValue().size(),
                        e.getValue().stream().mapToInt(r -> r.getSummaryJson() == null ? 0 :
                                r.getSummaryJson().values().stream().mapToInt(Integer::intValue).sum()).sum(),
                        e.getValue().stream().mapToInt(Report::getSafetyScore).average().orElse(100.0)
                ))
                .toList();

        return new AnalyticsSummaryResponse(totalUploads, totalViolations, avgSafetyScore, breakdown, trend);
    }
}
