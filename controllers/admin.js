import bcrypt from 'bcrypt'
import db from "../config/db.js"

// GET - Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
    console.log('Route GET /api/admin/users appelée');
    console.log('User authentifié:', req.user);
    
    try {
        const [users] = await db.query(
            'SELECT id, email, admin, created_at FROM users ORDER BY id ASC'
        );
        console.log(' trouvés:', users.length);
        res.status(200).json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// GET - Récupérer un utilisateur par ID
export const getUserById = async (req, res) => {
    const { id } = req.params;
    console.log('Route GET /api/admin/users/:id appelée pour id:', id);

    try {
        const [users] = await db.query(
            'SELECT id, email, admin, created_at FROM users WHERE id = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.status(200).json(users[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// POST - Créer un nouvel utilisateur
export const createUser = async (req, res) => {
    const { email, password, admin } = req.body;
    console.log('Route POST /api/admin/users appelée');


    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Format d\'email invalide' });
    }

    if (password.length < 12) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    if (admin !== undefined && admin !== 0 && admin !== 1) {
        return res.status(400).json({ message: 'Valeur admin invalide' });
    }

    try {
    
        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Cet email existe déjà' });
        }

     
        const hashedPassword = await bcrypt.hash(password, 10);

      
        const [result] = await db.query(
            'INSERT INTO users (email, password, admin) VALUES (?, ?, ?)',
            [email, hashedPassword, admin || 0]
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
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, password, admin } = req.body;
    console.log('Route PUT /api/admin/users/:id appelée pour id:', id);

    try {

        const [users] = await db.query('SELECT id FROM users WHERE id = ?', [id]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

    nt
        let updateFields = [];
        let updateValues = [];

        if (email) {
        
            const [existingUsers] = await db.query(
                'SELECT id FROM users WHERE email = ? AND id != ?',
                [email, id]
            );

            if (existingUsers.length > 0) {
                return res.status(409).json({ message: 'Cet email est déjà utilisé' });
            }

            updateFields.push('email = ?');
            updateValues.push(email);
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.push('password = ?');
            updateValues.push(hashedPassword);
        }

        if (admin !== undefined) {
            updateFields.push('admin = ?');
            updateValues.push(admin);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'Aucune donnée à mettre à jour' });
        }

        updateValues.push(id);

        await db.query(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
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
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    console.log('Route DELETE /api/admin/users/:id appelée pour id:', id);

    try {
        //message d'erreur si l'admin veut se supprimer lui meme
        if (req.user.id === parseInt(id)) {
            return res.status(403).json({ 
                message: 'Vous ne pouvez pas supprimer votre propre compte' 
            });
        }

        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

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