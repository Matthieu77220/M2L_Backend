import db from "../config/db.js"
import 'dotenv/config'

// ----- STATISTICS DASHBOARD ----- //
export const getDashboardStats = (req, res) => {
    
    
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM adherent) AS total_users,
            (SELECT COUNT(*) FROM club) AS total_clubs,
            (SELECT COUNT(*) FROM licence WHERE fin_licence IS NULL OR fin_licence >= CURDATE()) AS active_licenses,
            (SELECT COUNT(*) FROM licence) AS total_licenses,
            (SELECT COUNT(*) FROM reservation) AS total_reservations,
            (SELECT COUNT(*) FROM matchs) AS total_matches
    `
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la récupération des statistiques du dashboard" })
        }
        return res.json(results[0])
    })
}

// ----- GET ALL CLUBS ----- //
export const getAllClubs = (req, res) => {
   
    
    const sql = `
        SELECT 
            c.id_club,
            c.nom,
            c.adresse,
            c.telephone,
            c.email,
            COUNT(DISTINCT a.id_adherent) AS nombre_adherents,
            COUNT(DISTINCT t.id_terrain) AS nombre_terrains
        FROM club c
        LEFT JOIN adherent a ON a.id_club = c.id_club
        LEFT JOIN terrain t ON t.id_club = c.id_club
        GROUP BY c.id_club, c.nom, c.adresse, c.telephone, c.email
        ORDER BY c.nom ASC
    `
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la récupération des clubs" })
        }
        return res.json(results)
    })
}

// ----- GET SINGLE CLUB ----- //
export const getClubById = (req, res) => {
   
    
    const { id } = req.params
    
    const sql = `
        SELECT 
            c.id_club,
            c.nom,
            c.adresse,
            c.telephone,
            c.email,
            COUNT(DISTINCT a.id_adherent) AS nombre_adherents,
            COUNT(DISTINCT t.id_terrain) AS nombre_terrains
        FROM club c
        LEFT JOIN adherent a ON a.id_club = c.id_club
        LEFT JOIN terrain t ON t.id_club = c.id_club
        WHERE c.id_club = ?
        GROUP BY c.id_club, c.nom, c.adresse, c.telephone, c.email
    `
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la récupération du club" })
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Club non trouvé" })
        }
        return res.json(results[0])
    })
}

// ----- CREATE CLUB ----- //
export const createClub = (req, res) => {
   
    
    const { nom, adresse, telephone, email } = req.body
    
    if (!nom || !adresse || !telephone || !email) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires" })
    }
    
    const sql = "INSERT INTO club (nom, adresse, telephone, email) VALUES (?, ?, ?, ?)"
    
    db.query(sql, [nom, adresse, telephone, email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la création du club" })
        }
        return res.status(201).json({ 
            message: "Club créé avec succès", 
            id_club: results.insertId 
        })
    })
}

// ----- UPDATE CLUB ----- //
export const updateClub = (req, res) => {

    
    const { id } = req.params
    const { nom, adresse, telephone, email } = req.body
    
    if (!nom || !adresse || !telephone || !email) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires" })
    }
    
    const sql = "UPDATE club SET nom = ?, adresse = ?, telephone = ?, email = ? WHERE id_club = ?"
    
    db.query(sql, [nom, adresse, telephone, email, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la mise à jour du club" })
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Club non trouvé" })
        }
        return res.json({ message: "Club mis à jour avec succès" })
    })
}

// ----- DELETE CLUB ----- //
export const deleteClub = (req, res) => {
   
    
    const { id } = req.params
    
    const sql = "DELETE FROM club WHERE id_club = ?"
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la suppression du club" })
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Club non trouvé" })
        }
        return res.json({ message: "Club supprimé avec succès" })
    })
}

// ----- GET ALL USERS ----- //
export const getAllUsers = (req, res) => {
    
    
    const sql = `
        SELECT 
            id_adherent,
            role,
            prenom,
            nom,
            email,
            telephone,
            date_naissance,
            montant_cotisation,
            debut_adhesion,
            fin_adhesion,
            id_club,
            type_abonnement
        FROM adherent
        ORDER BY nom ASC, prenom ASC
    `
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" })
        }
        return res.json(results)
    })
}

// ----- GET SINGLE USER ----- //
export const getUserById = (req, res) => {
    // // const userRole = req.user.role; // Vérification role superadmin à ajouter plus tard
    
    const { id } = req.params
    
    const sql = "SELECT * FROM adherent WHERE id_adherent = ?"
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur" })
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" })
        }
        return res.json(results[0])
    })
}

// ----- UPDATE USER ----- //
export const updateUser = (req, res) => {
    
    
    const { id } = req.params
    const { role, prenom, nom, email, telephone, montant_cotisation, type_abonnement } = req.body
    
    if (!role || !prenom || !nom || !email) {
        return res.status(400).json({ error: "Les champs obligatoires sont manquants" })
    }
    
    const sql = `
        UPDATE adherent 
        SET role = ?, prenom = ?, nom = ?, email = ?, telephone = ?, montant_cotisation = ?, type_abonnement = ? 
        WHERE id_adherent = ?
    `
    
    db.query(sql, [role, prenom, nom, email, telephone, montant_cotisation, type_abonnement, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" })
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" })
        }
        return res.json({ message: "Utilisateur mis à jour avec succès" })
    })
}

// ----- DELETE USER ----- //
export const deleteUser = (req, res) => {
   
    
    const { id } = req.params
    
    const sql = "DELETE FROM adherent WHERE id_adherent = ?"
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur" })
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" })
        }
        return res.json({ message: "Utilisateur supprimé avec succès" })
    })
}

// ----- GET GLOBAL STATISTICS ----- //
export const getGlobalStats = (req, res) => {
    const sql = `
        SELECT 
            COUNT(DISTINCT m.id_match) AS nombre_total_matchs,
            SUM(m.nb_buts) AS buts_total,
            SUM(m.nb_victoires) AS victoires_total,
            SUM(m.nb_defaites) AS defaites_total,
            SUM(m.nb_egalites) AS egalites_total,
            COUNT(DISTINCT r.id_reservation) AS reservations_total,
            COUNT(DISTINCT a.id_adherent) AS adherents_total,
            COUNT(DISTINCT l.id_licence) AS licences_total,
            COUNT(DISTINCT c.id_club) AS clubs_total
        FROM matchs m
        LEFT JOIN reservation r ON m.id_reservation = r.id_reservation
        LEFT JOIN adherent_reservation ar ON r.id_reservation = ar.id_reservation
        LEFT JOIN adherent a ON ar.id_adherent = a.id_adherent
        LEFT JOIN licence l ON a.id_adherent = l.id_adherent
        LEFT JOIN club c ON a.id_club = c.id_club
    `
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la récupération des statistiques globales" })
        }
        return res.json(results[0])
    })
}
