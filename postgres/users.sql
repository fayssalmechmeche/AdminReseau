CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) 
);

INSERT INTO users (name, email) VALUES
('Fayssal', 'oui@non.dsl'),
('Frederic', 'peut@etre.pas'),
('Ryan', 'je@sais.pas');
