import db from "../config/db.js"

//  Visualisation des Chasuble  //
export const stockChasuble = (req, res) => {

    // --- Récupération de l'id du club depuis le middleware ---
    const id = req.user.id

    const sql = `
                SELECT * FROM equipements 
                  WHERE id_club = (SELECT id_club 
                                                from adherent 
                                                WHERE id_adherent = ?) 
                    AND 
                        equipement = "chasuble";
                `

    db.query(sql, id, (err, results) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")
        }else {
            return res.json(results)
            
        }
    })
}

//  Visualisation des Crampons  //
export const stockCrampon = (req, res) => {

    // --- Récupération de l'id du club depuis le middleware ---
    const id = req.user.id

    const sql = `
                SELECT * FROM equipements 
                  WHERE id_club = (SELECT id_club 
                                                from adherent 
                                                WHERE id_adherent = ?) 
                    AND 
                        equipement = "crampon";
                `

    db.query(sql, id, (err, results) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")
        }else {
            return res.json(results)
            
        }
    })
}



//  Visualisation des Ballons  //
export const stockBallon = (req, res) => {

    // --- Récupération de l'id du club depuis le middleware ---
    const id = req.user.id

    const sql = `
                SELECT * FROM equipements 
                  WHERE id_club = (SELECT id_club 
                                                from adherent 
                                                WHERE id_adherent = ?) 
                    AND 
                        equipement = "ballon";
                `
    

    db.query(sql, id, (err, results) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")
        }else {
            return res.json(results)
            
        }
    })
}



// Ajouter un équipement
export const ajouterEquipement = (req, res) => {
    const { type, quantite, id_terrain } = req.body // Récupère les données envoyées
    const id = req.user.id // ID de l'utilisateur connecté

    const typesAutorises = ["ballon", "chasuble", "crampon"]
    const typeNormalise = String(type || "").toLowerCase().trim()
    const qte = Number(quantite)
    const terrainId = Number(id_terrain)

    // Vérifications
    if (!typesAutorises.includes(typeNormalise)) return res.status(400).json({ message: "Type invalide." })
    if (!Number.isFinite(qte) || qte <= 0) return res.status(400).json({ message: "Quantite invalide." })
    if (!Number.isInteger(terrainId) || terrainId <= 0) return res.status(400).json({ message: "Terrain invalide." })

    // Insère l’équipement dans la table
    const sql = `
        INSERT INTO equipements (id_equipement, equipement, stock_base, stock_current, id_terrain, id_club)
        SELECT
            (SELECT COALESCE(MAX(id_equipement), 0) + 1 FROM equipements),
            ?, ?, ?, t.id_terrain, a.id_club
        FROM adherent a
        INNER JOIN terrain t ON t.id_terrain = ? AND t.id_club = a.id_club
        WHERE a.id_adherent = ?;
    `
// Exécute la requête pour ajouter l’équipement et gère les erreurs ou succès
    db.query(sql, [typeNormalise, qte, qte, terrainId, id], (err, result) => {
        if (err) return res.status(500).json({ message: "Erreur SQL.", detail: err.sqlMessage })
        if (!result || result.affectedRows === 0) return res.status(400).json({ message: "Utilisateur, club ou terrain introuvable." })
        return res.status(201).json({ message: "Equipement ajoute." })
    })
}

// Lister les équipements du club
export const listerEquipements = (req, res) => {
    const id = req.user.id
// Requête SQL pour lister les équipements du club
    const sql = `
        SELECT id_equipement, equipement, stock_current
        FROM equipements
        WHERE id_club = (
            SELECT id_club
            FROM adherent
            WHERE id_adherent = ?
        )
        ORDER BY id_equipement DESC;
    `
    // Exécute la requête pour ajouter l’équipement et gère les erreurs ou succès

    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ message: "Erreur SQL." })
        return res.status(200).json(results)
    })
}

// Supprimer un équipement
export const supprimerEquipement = (req, res) => {
    const { id } = req.params
    const idAdherent = req.user.id

    // Requête SQL pour supprimer un équipement qui appartient au même club que l'utilisateur connecté
    const sql = `
        DELETE FROM equipements
        WHERE id_equipement = ?
          AND id_club = (
              SELECT id_club
              FROM adherent
              WHERE id_adherent = ?
          )
    `

    // Exécute la requête pour supprimer un équipement et gère les erreurs ou succès
    db.query(sql, [id, idAdherent], (err, result) => {
        if (err) return res.status(500).json({ message: "Erreur SQL." })
        if (!result || result.affectedRows === 0) return res.status(404).json({ message: "Equipement introuvable ou non autorisé." })
        return res.status(200).json({ message: "Equipement supprime." })
    })
}