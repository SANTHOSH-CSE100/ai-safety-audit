package com.aisafetyaudit.service;

import com.aisafetyaudit.dto.report.ReportDetailResponse;
import com.aisafetyaudit.entity.Report;
import com.aisafetyaudit.entity.Violation;
import com.aisafetyaudit.exception.ResourceNotFoundException;
import com.aisafetyaudit.repository.ReportRepository;
import com.aisafetyaudit.repository.ViolationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReportQueryService {

    private final ReportRepository reportRepository;
    private final ViolationRepository violationRepository;

    public ReportDetailResponse getDetail(UUID reportId) {
        Report report = findEntity(reportId);
        List<Violation> violations = violationRepository.findByReportId(reportId);
        return toDetail(report, violations);
    }

    public List<ReportDetailResponse> listForFactory(UUID factoryId) {
        return reportRepository.findByFactoryIdOrderByCreatedAtDesc(factoryId).stream()
                .map(r -> toDetail(r, violationRepository.findByReportId(r.getId())))
                .toList();
    }

    Report findEntity(UUID id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + id));
    }

    private ReportDetailResponse toDetail(Report r, List<Violation> violations) {
        var violationDtos = violations.stream()
                .map(v -> new ReportDetailResponse.ViolationResponse(
                        v.getId(), v.getType(), v.getSeverity().name(),
                        v.getConfidence().doubleValue(), v.getTimestampSec().doubleValue(), v.getTrackId()))
                .toList();

        return new ReportDetailResponse(
                r.getId(), r.getUpload().getId(), r.getRiskScore(), r.getSafetyScore(),
                r.getSummaryJson(), violationDtos, r.getCreatedAt());
    }
}
