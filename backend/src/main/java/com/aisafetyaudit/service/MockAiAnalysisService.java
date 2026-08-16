package com.aisafetyaudit.service;

import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

/**
 * Generates a realistic, self-consistent safety report WITHOUT calling the
 * (optional) Python AI service. This is what makes the demo upload → report
 * flow work with just `postgres redis minio` running — see
 * AiDetectionClient#submitForProcessing, which calls this instead of the
 * real WebClient whenever `app.ai-service.mock-enabled=true` (the default).
 *
 * The template + all per-violation values are derived deterministically from
 * the upload id, so re-fetching the same report always returns the same
 * data, but different uploads land on different templates/values — it is
 * NOT the same canned report every time.
 */
@Service
public class MockAiAnalysisService {

    private record ViolationSpec(String type, String severity, double confidence, double timestampSec) {}

    private record Template(String title, int safetyScore, List<ViolationSpec> violations, List<String> recommendations) {}

    private static final List<Template> TEMPLATES = List.of(
            new Template(
                    "PPE Compliance Audit",
                    82,
                    List.of(
                            new ViolationSpec("NO_HELMET", "HIGH", 0.91, 12.4),
                            new ViolationSpec("MISSING_GLOVES", "MEDIUM", 0.85, 47.2),
                            new ViolationSpec("IMPROPER_FOOTWEAR", "LOW", 0.78, 88.6)
                    ),
                    List.of(
                            "Provide refresher training on mandatory PPE before floor access.",
                            "Station a PPE compliance checkpoint at the assembly line entrance.",
                            "Restock helmet and glove dispensers near high-traffic zones."
                    )
            ),
            new Template(
                    "Restricted Zone Audit",
                    71,
                    List.of(
                            new ViolationSpec("UNAUTHORIZED_ZONE_ENTRY", "HIGH", 0.93, 5.1),
                            new ViolationSpec("NO_WARNING_SIGNAGE", "MEDIUM", 0.82, 33.7),
                            new ViolationSpec("FORKLIFT_PROXIMITY", "CRITICAL", 0.96, 61.9)
                    ),
                    List.of(
                            "Install physical barriers around the restricted zone perimeter.",
                            "Add illuminated warning signage at all restricted-zone entry points.",
                            "Retrain floor staff on minimum safe distance from active machinery."
                    )
            ),
            new Template(
                    "Machinery Safety Audit",
                    88,
                    List.of(
                            new ViolationSpec("NEAR_MOVING_EQUIPMENT", "HIGH", 0.88, 22.3),
                            new ViolationSpec("MISSING_PPE", "MEDIUM", 0.80, 54.0)
                    ),
                    List.of(
                            "Extend machine guarding around the line's moving components.",
                            "Reinforce mandatory PPE checks before machinery operation.",
                            "Add proximity sensors with audible alerts near high-risk equipment."
                    )
            ),
            new Template(
                    "General Factory Safety Audit",
                    94,
                    List.of(
                            new ViolationSpec("HOUSEKEEPING_ISSUE", "LOW", 0.74, 15.0),
                            new ViolationSpec("BLOCKED_SAFETY_PATHWAY", "LOW", 0.71, 40.2)
                    ),
                    List.of(
                            "Schedule a routine housekeeping sweep at shift changeover.",
                            "Keep marked walkways clear of stored materials at all times."
                    )
            )
    );

    public AiDetectionClient.AiDetectionResult analyze(UUID uploadId) {
        Template template = TEMPLATES.get(Math.floorMod(uploadId.hashCode(), TEMPLATES.size()));
        // Seeded from the upload id so results are stable across re-reads of
        // the same upload, but vary from one upload to the next.
        Random rnd = new Random(uploadId.getMostSignificantBits());

        double durationSec = round1(45 + rnd.nextInt(180));
        int framesAnalyzed = (int) Math.round(durationSec * 24);

        Map<String, Integer> summary = new LinkedHashMap<>();
        int trackId = 1;
        java.util.List<AiDetectionClient.AiDetectionResult.Violation> violations = new java.util.ArrayList<>();
        for (ViolationSpec spec : template.violations()) {
            double confidence = clamp(spec.confidence() + (rnd.nextDouble() - 0.5) * 0.06, 0.5, 0.99);
            double timestampSec = Math.max(1, spec.timestampSec() + (rnd.nextDouble() - 0.5) * 4);

            violations.add(new AiDetectionClient.AiDetectionResult.Violation(
                    spec.type(),
                    round3(confidence),
                    round1(timestampSec),
                    null,
                    trackId++,
                    spec.severity()
            ));
            summary.merge(spec.type(), 1, Integer::sum);
        }

        int riskScore = 100 - template.safetyScore();

        return new AiDetectionClient.AiDetectionResult(
                uploadId.toString(),
                durationSec,
                framesAnalyzed,
                violations,
                riskScore,
                template.safetyScore(),
                summary,
                template.title(),
                template.recommendations()
        );
    }

    private static double clamp(double v, double min, double max) {
        return Math.max(min, Math.min(max, v));
    }

    private static double round1(double v) {
        return Math.round(v * 10) / 10.0;
    }

    private static double round3(double v) {
        return Math.round(v * 1000) / 1000.0;
    }
}
