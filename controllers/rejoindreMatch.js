import db from "../config/db.js"

// ----- LICENCE ----- //
export const rejoindreMatch = (req, res) => {

    const {numero_reservation} = req.body    

    const id = req.user.id

    // Vérifie si le numéro de la réservation existe
    const sql = ` SELECT numero_reservation
                  FROM reservation 
                  WHERE numero_reservation = "?"; ` // Rajouter dans la BDD numero_reservation

    // Vérifie si l'utilisateur n'est pas déjà inscrit dans la réservation
    const sql2 = ` SELECT a.id_adherent, a.id_reservation
                   from adherent_reservation as a
                   JOIN reservation as r ON r.id_reservation = a.id_reservation
                   WHERE r.numero_reservation = "?" AND a.id_adherent = ? `

    // Ajoute l'utilisateur à la réservation
    const sql3 = ` INSERT INTO adherent_reservation(id_adherent, id_reservation)
                   VALUES (?,?) ;
                 `

    // Numéro de la réservation existe
    db.query(sql, numero_reservation, (err, result) => {
        if (err) {
            return res.status(500).send("Erreur lors de l'éxecution de la requêtes SQl.")
        }

        if (result) {
            // L'utilisateur n'est pas inscrit dans la réservation
            db.query(sql2, [id, numero_reservation], (err, result) => {
                if (err) {
                    return res.status(500).send("Erreur lors de l'éxecution de la requêtes SQl.")
                }

                if (result != 0) {
                    return res.send({message: "Vous êtes déjà inscrit à cette réservation."})
                    
                }else {
                    // Ajout l'utlisateur à la réservation
                    db.query(sql3, [id, numero_reservation], (err, result) => {
                        if (err) {
                            return res.status(500).send("Erreur lors de l'éxecution de la requêtes SQl.")
                        }

                        if (result) {
                            return res.send({message: "Inscription réussie !"})
                        }
                    })
                }
            })
        }else {
            return res.send({message: "Il n'existe pas de match correspondant à votre numéro de réservation."})
        }
    })

}