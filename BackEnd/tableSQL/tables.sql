CREATE TABLE CLUB (
    id_club INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL
);

CREATE TABLE ADMIN (
    id_admin INT PRIMARY KEY AUTO_INCREMENT,
    prenom VARCHAR(50) NOT NULL,
    nom VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    date_naissance DATE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    id_utilisateur INT,
    id_club INT,
    FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur)
    FOREIGN KEY (id_club) REFERENCES CLUB(id_club)
);

CREATE TABLE SUPERADMIN (
    id_superadmin INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(50) UNIQUE NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    mot_de_passe VArCHAR(255) NOT NULL,
    id_utilisateur INT,
    FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur)
);

CREATE TABLE ADHERENT (
    id_adherent INT PRIMARY KEY AUTO_INCREMENT,
    prenom VARCHAR(50) NOT NULL,
    nom VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    date_naissance DATE NOT NULL,
    montant_cotisation DECIMAL(10,2),
    mot_de_passe VARCHAR(255) NOT NULL,
    debut_adhesion DATE,
    fin_adhesion DATE,
    id_utilisateur INT,
    id_club INT
    FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur)
    FOREIGN KEY (id_club) REFERENCES CLUB(id_club)
);

CREATE TABLE UTILISATEUR (
    id_utilisateur INT PRIMARY KEY AUTO_INCREMENT,
    est_admin BOOLEAN,
    est_adherent BOOLEAN,
    est_superadmin BOOLEAN,
    id_adherent INT,
    id_admin INT,
    id_superadmin INT,
    FOREIGN KEY (id_admin) REFERENCES ADMIN(id_admin),
    FOREIGN KEY (id_adherent) REFERENCES ADHERENT(id_adherent),
    FOREIGN KEY (id_superadmin) REFERENCES SUPERADMIN(id_superadmin)
); 

CREATE TABLE TERRAIN (
    id_terrain INT PRIMARY KEY AUTO_INCREMENT,
    adresse VARCHAR(255) NOT NULL,
    id_club INT
    FOREIGN KEY (id_club) REFERENCES CLUB(id_club)
);

CREATE TABLE RESERVATION (
    id_reservation INT PRIMARY KEY AUTO_INCREMENT,
    id_adherent INT,
    id_terrain INT,
    date_reservation DATE,
    heure_debut TIME,
    heure_fin TIME,
    FOREIGN KEY (id_adherent) REFERENCES ADHERENT(id_adherent),
    FOREIGN KEY (id_terrain) REFERENCES TERRAIN(id_terrain)
);

CREATE TABLE MATCH (
    id_match INT PRIMARY KEY AUTO_INCREMENT,
    id_reservation INT,
    score VARCHAR(20) NOT NULL,
    status VARCHAR(10) NOT NULL,
    nb_buts INT NOT NULL,
    nb_victoires INT NOT NULL,
    nb_egalites INT NOT NULL,
    nb_defaites INT NOT NULL,
    FOREIGN KEY (id_reservation) REFERENCES RESERVATION(id_reservation)
);

-- Permet a ce que plusieurs adhérent puissent réserver une même réservation.
CREATE TABLE ADHERENT_RESERVATION (
  id_adherent INT,
  id_reservation INT,
  PRIMARY KEY (id_adherent, id_reservation),
  FOREIGN KEY (id_adherent) REFERENCES ADHERENT(id_adherent),
  FOREIGN KEY (id_reservation) REFERENCES RESERVATION(id_reservation)
);

CREATE TABLE CHASUBLE(
    id_chasuble INT PRIMARY KEY AUTO_INCREMENT,
    nb_chasuble INT DEFAULT 100,
    id_terrain INT,
    id_club INT,
    FOREIGN KEY (id_terrain) REFERENCES TERRAIN(id_terrain),
    FOREIGN KEY(id_club) REFERENCES CLUB(id_club)
);

CREATE TABLE BALLON(
    id_ballon INT PRIMARY KEY AUTO_INCREMENT,
    nb_ballon INT DEFAULT 20,
    id_terrain INT,
    id_club INT,
    FOREIGN KEY (id_terrain) REFERENCES TERRAIN(id_terrain),
    FOREIGN KEY(id_club) REFERENCES CLUB(id_club)
);

CREATE TABLE CRAMPON(
    id_crampon INT PRIMARY KEY AUTO_INCREMENT,
    nb_crampon INT DEFAULT 100,
    id_terrain INT,
    id_club INT,
    FOREIGN KEY (id_terrain) REFERENCES TERRAIN(id_terrain),
    FOREIGN KEY(id_club) REFERENCES CLUB(id_club)
);