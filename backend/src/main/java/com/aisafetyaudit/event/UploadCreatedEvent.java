package com.aisafetyaudit.event;

import java.util.UUID;

/**
 * Published once a new Upload row has been saved. AI processing (mock or
 * real) listens for this AFTER the surrounding transaction commits — see
 * AiDetectionClient#onUploadCreated — rather than being called directly from
 * UploadService, so the async worker never races the INSERT's commit and
 * tries to read a row that isn't visible yet.
 */
public record UploadCreatedEvent(UUID uploadId, String objectKey) {}
