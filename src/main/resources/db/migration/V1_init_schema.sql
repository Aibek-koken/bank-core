CREATE TABLE accounts(
    id BIGINT primary key,
    account_number varchar(20) NOT NULL UNIQUE,
    owner_name      varchar(255) not null,
    balance DECIMAL(19,4) NOT NUL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
)

CREATE TABLE transactions(
    id BIGINT PRIMARY KEY,
    from_account_id BIGINT REFERENCES accounts(id),
    to_account_id BIGINT REFERENCES accounts(id),
    amount  DECIMAL(19,4) NOT NULL,
    status VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'TRANSFER',
    description VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_from ON transactions(from_account_id)
CREATE INDEX idx_transactions_to ON transactions(to_account_id);