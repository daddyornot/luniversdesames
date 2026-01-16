-- Suppression au cas où pour éviter les doublons si tu relances souvent
-- CREATE TABLE IF NOT EXISTS PRODUCT (
-- id bigint primary key not null auto_increment,
-- name varchar(50),
-- description text,
-- price numeric,
-- stone varchar(50),
-- image_url varchar(200),
-- category varchar(100)
-- );

DELETE FROM product;

-- Insertion des Bracelets
INSERT INTO product (name, description, price, stone, image_url, category)
VALUES ('Aura de Quartz', 'Bracelet purificateur pour harmoniser les énergies.', 45.00, 'Quartz Rose',
        'assets/images/hoylee-song-TsbJvGJ0RwY-unsplash.jpg', 'bracelet'),
       ('Bouclier Noir', 'Protection intense contre les ondes négatives.', 49.00, 'Obsidienne',
        '/assets/images/alexey-demidov-WTKBeM7rGQE-unsplash.jpg', 'bracelet'),
       ('Sagesse Bleue', 'Favorise la communication et la clarté mentale.', 55.00, 'Lapis Lazuli',
        '/assets/images/assets/images/alexey-demidov-QRnUMyfhpgA-unsplash.jpg', 'bracelet');

-- Insertion des Prestations (Coaching & Tirages)
INSERT INTO product (name, description, price, stone, image_url, category)
VALUES ('Tirage de l''Âme', 'Session de 45 min pour éclairer votre chemin actuel.', 60.00, 'N/A',
        '/assets/images/wellness-285590_1280.jpg.webp', 'service'),
       ('Coaching Renaissance', 'Accompagnement holistique de 1h30 pour débloquer vos peurs.', 85.00, 'N/A',
        '/assets/images/pexels-ekaterina-bolovtsova-6766456.webp', 'service');
