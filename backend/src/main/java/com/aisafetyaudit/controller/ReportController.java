package com.aisafetyaudit.controller;

import com.aisafetyaudit.dto.report.ReportDetailResponse;
import com.aisafetyaudit.service.PdfReportService;
import com.aisafetyaudit.service.ReportQueryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Safety reports, violation timelines, and PDF export")
public class ReportController {

    private final ReportQueryService reportQueryService;
    private final PdfReportService pdfReportService;

    @GetMapping
    public ResponseEntity<List<ReportDetailResponse>> list(@RequestParam UUID factoryId) {
        return ResponseEntity.ok(reportQueryService.listForFactory(factoryId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportDetailResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(reportQueryService.getDetail(id));
    }

    @GetMapping(value = "/{id}/export", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> exportPdf(@PathVariable UUID id) {
        byte[] pdf = pdfReportService.generate(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(
                ContentDisposition.attachment().filename("safety-report-" + id + ".pdf").build());

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
