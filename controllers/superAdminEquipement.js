import db from "../config/db.js"

// ----- Visualisation des Chasubles ----- //
export const stockChasuble = (req, res) => {

    const sql = `
        SELECT equipements.equipement, equipements.stock_base, equipements.stock_current, terrain.adresse
        FROM terrain
        LEFT JOIN equipements 
            ON equipements.id_terrain = terrain.id_terrain
        where equipements.equipement = 'chasuble';
    `

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")
        }

        if (results) {
            return res.send(results)
        }
    })
}

// ----- Visualisation des Crampons ----- //
export const stockCrampon = (req, res) => {

    const sql = `
        SELECT equipements.equipement, equipements.stock_base, equipements.stock_current, terrain.adresse
        FROM terrain
        LEFT JOIN equipements 
            ON equipements.id_terrain = terrain.id_terrain
        WHERE equipements.equipement = 'crampon';
    `

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")
        }

        if (results) {
            return res.send(results)
        }

    })
}



// ----- Visualisation des Ballons ----- //
export const stockBallon = (req, res) => {


    const sql = `
        SELECT equipements.equipement, equipements.stock_base, equipements.stock_current, terrain.adresse
        FROM terrain
        LEFT JOIN equipements 
            ON equipements.id_terrain = terrain.id_terrain
        WHERE equipements.equipement = 'ballon';
    `

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'exécution de la requete SQL.")
        }

        if (results) {
            return res.send(results)
        }
    })
}