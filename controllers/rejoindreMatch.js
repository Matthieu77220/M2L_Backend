import db from "../config/db.js"

// ----- LICENCE ----- //
export const rejoindreMatch = (req, res) => {

    const {numero_reservation} = req.body

    const id = req.user.id

    // Vérifie si le numéro de la réservation existe
    const sql = `SELECT id_reservation
                  FROM reservation
                  WHERE numero_reservation = ? ;`

    // Vérifie si l'utilisateur n'est pas déjà inscrit dans la réservation
    const sql2 = ` SELECT *
                   from adherent_reservation as a
                   WHERE id_reservation = ? AND id_adherent = ? `

    // Ajoute l'utilisateur à la réservation
    const sql3 = ` INSERT INTO adherent_reservation(id_adherent, id_reservation)
                   VALUES (?,?) ;
                 `

    // Numéro de la réservation existe
    db.query(sql, numero_reservation, (err, result) => {

        if (err) {
            return res.status(500).send("Erreur SQL : vérification réservation")
        }

        if (result.length === 0) {
            return res.status(500).send({message : "Il n'existe pas de match avec ce code."})
        }

        // récupère l'id de la réservation
        const id_reservation = result[0]["id_reservation"]

            // L'utilisateur n'est pas inscrit dans la réservation
        db.query(sql2, [id_reservation, id], (err, result2) => {

            if (err) {
                return res.status(500).send("Erreur SQL : vérification inscription")
            }

            if (result2.length > 0) {    
                return res.send({message: "Vous êtes déjà inscrit à cette réservation."})
                
            }

            // Ajout l'utlisateur à la réservation
            db.query(sql3, [id, id_reservation], (err, result3) => {
                if (err) {
                    return res.status(500).send("Erreur SQL : insertion de l'utilisateur.")
                }
                if (result3) {
                    return res.send({message: "Inscription réussie !"})
                }
            })
            
        })
    })

}