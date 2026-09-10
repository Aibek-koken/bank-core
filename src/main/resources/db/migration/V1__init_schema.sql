CREATE TABLE accounts (
    id              BIGSERIAL PRIMARY KEY,
    account_number  VARCHAR(20) NOT NULL UNIQUE,
    owner_name      VARCHAR(255) NOT NULL,
    balance         DECIMAL(19, 4) NOT NULL DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE transactions (
    id              BIGINT PRIMARY KEY,
    from_account_id BIGINT REFERENCES accounts(id),
    to_account_id   BIGINT NOT NULL REFERENCES accounts(id),
    amount          DECIMAL(19, 4) NOT NULL,
    status          VARCHAR(20) NOT NULL,
    type            VARCHAR(20) NOT NULL DEFAULT 'TRANSFER',
    description     VARCHAR(500),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id          BIGSERIAL PRIMARY KEY,
    action      VARCHAR(50) NOT NULL,
    account_id  BIGINT,
    details     TEXT,
    thread_name VARCHAR(100),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_from ON transactions(from_account_id);
CREATE INDEX idx_transactions_to   ON transactions(to_account_id);
CREATE INDEX idx_audit_account     ON audit_logs(account_id);
CREATE INDEX idx_audit_created     ON audit_logs(created_at);