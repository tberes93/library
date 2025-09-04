CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       role VARCHAR(32) NOT NULL
);


CREATE TABLE books (
                           id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                           title VARCHAR(120) NOT NULL,
                           writer VARCHAR(120) NOT NULL,
                           type VARCHAR(60) NOT NULL,
                           description TEXT
);


CREATE TABLE borrows (
                          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                          book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
                          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                          start_ts TIMESTAMP WITHOUT TIME ZONE NOT NULL,
                          end_ts TIMESTAMP WITHOUT TIME ZONE NOT NULL,
                          status VARCHAR(32) NOT NULL
);


CREATE INDEX idx_borrows_book_time ON borrows(book_id, start_ts, end_ts);
