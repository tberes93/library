CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       role VARCHAR(32) NOT NULL
);


CREATE TABLE resources (
                           id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                           name VARCHAR(120) NOT NULL,
                           type VARCHAR(60) NOT NULL,
                           capacity INT,
                           description TEXT
);


CREATE TABLE bookings (
                          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                          resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
                          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                          start_ts TIMESTAMP WITHOUT TIME ZONE NOT NULL,
                          end_ts TIMESTAMP WITHOUT TIME ZONE NOT NULL,
                          status VARCHAR(32) NOT NULL
);


CREATE INDEX idx_bookings_resource_time ON bookings(resource_id, start_ts, end_ts);
