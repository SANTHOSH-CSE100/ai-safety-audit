-- AI Safety Audit — Initial Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE roles (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(50) NOT NULL UNIQUE,           -- ADMIN, SAFETY_OFFICER, VIEWER
    description VARCHAR(255)
);

CREATE TABLE factories (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(150) NOT NULL,
    location    VARCHAR(255),
    timezone    VARCHAR(50) DEFAULT 'Asia/Kolkata',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(150) NOT NULL,
    role_id         UUID NOT NULL REFERENCES roles(id),
    factory_id      UUID REFERENCES factories(id),
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE uploads (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    factory_id      UUID NOT NULL REFERENCES factories(id),
    uploaded_by     UUID NOT NULL REFERENCES users(id),
    file_key        VARCHAR(500) NOT NULL,             -- object storage key
    original_name   VARCHAR(255),
    duration_sec    NUMERIC(10,2),
    status          VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED
    error_message    TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    upload_id       UUID NOT NULL REFERENCES uploads(id),
    factory_id      UUID NOT NULL REFERENCES factories(id),
    risk_score      SMALLINT NOT NULL,
    safety_score    SMALLINT NOT NULL,
    summary_json    JSONB,
    pdf_key         VARCHAR(500),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE violations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id       UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    type            VARCHAR(60) NOT NULL,               -- NO_HELMET, NO_VEST, FIRE, RESTRICTED_AREA...
    severity        VARCHAR(20) NOT NULL,                -- LOW, MEDIUM, HIGH, CRITICAL
    confidence      NUMERIC(4,3) NOT NULL,
    timestamp_sec   NUMERIC(10,2) NOT NULL,
    bbox_x          INT, bbox_y INT, bbox_w INT, bbox_h INT,
    track_id        INT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE timeline_events (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id       UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    violation_id    UUID REFERENCES violations(id),
    event_type      VARCHAR(60) NOT NULL,
    description     VARCHAR(500),
    timestamp_sec   NUMERIC(10,2) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    title           VARCHAR(150) NOT NULL,
    body            VARCHAR(500),
    is_read         BOOLEAN NOT NULL DEFAULT false,
    related_report_id UUID REFERENCES reports(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE analytics_snapshots (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    factory_id      UUID NOT NULL REFERENCES factories(id),
    snapshot_date   DATE NOT NULL,
    total_uploads   INT NOT NULL DEFAULT 0,
    total_violations INT NOT NULL DEFAULT 0,
    avg_safety_score NUMERIC(5,2),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(factory_id, snapshot_date)
);

CREATE TABLE settings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    factory_id      UUID NOT NULL REFERENCES factories(id) UNIQUE,
    settings_json   JSONB NOT NULL DEFAULT '{}',
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id),
    action          VARCHAR(100) NOT NULL,
    entity_type     VARCHAR(100),
    entity_id       UUID,
    metadata_json   JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_uploads_factory ON uploads(factory_id);
CREATE INDEX idx_uploads_status ON uploads(status);
CREATE INDEX idx_violations_report ON violations(report_id);
CREATE INDEX idx_timeline_report ON timeline_events(report_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

INSERT INTO roles (name, description) VALUES
    ('ADMIN', 'Full platform access'),
    ('SAFETY_OFFICER', 'Can upload footage and manage reports for their factory'),
    ('VIEWER', 'Read-only dashboard access');
