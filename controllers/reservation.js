import db from "../config/db.js";

function isIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normalizeTimeToSql(value) {
  if (typeof value !== "string") return null;
  if (/^\d{2}:\d{2}:\d{2}$/.test(value)) return value;
  if (/^\d{2}:\d{2}$/.test(value)) return `${value}:00`;
  return null;
}

function addMinutesToTimeSql(heureDebutSql, dureeMinutes) {
  const [h, m, s] = heureDebutSql.split(":").map((x) => Number.parseInt(x, 10));
  const startSeconds = h * 3600 + m * 60 + s;
  const endSeconds = (startSeconds + dureeMinutes * 60) % (24 * 3600);
  const hh = String(Math.floor(endSeconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((endSeconds % 3600) / 60)).padStart(2, "0");
  const ss = String(endSeconds % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function formatDateYYYYMMDD(dateValue) {
  if (!dateValue) return null;
  if (typeof dateValue === "string") return dateValue.slice(0, 10);
  if (dateValue instanceof Date) return dateValue.toISOString().slice(0, 10);
  return String(dateValue);
}

export const creerReservation = (req, res) => {
  const id_adherent = req.user?.id;
  const { id_terrain, date_reservation, heure_debut, duree_minutes } = req.body ?? {};

  const parsedTerrain = Number.parseInt(id_terrain, 10);
  const parsedDuree = Number.parseInt(duree_minutes, 10);
  const heureDebutSql = normalizeTimeToSql(heure_debut);

  if (!id_adherent) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  if (
    !Number.isFinite(parsedTerrain) ||
    parsedTerrain <= 0 ||
    !isIsoDate(date_reservation) ||
    !heureDebutSql ||
    !Number.isFinite(parsedDuree) ||
    parsedDuree <= 0
  ) {
    return res.status(400).json({
      message: "Body invalide",
      attendu: {
        id_terrain: "int",
        date_reservation: "YYYY-MM-DD",
        heure_debut: "HH:MM:SS",
        duree_minutes: "int",
      },
    });
  }

  const heureFinSql = addMinutesToTimeSql(heureDebutSql, parsedDuree);

  // Pas de numero_reservation : on s'appuie sur id_reservation (AUTO_INCREMENT).
  // La réponse garde la clé numero_reservation pour l'app (même valeur que l'id).
  const insertSql =
    "INSERT INTO reservation (id_adherent, id_terrain, date_reservation, heure_debut, heure_fin) VALUES (?,?,?,?,?)";

  const params = [
    id_adherent,
    parsedTerrain,
    date_reservation,
    heureDebutSql,
    heureFinSql,
  ];

  db.query(insertSql, params, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur SQL", error: err.message });
    }

    const id = result.insertId;
    return res.status(201).json({
      message: "Réservation créée",
      numero_reservation: id,
      id_reservation: id,
    });
  });
};

export const mesReservations = (req, res) => {
  const id_adherent = req.user?.id;

  if (!id_adherent) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  const sql = `
    SELECT
      r.id_reservation,
      c.nom AS club,
      t.adresse AS terrain,
      r.date_reservation,
      r.heure_debut,
      r.heure_fin,
      COALESCE(m.status, 'prevu') AS statut
    FROM reservation r
    LEFT JOIN terrain t ON t.id_terrain = r.id_terrain
    LEFT JOIN club c ON c.id_club = t.id_club
    LEFT JOIN matchs m ON m.id_reservation = r.id_reservation
    WHERE r.id_adherent = ?
    ORDER BY r.date_reservation DESC, r.heure_debut DESC
  `;

  db.query(sql, [id_adherent], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Erreur SQL", error: err.message });
    }

    const payload = (rows ?? []).map((r) => ({
      numero_reservation: r.id_reservation,
      club: r.club ?? null,
      terrain: r.terrain ?? null,
      date: formatDateYYYYMMDD(r.date_reservation),
      heureDebut: r.heure_debut,
      heureFin: r.heure_fin,
      statut: r.statut ?? "prevu",
    }));

    return res.status(200).json(payload);
  });
};

