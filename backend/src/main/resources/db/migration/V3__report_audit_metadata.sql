-- Additive columns for report metadata: the audit template name (title) and
-- a short list of follow-up recommendations. Both are nullable so existing
-- rows (if any) remain valid; no data is modified or removed.

ALTER TABLE reports ADD COLUMN title VARCHAR(150);
ALTER TABLE reports ADD COLUMN recommendations JSONB;
