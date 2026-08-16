package com.aisafetyaudit.config;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class StorageConfig {

    @Value("${app.storage.minio.endpoint}")
    private String endpoint;

    @Value("${app.storage.minio.access-key}")
    private String accessKey;

    @Value("${app.storage.minio.secret-key}")
    private String secretKey;

    @Value("${app.storage.minio.bucket}")
    private String bucket;

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
    }

    /**
     * A freshly started MinIO container has no buckets at all — without this,
     * the very first real video upload would fail with "bucket does not
     * exist" before an Upload row is even created. This creates the bucket
     * once at startup if it's missing; it's a no-op (and harmless) on every
     * subsequent restart since it only touches bucket metadata, never data.
     */
    @Bean
    public CommandLineRunner ensureStorageBucket(MinioClient client) {
        return args -> {
            try {
                boolean exists = client.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
                if (!exists) {
                    client.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
                    log.info("Created MinIO bucket '{}'", bucket);
                }
            } catch (Exception e) {
                // Don't fail startup over this — storeVideo() will surface a
                // clear error on first upload if MinIO is genuinely down.
                log.warn("Could not verify/create MinIO bucket '{}' at startup: {}", bucket, e.getMessage());
            }
        };
    }
}
