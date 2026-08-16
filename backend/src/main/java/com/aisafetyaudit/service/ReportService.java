package com.aisafetyaudit.service;

import com.aisafetyaudit.entity.Report;
import com.aisafetyaudit.entity.Upload;
import com.aisafetyaudit.entity.Violation;
import com.aisafetyaudit.repository.ReportRepository;
import com.aisafetyaudit.repository.ViolationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final ViolationRepository violationRepository;

    @Transactional
    public Report createFromDetectionResult(Upload upload, AiDetectionClient.AiDetectionResult result) {
        Report report = Report.builder()
                .upload(upload)
                .factory(upload.getFactory())
                .title(result.title())
                .riskScore(result.riskScore())
                .safetyScore(result.safetyScore())
                .summaryJson(result.summary())
                .recommendations(result.recommendations())
                .build();

        final Report savedReport = reportRepository.save(report);

        List<Violation> violations = result.violations().stream()
                .map(v -> toViolation(savedReport, v))
                .toList();

        violationRepository.saveAll(violations);

        return savedReport;
    }

    private Violation toViolation(Report report, AiDetectionClient.AiDetectionResult.Violation v) {
        var builder = Violation.builder()
                .report(report)
                .type(v.type())
                .severity(Violation.Severity.valueOf(v.severity()))
                .confidence(BigDecimal.valueOf(v.confidence()))
                .timestampSec(BigDecimal.valueOf(v.timestampSec()))
                .trackId(v.trackId());

        if (v.bbox() != null && v.bbox().size() == 4) {
            builder.bboxX(v.bbox().get(0))
                    .bboxY(v.bbox().get(1))
                    .bboxW(v.bbox().get(2))
                    .bboxH(v.bbox().get(3));
        }

        return builder.build();
    }
}
