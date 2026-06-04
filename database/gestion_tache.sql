CREATE TABLE taches (
    id SERIAL PRIMARY KEY,
    texte VARCHAR(255) NOT NULL,
    termine BOOLEAN DEFAULT false
);