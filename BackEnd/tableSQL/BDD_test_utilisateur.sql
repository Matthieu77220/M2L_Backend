-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 20 déc. 2025 à 16:15
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
-- Base de données : `m2l_test`
--

-- --------------------------------------------------------

--
-- Structure de la table `adherent`
--

CREATE TABLE `adherent` (
  `id_adherent` int(11) NOT NULL,
  `role` varchar(10) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telephone` varchar(20) NOT NULL,
  `date_naissance` date NOT NULL,
  `montant_cotisation` decimal(10,2) DEFAULT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `debut_adhesion` date DEFAULT NULL,
  `fin_adhesion` date DEFAULT NULL,
  `id_club` int(11) DEFAULT NULL,
  `type_abonnement` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `adherent`
--

INSERT INTO `adherent` (`id_adherent`, `role`, `prenom`, `nom`, `email`, `telephone`, `date_naissance`, `montant_cotisation`, `mot_de_passe`, `debut_adhesion`, `fin_adhesion`, `id_club`, `type_abonnement`) VALUES
(1, 'utilisateu', 'Jon', 'Doe', 'test@example.us', '6019521325', '0000-00-00', NULL, '$2b$10$74HlPg2KAsqpDeVk3CHt7Oi1ZKWGUbEmndf43Yz36SDBLQxxMDjBu', NULL, NULL, NULL, NULL),
(2, 'utilisateu', 'Eric', 'Nguyen', 'eric@gmail.com', '0632131029', '2025-12-04', NULL, '$2b$10$99HF1nsrQQ9VjSwgQy3tn.7RnIaqgLcVIDelYWDZAJvfdD3yzjtJC', NULL, NULL, NULL, NULL),
(11, 'utilisateu', 'Lucas', 'Martin', 'lucas.martin@example.com', '0601020304', '1998-05-12', 120.00, '$2b$10$74HlPg2KAsqpDeVk3CHt7Oi1ZKWGUbEmndf43Yz36SDBLQxxMDjBu', '2024-01-01', '2024-12-31', 1, NULL),
(12, 'utilisateu', 'Lulu', 'XxoximoxX', 'lulu@gmail.com', '0632131029', '2025-12-12', NULL, '$2b$10$8I.yRJ57HQY6JLrN7Tg8ZeeuFoly6YWDrGaP5BVMWXLrHkZ9G.svG', NULL, NULL, NULL, NULL);

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
(1, 3),
(2, 2);

-- --------------------------------------------------------

--
-- Structure de la table `ballon`
--

CREATE TABLE `ballon` (
  `id_ballon` int(11) NOT NULL,
  `nb_ballon` int(11) DEFAULT 20,
  `id_terrain` int(11) DEFAULT NULL,
  `id_club` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `chasuble`
--

CREATE TABLE `chasuble` (
  `id_chasuble` int(11) NOT NULL,
  `nb_chasuble` int(11) DEFAULT 100,
  `id_terrain` int(11) DEFAULT NULL,
  `id_club` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'FC Égly', '12 Rue du Stade, Égly', '0102030405', 'contact@fcegly.fr');

-- --------------------------------------------------------

--
-- Structure de la table `crampon`
--

CREATE TABLE `crampon` (
  `id_crampon` int(11) NOT NULL,
  `nb_crampon` int(11) DEFAULT 100,
  `id_terrain` int(11) DEFAULT NULL,
  `id_club` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `licence`
--

CREATE TABLE `licence` (
  `id_licence` int(11) NOT NULL,
  `numero_adherent` varchar(8) DEFAULT NULL,
  `id_adherent` int(11) DEFAULT NULL,
  `debut_licence` date DEFAULT current_timestamp(),
  `fin_licence` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `licence`
--

INSERT INTO `licence` (`id_licence`, `numero_adherent`, `id_adherent`, `debut_licence`, `fin_licence`) VALUES
(2, 'X23342', 1, '2025-12-19', '2025-12-30'),
(3, 'X23823', 11, '2025-12-20', NULL);

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
(1, 1, '3-1', 'victoire', 3, 1, 0, 0),
(2, 2, '1-2', 'defaite', 1, 0, 0, 1),
(3, 3, '2-2', 'egalite', 2, 0, 1, 0),
(4, 1, '3-2', 'victoire', 5, 1, 0, 0),
(5, 2, '1-1', 'egalite', 2, 0, 1, 0),
(6, 3, '0-2', 'defaite', 2, 0, 0, 1);

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
  `heure_fin` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reservation`
--

INSERT INTO `reservation` (`id_reservation`, `id_adherent`, `id_terrain`, `date_reservation`, `heure_debut`, `heure_fin`) VALUES
(1, 1, 1, '2024-02-10', '18:00:00', '19:00:00'),
(2, 1, 1, '2024-02-17', '18:00:00', '19:00:00'),
(3, 1, 1, '2024-02-24', '18:00:00', '19:00:00'),
(7, 1, 1, '2024-06-10', '18:00:00', '19:30:00'),
(8, 2, 1, '2024-06-11', '17:00:00', '18:30:00'),
(9, 1, 1, '2024-06-12', '19:00:00', '20:30:00'),
(10, 1, 1, '2024-06-10', '18:00:00', '19:30:00'),
(11, 2, 1, '2024-06-11', '17:00:00', '18:30:00'),
(12, 1, 1, '2024-06-10', '18:00:00', '19:30:00'),
(13, 2, 1, '2024-06-11', '17:00:00', '18:30:00'),
(14, 1, 1, '2024-06-10', '18:00:00', '19:30:00'),
(15, 2, 1, '2024-06-11', '17:00:00', '18:30:00'),
(16, 1, 1, '2024-06-10', '18:00:00', '19:30:00'),
(17, 2, 1, '2024-06-11', '17:00:00', '18:30:00'),
(18, 1, 1, '2024-06-10', '18:00:00', '19:30:00'),
(19, 2, 1, '2024-06-11', '17:00:00', '18:30:00');

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
(1, 'Stade Municipal, Égly', 1);

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
-- Index pour la table `ballon`
--
ALTER TABLE `ballon`
  ADD PRIMARY KEY (`id_ballon`),
  ADD KEY `id_terrain` (`id_terrain`),
  ADD KEY `id_club` (`id_club`);

--
-- Index pour la table `chasuble`
--
ALTER TABLE `chasuble`
  ADD PRIMARY KEY (`id_chasuble`),
  ADD KEY `id_terrain` (`id_terrain`),
  ADD KEY `id_club` (`id_club`);

--
-- Index pour la table `club`
--
ALTER TABLE `club`
  ADD PRIMARY KEY (`id_club`);

--
-- Index pour la table `crampon`
--
ALTER TABLE `crampon`
  ADD PRIMARY KEY (`id_crampon`),
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
  MODIFY `id_adherent` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `ballon`
--
ALTER TABLE `ballon`
  MODIFY `id_ballon` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `chasuble`
--
ALTER TABLE `chasuble`
  MODIFY `id_chasuble` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `club`
--
ALTER TABLE `club`
  MODIFY `id_club` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `crampon`
--
ALTER TABLE `crampon`
  MODIFY `id_crampon` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `licence`
--
ALTER TABLE `licence`
  MODIFY `id_licence` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `matchs`
--
ALTER TABLE `matchs`
  MODIFY `id_match` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id_reservation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `terrain`
--
ALTER TABLE `terrain`
  MODIFY `id_terrain` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
-- Contraintes pour la table `ballon`
--
ALTER TABLE `ballon`
  ADD CONSTRAINT `ballon_ibfk_1` FOREIGN KEY (`id_terrain`) REFERENCES `terrain` (`id_terrain`),
  ADD CONSTRAINT `ballon_ibfk_2` FOREIGN KEY (`id_club`) REFERENCES `club` (`id_club`);

--
-- Contraintes pour la table `chasuble`
--
ALTER TABLE `chasuble`
  ADD CONSTRAINT `chasuble_ibfk_1` FOREIGN KEY (`id_terrain`) REFERENCES `terrain` (`id_terrain`),
  ADD CONSTRAINT `chasuble_ibfk_2` FOREIGN KEY (`id_club`) REFERENCES `club` (`id_club`);

--
-- Contraintes pour la table `crampon`
--
ALTER TABLE `crampon`
  ADD CONSTRAINT `crampon_ibfk_1` FOREIGN KEY (`id_terrain`) REFERENCES `terrain` (`id_terrain`),
  ADD CONSTRAINT `crampon_ibfk_2` FOREIGN KEY (`id_club`) REFERENCES `club` (`id_club`);

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
