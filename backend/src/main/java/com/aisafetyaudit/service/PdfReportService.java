package com.aisafetyaudit.service;

import com.aisafetyaudit.dto.report.ReportDetailResponse;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PdfReportService {

    private final ReportQueryService reportQueryService;

    private static final Font TITLE_FONT = new Font(Font.HELVETICA, 20, Font.BOLD);
    private static final Font HEADING_FONT = new Font(Font.HELVETICA, 13, Font.BOLD);
    private static final Font BODY_FONT = new Font(Font.HELVETICA, 10, Font.NORMAL);
    private static final Font BODY_BOLD_FONT = new Font(Font.HELVETICA, 10, Font.BOLD);

    public byte[] generate(java.util.UUID reportId) {
        ReportDetailResponse report = reportQueryService.getDetail(reportId);

        Document document = new Document(PageSize.A4, 40, 40, 50, 50);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            document.add(new Paragraph(
                    report.title() != null && !report.title().isBlank() ? report.title() : "AI Safety Audit — Safety Report",
                    TITLE_FONT));
            document.add(new Paragraph(
                    "Generated: " + DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm 'UTC'")
                            .withZone(ZoneOffset.UTC).format(report.createdAt()),
                    BODY_FONT));
            document.add(Chunk.NEWLINE);

            addScoreSummary(document, report);
            document.add(Chunk.NEWLINE);

            addViolationBreakdown(document, report);
            document.add(Chunk.NEWLINE);

            addViolationTable(document, report);
            document.add(Chunk.NEWLINE);

            addRecommendations(document, report);

        } catch (DocumentException e) {
            throw new RuntimeException("Failed to generate PDF report", e);
        } finally {
            document.close();
        }

        return out.toByteArray();
    }

    private void addScoreSummary(Document document, ReportDetailResponse report) throws DocumentException {
        document.add(new Paragraph("Overview", HEADING_FONT));

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(60);
        table.setSpacingBefore(8);

        addRow(table, "Safety Score", report.safetyScore() + " / 100");
        addRow(table, "Risk Score", report.riskScore() + " / 100");
        addRow(table, "Total Violations", String.valueOf(report.violations().size()));

        document.add(table);
    }

    private void addViolationBreakdown(Document document, ReportDetailResponse report) throws DocumentException {
        if (report.summary() == null || report.summary().isEmpty()) return;

        document.add(new Paragraph("Violation Breakdown", HEADING_FONT));
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(60);
        table.setSpacingBefore(8);

        for (Map.Entry<String, Integer> entry : report.summary().entrySet()) {
            addRow(table, entry.getKey().replace('_', ' '), String.valueOf(entry.getValue()));
        }

        document.add(table);
    }

    private void addViolationTable(Document document, ReportDetailResponse report) throws DocumentException {
        document.add(new Paragraph("Detailed Violation Timeline", HEADING_FONT));

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setSpacingBefore(8);
        table.setWidths(new float[]{2.5f, 1.5f, 1.5f, 1.5f});

        for (String header : new String[]{"Type", "Severity", "Confidence", "Timestamp (s)"}) {
            PdfPCell cell = new PdfPCell(new Phrase(header, BODY_BOLD_FONT));
            cell.setBackgroundColor(new Color(230, 230, 230));
            cell.setPadding(6);
            table.addCell(cell);
        }

        for (var v : report.violations()) {
            table.addCell(cellOf(v.type().replace('_', ' ')));
            table.addCell(cellOf(v.severity()));
            table.addCell(cellOf(String.format("%.0f%%", v.confidence() * 100)));
            table.addCell(cellOf(String.format("%.1f", v.timestampSec())));
        }

        document.add(table);
    }

    private void addRecommendations(Document document, ReportDetailResponse report) throws DocumentException {
        if (report.recommendations() == null || report.recommendations().isEmpty()) return;

        document.add(new Paragraph("Recommendations", HEADING_FONT));
        com.lowagie.text.List list = new com.lowagie.text.List(com.lowagie.text.List.UNORDERED);
        list.setIndentationLeft(18);
        for (String recommendation : report.recommendations()) {
            list.add(new com.lowagie.text.ListItem(recommendation, BODY_FONT));
        }
        document.add(list);
    }

    private PdfPCell cellOf(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, BODY_FONT));
        cell.setPadding(5);
        return cell;
    }

    private void addRow(PdfPTable table, String label, String value) {
        table.addCell(cellOf(label));
        table.addCell(new PdfPCell(new Phrase(value, BODY_BOLD_FONT)));
    }
}
