import db from "../config/db.js"
import 'dotenv/config'

// Fonction pour générer un numéro de réservation aléatoire
const generateReservationNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

// ----- Créer une réservation ----- //
export const creerReservation = (req, res) => {
    const { id_terrain, date_reservation, heure_debut, duree_minutes } = req.body;
    const id_adherent = req.user.id;

    // Calculer l'heure de fin
    const [hours, minutes] = heure_debut.split(':').map(Number);
    const startDate = new Date(2000, 0, 1, hours, minutes);
    startDate.setMinutes(startDate.getMinutes() + duree_minutes);
    const heure_fin = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}:00`;

    // Vérifier que le terrain existe et récupérer son club
    const checkTerrainSql = `SELECT id_club FROM terrain WHERE id_terrain = ?`;
    
    db.query(checkTerrainSql, [id_terrain], (err, terrainResult) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la vérification du terrain" });
        }

        if (terrainResult.length === 0) {
            return res.status(404).json({ message: "Terrain non trouvé" });
        }

        // Vérifier que l'utilisateur appartient au club du terrain ou est adhérent
        const checkUserSql = `SELECT id_club FROM adherent WHERE id_adherent = ?`;
        
        db.query(checkUserSql, [id_adherent], (err, userResult) => {
            if (err) {
                return res.status(500).json({ message: "Erreur lors de la vérification de l'utilisateur" });
            }

            // Vérifier la disponibilité du terrain à cette heure
            const checkAvailabilitySql = `
                SELECT COUNT(*) as count FROM reservation 
                WHERE id_terrain = ? 
                AND date_reservation = ? 
                AND (
                    (heure_debut < ? AND heure_fin > ?) OR
                    (heure_debut < ? AND heure_fin > ?)
                )
            `;

            db.query(checkAvailabilitySql, [id_terrain, date_reservation, heure_fin, heure_debut, heure_fin, heure_debut], (err, availabilityResult) => {
                if (err) {
                    return res.status(500).json({ message: "Erreur lors de la vérification de disponibilité" });
                }

                if (availabilityResult[0].count > 0) {
                    return res.status(409).json({ message: "Ce créneau n'est pas disponible" });
                }

                // Générer le numéro de réservation
                const numero_reservation = generateReservationNumber();

                // Créer la réservation
                const createReservationSql = `
                    INSERT INTO reservation (id_adherent, id_terrain, date_reservation, heure_debut, heure_fin, numero_reservation)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;

                db.query(createReservationSql, [id_adherent, id_terrain, date_reservation, heure_debut, heure_fin, numero_reservation], (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: "Erreur lors de la création de la réservation" });
                    }

                    const id_reservation = result.insertId;

                    // Ajouter l'utilisateur à la table adherent_reservation
                    const addAdherentReservationSql = `
                        INSERT INTO adherent_reservation (id_adherent, id_reservation)
                        VALUES (?, ?)
                    `;

                    db.query(addAdherentReservationSql, [id_adherent, id_reservation], (err) => {
                        if (err) {
                            return res.status(500).json({ message: "Erreur lors de l'ajout à la réservation" });
                        }

                        return res.json({
                            success: true,
                            message: "Réservation créée avec succès",
                            numero_reservation: numero_reservation,
                            id_reservation: id_reservation
                        });
                    });
                });
            });
        });
    });
};


