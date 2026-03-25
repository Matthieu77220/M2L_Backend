-- Migration: ajouter la colonne manquante `numero_reservation` sur `reservation`
-- À exécuter sur la base définie dans .env (ex: m2l), via phpMyAdmin ou mysql CLI.
--
-- Erreur résolue: "Champ 'numero_reservation' inconnu dans field list"

-- 1) Ajouter la colonne (nullable d'abord si des lignes existent déjà)
ALTER TABLE reservation
  ADD COLUMN numero_reservation INT(6) NULL AFTER heure_fin;

-- 2) Remplir les réservations existantes (code 6 chiffres unique basé sur l'id)
UPDATE reservation
SET numero_reservation = LEAST(999999, GREATEST(100000, 100000 + id_reservation))
WHERE numero_reservation IS NULL;

-- 3) Contraintes comme dans m2l.sql
ALTER TABLE reservation
  MODIFY numero_reservation INT(6) NOT NULL;

ALTER TABLE reservation
  ADD UNIQUE KEY reservation_numero_unique (numero_reservation);
