-- Richer real-backend demo dataset. Purely additive (INSERT-only) — safe to
-- run on top of V2's single Chennai factory + demo users; nothing here
-- deletes or overwrites existing rows. Gives "real backend mode" meaningful
-- dashboard/factories/reports/analytics/notifications content out of the
-- box, before anyone has uploaded anything themselves. Every report here
-- mirrors one of MockAiAnalysisService's four templates so real-backend and
-- demo-fallback data read as part of the same coherent world.

INSERT INTO factories (id, name, location, timezone) VALUES
    ('11111111-1111-1111-1111-111111111112', 'Pune Assembly Plant', 'Chakan MIDC, Pune, Maharashtra, India', 'Asia/Kolkata'),
    ('11111111-1111-1111-1111-111111111113', 'Vizag Steel Fabrication Yard', 'Gajuwaka, Visakhapatnam, Andhra Pradesh, India', 'Asia/Kolkata');

-- Uploads -----------------------------------------------------------------

INSERT INTO uploads (id, factory_id, uploaded_by, file_key, original_name, duration_sec, status, created_at, updated_at) VALUES
    ('a1111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'uploads/seed-chennai-assembly-line-3.mp4', 'assembly-line-3-shift-A.mp4', 132.4, 'COMPLETED', now() - interval '6 days', now() - interval '6 days'),
    ('a1111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'uploads/seed-chennai-warehouse-sweep.mp4', 'warehouse-corridor-sweep.mp4', 98.0, 'COMPLETED', now() - interval '1 days', now() - interval '1 days'),
    ('a1111111-1111-1111-1111-111111111104', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222', 'uploads/seed-pune-press-shop.mp4', 'press-shop-floor-cam2.mp4', 176.2, 'COMPLETED', now() - interval '9 days', now() - interval '9 days'),
    ('a1111111-1111-1111-1111-111111111105', '11111111-1111-1111-1111-111111111113', '22222222-2222-2222-2222-222222222222', 'uploads/seed-vizag-crane-ops.mp4', 'crane-operations-cam1.mp4', 154.7, 'COMPLETED', now() - interval '2 days', now() - interval '2 days');

-- One FAILED upload with no report — demonstrates that state in the UI too.
INSERT INTO uploads (id, factory_id, uploaded_by, file_key, original_name, status, error_message, created_at, updated_at) VALUES
    ('a1111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'uploads/seed-chennai-packaging-floor.mp4', 'packaging-floor-walkthrough.mp4', 'FAILED', 'AI analysis timed out — please try re-uploading.', now() - interval '3 days', now() - interval '3 days');

-- Reports -------------------------------------------------------------------

-- Chennai upload 1 -> "PPE Compliance Audit" template (82/100)
INSERT INTO reports (id, upload_id, factory_id, risk_score, safety_score, title, summary_json, recommendations, created_at) VALUES
    ('b1111111-1111-1111-1111-111111111101', 'a1111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 18, 82, 'PPE Compliance Audit',
     '{"NO_HELMET":1,"MISSING_GLOVES":1,"IMPROPER_FOOTWEAR":1}'::jsonb,
     '["Provide refresher training on mandatory PPE before floor access.","Station a PPE compliance checkpoint at the assembly line entrance.","Restock helmet and glove dispensers near high-traffic zones."]'::jsonb,
     now() - interval '6 days');

INSERT INTO violations (report_id, type, severity, confidence, timestamp_sec, track_id) VALUES
    ('b1111111-1111-1111-1111-111111111101', 'NO_HELMET', 'HIGH', 0.910, 12.4, 1),
    ('b1111111-1111-1111-1111-111111111101', 'MISSING_GLOVES', 'MEDIUM', 0.850, 47.2, 2),
    ('b1111111-1111-1111-1111-111111111101', 'IMPROPER_FOOTWEAR', 'LOW', 0.780, 88.6, 3);

-- Chennai upload 2 -> "General Factory Safety Audit" template (94/100)
INSERT INTO reports (id, upload_id, factory_id, risk_score, safety_score, title, summary_json, recommendations, created_at) VALUES
    ('b1111111-1111-1111-1111-111111111102', 'a1111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111111', 6, 94, 'General Factory Safety Audit',
     '{"HOUSEKEEPING_ISSUE":1,"BLOCKED_SAFETY_PATHWAY":1}'::jsonb,
     '["Schedule a routine housekeeping sweep at shift changeover.","Keep marked walkways clear of stored materials at all times."]'::jsonb,
     now() - interval '1 days');

INSERT INTO violations (report_id, type, severity, confidence, timestamp_sec, track_id) VALUES
    ('b1111111-1111-1111-1111-111111111102', 'HOUSEKEEPING_ISSUE', 'LOW', 0.740, 15.0, 1),
    ('b1111111-1111-1111-1111-111111111102', 'BLOCKED_SAFETY_PATHWAY', 'LOW', 0.710, 40.2, 2);

-- Pune upload -> "Machinery Safety Audit" template (88/100)
INSERT INTO reports (id, upload_id, factory_id, risk_score, safety_score, title, summary_json, recommendations, created_at) VALUES
    ('b1111111-1111-1111-1111-111111111104', 'a1111111-1111-1111-1111-111111111104', '11111111-1111-1111-1111-111111111112', 12, 88, 'Machinery Safety Audit',
     '{"NEAR_MOVING_EQUIPMENT":1,"MISSING_PPE":1}'::jsonb,
     '["Extend machine guarding around the line''s moving components.","Reinforce mandatory PPE checks before machinery operation.","Add proximity sensors with audible alerts near high-risk equipment."]'::jsonb,
     now() - interval '9 days');

INSERT INTO violations (report_id, type, severity, confidence, timestamp_sec, track_id) VALUES
    ('b1111111-1111-1111-1111-111111111104', 'NEAR_MOVING_EQUIPMENT', 'HIGH', 0.880, 22.3, 1),
    ('b1111111-1111-1111-1111-111111111104', 'MISSING_PPE', 'MEDIUM', 0.800, 54.0, 2);

-- Vizag upload -> "Restricted Zone Audit" template (71/100)
INSERT INTO reports (id, upload_id, factory_id, risk_score, safety_score, title, summary_json, recommendations, created_at) VALUES
    ('b1111111-1111-1111-1111-111111111105', 'a1111111-1111-1111-1111-111111111105', '11111111-1111-1111-1111-111111111113', 29, 71, 'Restricted Zone Audit',
     '{"UNAUTHORIZED_ZONE_ENTRY":1,"NO_WARNING_SIGNAGE":1,"FORKLIFT_PROXIMITY":1}'::jsonb,
     '["Install physical barriers around the restricted zone perimeter.","Add illuminated warning signage at all restricted-zone entry points.","Retrain floor staff on minimum safe distance from active machinery."]'::jsonb,
     now() - interval '2 days');

INSERT INTO violations (report_id, type, severity, confidence, timestamp_sec, track_id) VALUES
    ('b1111111-1111-1111-1111-111111111105', 'UNAUTHORIZED_ZONE_ENTRY', 'HIGH', 0.930, 5.1, 1),
    ('b1111111-1111-1111-1111-111111111105', 'NO_WARNING_SIGNAGE', 'MEDIUM', 0.820, 33.7, 2),
    ('b1111111-1111-1111-1111-111111111105', 'FORKLIFT_PROXIMITY', 'CRITICAL', 0.960, 61.9, 3);

-- Notifications ---------------------------------------------------------

INSERT INTO notifications (user_id, title, body, is_read, related_report_id, created_at) VALUES
    ('22222222-2222-2222-2222-222222222222', 'Safety report ready', 'Report for "warehouse-corridor-sweep.mp4" is ready — safety score 94/100.', false, 'b1111111-1111-1111-1111-111111111102', now() - interval '1 days'),
    ('22222222-2222-2222-2222-222222222222', 'Critical violation detected', 'Forklift proximity violation flagged at Vizag Steel Fabrication Yard.', false, 'b1111111-1111-1111-1111-111111111105', now() - interval '2 days'),
    ('22222222-2222-2222-2222-222222222222', 'Processing failed', 'We couldn''t process "packaging-floor-walkthrough.mp4". Please try re-uploading.', true, NULL, now() - interval '3 days'),
    ('22222222-2222-2222-2222-222222222222', 'Safety report ready', 'Report for "assembly-line-3-shift-A.mp4" is ready — safety score 82/100.', true, 'b1111111-1111-1111-1111-111111111101', now() - interval '6 days'),
    ('22222222-2222-2222-2222-222222222222', 'Safety report ready', 'Report for "press-shop-floor-cam2.mp4" is ready — safety score 88/100.', true, 'b1111111-1111-1111-1111-111111111104', now() - interval '9 days');
