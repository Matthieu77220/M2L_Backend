import bcrypt from 'bcrypt'
import db from "../config/db.js"

// GET - Récupérer tous les utilisateurs
export const getAllUsers = (req, res) => {
    
    try {
        const sql = `SELECT 
                id_adherent AS id, 
                role, 
                prenom, 
                nom, 
                email, 
                telephone, 
                date_naissance, 
                debut_adhesion, 
                fin_adhesion, 
                type_abonnement 
             FROM ADHERENT 
             ORDER BY id_adherent ASC`
             
        db.query(
            `SELECT 
                id_adherent AS id, 
                role, 
                prenom, 
                nom, 
                email, 
                telephone, 
                date_naissance, 
                debut_adhesion, 
                fin_adhesion, 
                type_abonnement 
             FROM ADHERENT 
             ORDER BY id_adherent ASC`
        );
        
        res.status(200).json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// POST - Créer un nouvel utilisateur
export const createUser = (req, res) => {
    const { 
        role, 
        prenom, 
        nom, 
        email, 
        telephone, 
        date_naissance, 
        mot_de_passe,
        montant_cotisation,
        debut_adhesion,
        fin_adhesion,
        type_abonnement
    } = req.body;
    
    console.log('Route POST /api/admin/users appelée');

    // Seuls les admins et superadmins peuvent créer des utilisateurs
    // if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
    //     return res.status(403).json({ message: 'Accès interdit' });
    // }

    if (!email || !mot_de_passe || !prenom || !nom || !role || !telephone || !date_naissance) {
        return res.status(400).json({ message: 'Champs requis manquants' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Format d\'email invalide' });
    }

    if (mot_de_passe.length < 12) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 12 caractères' });
    }

    const rolesValides = ['admin', 'superadmin', 'utilisateur'];
    if (!rolesValides.includes(role)) {
        return res.status(400).json({ message: 'Rôle invalide' });
    }

    // Un admin ne peut créer que des utilisateurs "utilisateur"
    if (req.user.role === 'admin' && role !== 'utilisateur') {
        return res.status(403).json({ message: 'Un admin ne peut créer que des utilisateurs simples' });
    }

    try {
        const [existingUsers] = db.query(
            'SELECT id_adherent FROM ADHERENT WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Cet email existe déjà' });
        }

        const hashedPassword = bcrypt.hash(mot_de_passe, 10);

        const [result] = db.query(
            `INSERT INTO ADHERENT 
            (role, prenom, nom, email, telephone, date_naissance, mot_de_passe, montant_cotisation, debut_adhesion, fin_adhesion, type_abonnement) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                role, 
                prenom, 
                nom, 
                email, 
                telephone, 
                date_naissance, 
                hashedPassword,
                montant_cotisation || null,
                debut_adhesion || null,
                fin_adhesion || null,
                type_abonnement || null
            ]
        );

        console.log('Utilisateur créé avec ID:', result.insertId);
        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// PUT - Modifier un utilisateur
export const updateUser = (req, res) => {
    const { id } = req.params;
    const { 
        role, 
        prenom, 
        nom, 
        email, 
        telephone, 
        date_naissance, 
        mot_de_passe,
        montant_cotisation,
        debut_adhesion,
        fin_adhesion,
        type_abonnement
    } = req.body;
    
    console.log('Route PUT /api/admin/users/:id appelée pour id:', id);

    // Seuls les admins et superadmins peuvent modifier des utilisateurs
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
        return res.status(403).json({ message: 'Accès interdit' });
    }

    try {
        const [users] = db.query(
            'SELECT id_adherent, role FROM ADHERENT WHERE id_adherent = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const targetUser = users[0];

        // Un admin ne peut modifier que des utilisateurs simples
        if (req.user.role === 'admin' && targetUser.role !== 'utilisateur') {
            return res.status(403).json({ message: 'Un admin ne peut modifier que des utilisateurs simples' });
        }

        let updateFields = [];
        let updateValues = [];

        if (role) {
            const rolesValides = ['admin', 'superadmin', 'utilisateur'];
            if (!rolesValides.includes(role)) {
                return res.status(400).json({ message: 'Rôle invalide' });
            }

            /* Un admin ne peut pas promouvoir au rôle admin/superadmin
            if (req.user.role === 'admin' && role !== 'utilisateur') {
                return res.status(403).json({ message: 'Un admin ne peut modifier le rôle qu\'en \"utilisateur\"' });
            }*/

            updateFields.push('role = ?');
            updateValues.push(role);
        }

        if (prenom) {
            updateFields.push('prenom = ?');
            updateValues.push(prenom);
        }

        if (nom) {
            updateFields.push('nom = ?');
            updateValues.push(nom);
        }

        if (email) {
            const [existingUsers] = db.query(
                'SELECT id_adherent FROM ADHERENT WHERE email = ? AND id_adherent != ?',
                [email, id]
            );

            if (existingUsers.length > 0) {
                return res.status(409).json({ message: 'Cet email est déjà utilisé' });
            }

            updateFields.push('email = ?');
            updateValues.push(email);
        }

        if (telephone) {
            updateFields.push('telephone = ?');
            updateValues.push(telephone);
        }

        if (date_naissance) {
            updateFields.push('date_naissance = ?');
            updateValues.push(date_naissance);
        }

        if (mot_de_passe) {
            if (mot_de_passe.length < 8) {
                return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères' });
            }
            const hashedPassword = bcrypt.hash(mot_de_passe, 10);
            updateFields.push('mot_de_passe = ?');
            updateValues.push(hashedPassword);
        }

        if (montant_cotisation !== undefined) {
            updateFields.push('montant_cotisation = ?');
            updateValues.push(montant_cotisation);
        }

        if (debut_adhesion !== undefined) {
            updateFields.push('debut_adhesion = ?');
            updateValues.push(debut_adhesion);
        }

        if (fin_adhesion !== undefined) {
            updateFields.push('fin_adhesion = ?');
            updateValues.push(fin_adhesion);
        }

        if (type_abonnement !== undefined) {
            updateFields.push('type_abonnement = ?');
            updateValues.push(type_abonnement);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'Aucune donnée à mettre à jour' });
        }

        updateValues.push(id);

        db.query(
            `UPDATE ADHERENT SET ${updateFields.join(', ')} WHERE id_adherent = ?`,
            updateValues
        );

        console.log('Utilisateur modifié avec succès');
        res.status(200).json({ message: 'Utilisateur modifié avec succès' });
    } catch (error) {
        console.error('Erreur lors de la modification de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// DELETE - Supprimer un utilisateur
export const deleteUser = (req, res) => {
    const { id } = req.params;
    console.log('Route DELETE /api/admin/users/:id appelée pour id:', id);

    try {
        // Seuls les admins et superadmins peuvent supprimer
        if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
            return res.status(403).json({ message: 'Accès interdit' });
        }

        // Un utilisateur ne peut pas se supprimer lui-même
        if (req.user.id === parseInt(id)) {
            return res.status(403).json({ 
                message: 'Vous ne pouvez pas supprimer votre propre compte' 
            });
        }

        const [users] = db.query(
            'SELECT role FROM ADHERENT WHERE id_adherent = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const targetUser = users[0];

        // Un admin ne peut supprimer que des utilisateurs simples
        if (req.user.role === 'admin' && targetUser.role !== 'utilisateur') {
            return res.status(403).json({ message: 'Un admin ne peut supprimer que des utilisateurs simples' });
        }

        const [result] = db.query(
            'DELETE FROM ADHERENT WHERE id_adherent = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        console.log('Utilisateur supprimé avec succès');
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
