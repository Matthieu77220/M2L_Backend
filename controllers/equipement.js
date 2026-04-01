import db from "../config/db.js"

// ----- Visualisation des Chasubles ----- //
export const stockChasuble = (req, res) => {

    const id_adherent = req.user.id

    const sqlClub = `
        SELECT id_club 
        FROM adherent 
        WHERE id_adherent = ?
    `

    const sql = `
        SELECT equipements.equipement, equipements.stock_base, equipements.stock_current, terrain.adresse
        FROM terrain
        LEFT JOIN equipements 
            ON equipements.id_terrain = terrain.id_terrain
        WHERE terrain.id_club = ? AND equipements.equipement = 'chasuble';
    `

    db.query(sqlClub, id_adherent, (err, results) => {
        if (err) return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")

        const id_club = results[0].id_club

        db.query(sql, id_club, (err, results) => {
            if (err) {
                return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")
            }

            if (results) {
                return res.json(results)
            }
        })
    })
}

// ----- Visualisation des Crampons ----- //
export const stockCrampon = (req, res) => {

    const id_adherent = req.user.id

    const sqlClub = `
        SELECT id_club 
        FROM adherent 
        WHERE id_adherent = ?
    `

    const sql = `
        SELECT equipements.equipement, equipements.stock_base, equipements.stock_current, terrain.adresse
        FROM terrain
        LEFT JOIN equipements 
            ON equipements.id_terrain = terrain.id_terrain
        WHERE terrain.id_club = ? AND equipements.equipement = 'crampon';
    `

    db.query(sqlClub, id_adherent, (err, results) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")
        }

        const id_club = results[0].id_club

        db.query(sql, id_club, (err, results) => {
            if (err) {
                return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")
            }
            return res.json(results)
        })
    })
}



// ----- Visualisation des Ballons ----- //
export const stockBallon = (req, res) => {

    const id_adherent = req.user.id

    const sqlClub = `
        SELECT id_club 
        FROM adherent 
        WHERE id_adherent = ?
    `

    const sql = `
        SELECT equipements.equipement, equipements.stock_base, equipements.stock_current, terrain.adresse
        FROM terrain
        LEFT JOIN equipements 
            ON equipements.id_terrain = terrain.id_terrain
        WHERE terrain.id_club = ? AND equipements.equipement = 'ballon';
    `

    db.query(sqlClub, id_adherent, (err, results) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")
        }

        const id_club = results[0].id_club

        db.query(sql, id_club, (err, results) => {
            if (err) {
                return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")
            }
            return res.json(results)
        })
    })
}