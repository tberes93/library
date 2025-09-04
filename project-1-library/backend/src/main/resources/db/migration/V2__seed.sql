INSERT INTO users(email, password_hash, role)
VALUES ('admin@example.com', '$2a$10$3n8wE0bqK6U2J9P1b1o3Nel3H1y0o9x8i3b8b6D9V1n5d7PZb5Uvy', 'ADMIN');
-- a hash egy "Admin123!" jellegű jelszó PLACEHOLDER; később cseréld!


INSERT INTO books(title, writer, type, description) VALUES
                                                             ('Harry Potter és az Aszkabani fogoly','JK. Rowling', 'Scy-fi', 'Varázslók és boszorkányok'),
                                                             ('Vuk','Fekete István', 'Mese', 'Egyedül vagyok... kicsivagyok....'),
                                                             ('Biblia','Nemzedékek', 'Vallási', 'A könyvek könyve');
INSERT INTO users(email, password_hash, role)
VALUES ('user@example.com', '$2a$10$0T2mYFbdO7k5X3Y2u8n3Se3b2f1qJ9g7tGEqgYyKqf0g7vNnGJmO.', 'USER');
-- jelszó: User123!
