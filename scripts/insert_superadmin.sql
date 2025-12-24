-- Script d'insertion du compte SuperAdmin
-- À exécuter après avoir généré le hash bcrypt avec le script generateSuperAdmin.js

-- Les données pour le SuperAdmin sont :
-- Email: superadmin@m2i.fr
-- Mot de passe: SuperAdmin123456 (à remplacer par le hash généré)
-- Rôle: superAdmin

-- REMPLACER LE HASH CI-DESSOUS PAR CELUI GÉNÉRÉ PAR LE SCRIPT :
INSERT INTO adherent (
    role, 
    prenom, 
    nom, 
    email, 
    telephone, 
    date_naissance, 
    mot_de_passe,
    montant_cotisation,
    debut_adhesion,
    type_abonnement
) VALUES (
    'superAdmin',
    'Super',
    'Admin',
    'superadmin@m2i.fr',
    '0000000000',
    '2000-01-01',
    'REMPLACER_PAR_LE_HASH_BCRYPT_ICI',
    0,
    CURDATE(),
    'premium'
);

-- Après insertion, vous pourrez vous connecter avec :
-- Email: superadmin@m2i.fr
-- Mot de passe: SuperAdmin123456
