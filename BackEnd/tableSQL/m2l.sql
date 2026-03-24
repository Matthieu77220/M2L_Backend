-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 09 mars 2026 à 13:17
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `m2l`
--

-- --------------------------------------------------------

--
-- Structure de la table `adherent`
--

CREATE TABLE `adherent` (
  `id_adherent` int(11) NOT NULL,
  `id_club` int(11) DEFAULT NULL,
  `role` varchar(11) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telephone` varchar(20) NOT NULL,
  `date_naissance` date NOT NULL,
  `montant_cotisation` decimal(10,2) DEFAULT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `debut_adhesion` date DEFAULT NULL,
  `fin_adhesion` date DEFAULT NULL,
  `type_abonnement` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `adherent`
--

INSERT INTO `adherent` (`id_adherent`, `id_club`, `role`, `prenom`, `nom`, `email`, `telephone`, `date_naissance`, `montant_cotisation`, `mot_de_passe`, `debut_adhesion`, `fin_adhesion`, `type_abonnement`) VALUES
(1, 1, 'superAdmin', 'Lucas', 'Martin', 'martin.lucas@gmail.com', '0612345601', '1998-04-12', 120.00, '$2b$10$74HlPg2KAsqpDeVk3CHt7Oi1ZKWGUbEmndf43Yz36SDBLQxxMDjBu', '2024-01-01', '2024-12-31', 'Mensuel'),
(2, NULL, 'utilisateur', 'Emma', 'Durand', 'durand.emma@gmail.com', '0612345602', '1999-06-23', 120.00, '$2b$10$74HlPg2KAsqpDeVk3CHt7Oi1ZKWGUbEmndf43Yz36SDBLQxxMDjBu', '2024-01-01', '2024-12-31', 'standard'),
(3, NULL, 'utilisateur', 'Nathan', 'Lefevre', 'lefevre.nathan@gmail.com', '0612345603', '2000-02-15', 120.00, '$2b$10$74HlPg2KAsqpDeVk3CHt7Oi1ZKWGUbEmndf43Yz36SDBLQxxMDjBu', '2024-01-01', '2024-12-31', 'standard'),
(4, NULL, 'utilisateur', 'Chloe', 'Moreau', 'moreau.chloe@gmail.com', '0612345604', '1997-11-30', 120.00, '$2b$10$74HlPg2KAsqpDeVk3CHt7Oi1ZKWGUbEmndf43Yz36SDBLQxxMDjBu', '2024-01-01', '2024-12-31', 'standard'),
(5, NULL, 'utilisateur', 'Hugo', 'Bernard', 'bernard.hugo@gmail.com', '0612345605', '1996-09-08', 120.00, '$2b$10$74HlPg2KAsqpDeVk3CHt7Oi1ZKWGUbEmndf43Yz36SDBLQxxMDjBu', '2024-01-01', '2024-12-31', 'standard'),
(6, NULL, 'utilisateur', 'Lea', 'Petit', 'petit.lea@gmail.com', '0612345606', '2001-01-19', 120.00, '$2b$10$74HlPg2KAsqpDeVk3CHt7Oi1ZKWGUbEmndf43Yz36SDBLQxxMDjBu', '2024-01-01', '2024-12-31', 'standard'),
(7, NULL, 'utilisateur', 'Tom', 'Roux', 'roux.tom@gmail.com', '0612345607', '1998-07-04', 120.00, '$2b$10$74HlPg2KAsqpDeVk3CHt7Oi1ZKWGUbEmndf43Yz36SDBLQxxMDjBu', '2024-01-01', '2024-12-31', 'standard'),
(8, NULL, 'utilisateur', 'Manon', 'Fournier', 'fournier.manon@gmail.com', '0612345608', '1999-12-14', 120.00, '$2b$10$74HlPg2KAsqpDeVk3CHt7Oi1ZKWGUbEmndf43Yz36SDBLQxxMDjBu', '2024-01-01', '2024-12-31', 'standard'),
(9, NULL, 'utilisateur', 'Alexis', 'Girard', 'girard.alexis@gmail.com', '0612345609', '1997-03-27', 120.00, '$2b$10$74HlPg2KAsqpDeVk3CHt7Oi1ZKWGUbEmndf43Yz36SDBLQxxMDjBu', '2024-01-01', '2024-12-31', 'standard'),
(10, NULL, 'utilisateur', 'Sarah', 'Lambert', 'lambert.sarah@gmail.com', '0612345610', '2000-10-05', 120.00, '$2b$10$74HlPg2KAsqpDeVk3CHt7Oi1ZKWGUbEmndf43Yz36SDBLQxxMDjBu', '2024-01-01', '2024-12-31', 'standard');

-- --------------------------------------------------------

--
-- Structure de la table `adherent_reservation`
--

CREATE TABLE `adherent_reservation` (
  `id_adherent` int(11) NOT NULL,
  `id_reservation` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `adherent_reservation`
--

INSERT INTO `adherent_reservation` (`id_adherent`, `id_reservation`) VALUES
(1, 1),
(1, 2),
(1, 4),
(1, 6),
(1, 9),
(2, 1),
(2, 2),
(2, 5),
(2, 8),
(3, 1),
(3, 3),
(3, 6),
(3, 10),
(4, 1),
(4, 4),
(4, 7),
(4, 9),
(5, 2),
(5, 5),
(5, 8),
(5, 10),
(6, 2),
(6, 4),
(6, 6),
(6, 8),
(7, 2),
(7, 5),
(7, 7),
(7, 9),
(8, 3),
(8, 6),
(8, 8),
(8, 10),
(9, 3),
(9, 4),
(9, 7),
(9, 9),
(10, 3),
(10, 5),
(10, 7),
(10, 10);

-- --------------------------------------------------------

--
-- Structure de la table `club`
--

CREATE TABLE `club` (
  `id_club` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `telephone` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `club`
--

INSERT INTO `club` (`id_club`, `nom`, `adresse`, `telephone`, `email`) VALUES
(1, 'FC Montgeron', '12 Rue de la République, 91230 Montgeron', '0169401101', 'contact@fcmontgeron.fr'),
(2, 'AS Yerres', '4 Avenue du Stade, 91330 Yerres', '0632131029', 'contact@asyerres.fr'),
(3, 'US Brunoy', '18 Boulevard des Sports, 91800 Brunoy', '0169401103', 'contact@usbrunoy.fr');

-- --------------------------------------------------------

--
-- Structure de la table `equipements`
--

CREATE TABLE `equipements` (
  `id_equipement` int(11) NOT NULL,
  `equipement` varchar(25) DEFAULT NULL,
  `stock_base` int(11) DEFAULT NULL,
  `stock_current` int(11) DEFAULT NULL,
  `id_terrain` int(11) DEFAULT NULL,
  `id_club` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `equipements`
--

INSERT INTO `equipements` (`id_equipement`, `equipement`, `stock_base`, `stock_current`, `id_terrain`, `id_club`) VALUES
(1, 'ballon', 20, 1, 1, 1),
(2, 'ballon', 20, 16, 2, 1),
(3, 'ballon', 20, 19, 3, 2),
(4, 'ballon', 20, 17, 4, 2),
(5, 'ballon', 20, 15, 5, 3),
(6, 'ballon', 20, 18, 6, 3),
(7, 'chasuble', 100, 92, 1, 1),
(8, 'chasuble', 100, 88, 2, 1),
(9, 'chasuble', 100, 95, 3, 2),
(10, 'chasuble', 100, 90, 4, 2),
(11, 'chasuble', 100, 86, 5, 3),
(12, 'chasuble', 100, 93, 6, 3),
(13, 'crampon', 100, 84, 1, 1),
(14, 'crampon', 100, 79, 2, 1),
(15, 'crampon', 100, 91, 3, 2),
(16, 'crampon', 100, 87, 4, 2),
(17, 'crampon', 100, 76, 5, 3),
(18, 'crampon', 100, 82, 6, 3);

-- --------------------------------------------------------

--
-- Structure de la table `licence`
--

CREATE TABLE `licence` (
  `id_licence` int(11) NOT NULL,
  `numero_adherent` varchar(8) DEFAULT NULL,
  `debut_licence` date DEFAULT NULL,
  `fin_licence` date DEFAULT NULL,
  `id_adherent` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `licence`
--

INSERT INTO `licence` (`id_licence`, `numero_adherent`, `debut_licence`, `fin_licence`, `id_adherent`) VALUES
(1, 'LIC00001', '2024-01-01', '2024-12-31', 1),
(2, 'LIC00002', '2024-01-01', '2024-12-31', 2),
(3, 'LIC00003', '2024-01-01', '2024-12-31', 3),
(4, 'LIC00004', '2024-01-01', '2024-12-31', 4),
(5, 'LIC00005', '2024-01-01', '2024-12-31', 5),
(6, 'LIC00006', '2024-01-01', '2024-12-31', 6),
(7, 'LIC00007', '2024-01-01', '2024-12-31', 7),
(8, 'LIC00008', '2024-01-01', '2024-12-31', 8),
(9, 'LIC00009', '2024-01-01', '2024-12-31', 9),
(10, 'LIC00010', '2024-01-01', '2024-12-31', 10);

-- --------------------------------------------------------

--
-- Structure de la table `matchs`
--

CREATE TABLE `matchs` (
  `id_match` int(11) NOT NULL,
  `id_reservation` int(11) DEFAULT NULL,
  `score` varchar(20) NOT NULL,
  `status` varchar(10) NOT NULL,
  `nb_buts` int(11) NOT NULL,
  `nb_victoires` int(11) NOT NULL,
  `nb_egalites` int(11) NOT NULL,
  `nb_defaites` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `matchs`
--

INSERT INTO `matchs` (`id_match`, `id_reservation`, `score`, `status`, `nb_buts`, `nb_victoires`, `nb_egalites`, `nb_defaites`) VALUES
(1, 1, '3-2', 'victoire', 5, 1, 0, 0),
(2, 2, '1-1', 'egalite', 2, 0, 1, 0),
(3, 3, '0-2', 'defaite', 2, 0, 0, 1),
(4, 4, '4-0', 'victoire', 4, 1, 0, 0),
(5, 5, '2-2', 'egalite', 4, 0, 1, 0),
(6, 6, '1-3', 'defaite', 4, 0, 0, 1),
(7, 7, '0-0', 'egalite', 0, 0, 1, 0),
(8, 8, '2-1', 'victoire', 3, 1, 0, 0),
(9, 9, '-', 'prevu', 0, 0, 0, 0),
(10, 10, '-', 'prevu', 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `reservation`
--

CREATE TABLE `reservation` (
  `id_reservation` int(11) NOT NULL,
  `id_adherent` int(11) DEFAULT NULL,
  `id_terrain` int(11) DEFAULT NULL,
  `date_reservation` date DEFAULT NULL,
  `heure_debut` time DEFAULT NULL,
  `heure_fin` time DEFAULT NULL,
  `numero_reservation` int(6) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reservation`
--

INSERT INTO `reservation` (`id_reservation`, `id_adherent`, `id_terrain`, `date_reservation`, `heure_debut`, `heure_fin`, `numero_reservation`) VALUES
(1, 1, 1, '2024-02-03', '18:00:00', '19:30:00', 153156),
(2, 2, 2, '2024-02-04', '19:00:00', '20:30:00', 664464),
(3, 3, 3, '2024-02-05', '18:30:00', '20:00:00', 915163),
(4, 4, 4, '2024-02-06', '20:00:00', '21:30:00', 178364),
(5, 5, 5, '2024-02-07', '17:30:00', '19:00:00', 312093),
(6, 6, 6, '2024-02-08', '19:30:00', '21:00:00', 131389),
(7, 7, 1, '2024-02-10', '16:00:00', '17:30:00', 634235),
(8, 8, 3, '2024-02-11', '18:00:00', '19:30:00', 317874),
(9, 9, 5, '2024-02-12', '19:00:00', '20:30:00', 931841),
(10, 10, 2, '2024-02-13', '18:30:00', '20:00:00', 883184);

-- --------------------------------------------------------

--
-- Structure de la table `terrain`
--

CREATE TABLE `terrain` (
  `id_terrain` int(11) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `id_club` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `terrain`
--

INSERT INTO `terrain` (`id_terrain`, `adresse`, `id_club`) VALUES
(1, 'Stade Municipal - Terrain A, 91230 Montgeron', 1),
(2, 'Stade Municipal - Terrain B, 91230 Montgeron', 1),
(3, 'Complexe Sportif - Terrain Central, 91330 Yerres', 2),
(4, 'Complexe Sportif - Terrain Annexe, 91330 Yerres', 2),
(5, 'Stade de la Vallée - Terrain 1, 91800 Brunoy', 3),
(6, 'Stade de la Vallée - Terrain 2, 91800 Brunoy', 3);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `adherent`
--
ALTER TABLE `adherent`
  ADD PRIMARY KEY (`id_adherent`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `adherent_reservation`
--
ALTER TABLE `adherent_reservation`
  ADD PRIMARY KEY (`id_adherent`,`id_reservation`),
  ADD KEY `id_reservation` (`id_reservation`);

--
-- Index pour la table `club`
--
ALTER TABLE `club`
  ADD PRIMARY KEY (`id_club`);

--
-- Index pour la table `equipements`
--
ALTER TABLE `equipements`
  ADD PRIMARY KEY (`id_equipement`),
  ADD KEY `id_terrain` (`id_terrain`),
  ADD KEY `id_club` (`id_club`);

--
-- Index pour la table `licence`
--
ALTER TABLE `licence`
  ADD PRIMARY KEY (`id_licence`),
  ADD KEY `id_adherent` (`id_adherent`);

--
-- Index pour la table `matchs`
--
ALTER TABLE `matchs`
  ADD PRIMARY KEY (`id_match`),
  ADD KEY `id_reservation` (`id_reservation`);

--
-- Index pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id_reservation`),
  ADD KEY `id_adherent` (`id_adherent`),
  ADD KEY `id_terrain` (`id_terrain`);

--
-- Index pour la table `terrain`
--
ALTER TABLE `terrain`
  ADD PRIMARY KEY (`id_terrain`),
  ADD KEY `id_club` (`id_club`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `adherent`
--
ALTER TABLE `adherent`
  MODIFY `id_adherent` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `club`
--
ALTER TABLE `club`
  MODIFY `id_club` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `licence`
--
ALTER TABLE `licence`
  MODIFY `id_licence` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `matchs`
--
ALTER TABLE `matchs`
  MODIFY `id_match` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id_reservation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `terrain`
--
ALTER TABLE `terrain`
  MODIFY `id_terrain` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `adherent_reservation`
--
ALTER TABLE `adherent_reservation`
  ADD CONSTRAINT `adherent_reservation_ibfk_1` FOREIGN KEY (`id_adherent`) REFERENCES `adherent` (`id_adherent`),
  ADD CONSTRAINT `adherent_reservation_ibfk_2` FOREIGN KEY (`id_reservation`) REFERENCES `reservation` (`id_reservation`);

--
-- Contraintes pour la table `licence`
--
ALTER TABLE `licence`
  ADD CONSTRAINT `licence_ibfk_1` FOREIGN KEY (`id_adherent`) REFERENCES `adherent` (`id_adherent`);

--
-- Contraintes pour la table `matchs`
--
ALTER TABLE `matchs`
  ADD CONSTRAINT `matchs_ibfk_1` FOREIGN KEY (`id_reservation`) REFERENCES `reservation` (`id_reservation`);

--
-- Contraintes pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`id_adherent`) REFERENCES `adherent` (`id_adherent`),
  ADD CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`id_terrain`) REFERENCES `terrain` (`id_terrain`);

--
-- Contraintes pour la table `terrain`
--
ALTER TABLE `terrain`
  ADD CONSTRAINT `terrain_ibfk_1` FOREIGN KEY (`id_club`) REFERENCES `club` (`id_club`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
