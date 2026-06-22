ALTER TABLE adherent
ADD COLUMN nombre_victoires INT UNSIGNED NOT NULL DEFAULT 0;

UPDATE adherent AS a
SET nombre_victoires = (
    SELECT COUNT(*)
    FROM matchs AS m
    INNER JOIN score AS s ON s.id_match = m.id_match
    WHERE (m.id_adherent_1 = a.id_adherent
           AND s.nb_but_adherent_1 > s.nb_but_adherent_2)
       OR (m.id_adherent_2 = a.id_adherent
           AND s.nb_but_adherent_2 > s.nb_but_adherent_1)
);
