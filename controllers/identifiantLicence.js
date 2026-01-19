import db from "../config/db.js"
import 'dotenv/config'

// ----- LICENCE ----- //
export const identifiantLicence = async (req, res) => {
    try {
        // --- Récupération de l'id de l'adherent depuis le middleware ---
        const id = req.user.id

        // --- Préparation de la requete préparée pour Afficher les informations de la licence ---
        const sql = `SELECT a.prenom, a.nom, a.date_naissance, a.type_abonnement, l.numero_adherent, l.debut_licence, l.fin_licence
                     FROM adherent as a
                     JOIN licence as l on l.id_adherent = a.id_adherent
                     WHERE l.id_adherent = ? `

        const [result] = await db.query(sql, [id])

        if (result.length === 0) {
            return res.status(404).send("Aucune licence trouvée pour cet adhérent.")
        }

        return res.json([result[0]])
    } catch (err) {
        console.error("Erreur lors de la récupération de la licence:", err)
        return res.status(500).send("Erreur lors de l'exécution de la requête SQL.")
    }
}
