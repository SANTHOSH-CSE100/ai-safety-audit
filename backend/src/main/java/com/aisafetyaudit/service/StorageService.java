package com.aisafetyaudit.service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StorageService {

    private final MinioClient minioClient;

    @Value("${app.storage.minio.bucket}")
    private String bucket;

    public String storeVideo(MultipartFile file) {
        String objectKey = "uploads/%s-%s".formatted(UUID.randomUUID(), file.getOriginalFilename());

        try (InputStream is = file.getInputStream()) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectKey)
                            .stream(is, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to store video {}", file.getOriginalFilename(), e);
            throw new RuntimeException("Failed to store uploaded video", e);
        }

        return objectKey;
    }

    public String storeReportPdf(UUID reportId, byte[] pdfBytes) {
        String objectKey = "reports/%s.pdf".formatted(reportId);

        try (InputStream is = new ByteArrayInputStream(pdfBytes)) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectKey)
                            .stream(is, pdfBytes.length, -1)
                            .contentType("application/pdf")
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to store report PDF for report {}", reportId, e);
            throw new RuntimeException("Failed to store report PDF", e);
        }

        return objectKey;
    }
}
