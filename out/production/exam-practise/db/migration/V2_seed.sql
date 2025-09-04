INSERT INTO users(email, password_hash, role)
VALUES ('admin@example.com', '$2a$10$3n8wE0bqK6U2J9P1b1o3Nel3H1y0o9x8i3b8b6D9V1n5d7PZb5Uvy', 'ADMIN');
-- a hash egy "Admin123!" jellegű jelszó PLACEHOLDER; később cseréld!


INSERT INTO resources(name, type, capacity, description) VALUES
                                                             ('A1 terem', 'ROOM', 30, 'Projektoros oktatóterem'),
                                                             ('B2 tárgyaló', 'ROOM', 8, 'Kis meetingekhez'),
                                                             ('Epson X200', 'PROJECTOR', NULL, 'HD projektor');
