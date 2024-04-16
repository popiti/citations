-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le :  sam. 27 jan. 2024 à 20:16
-- Version du serveur :  5.7.17
-- Version de PHP :  5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `citations`
--

-- --------------------------------------------------------

--
-- Structure de la table `citation`
--

CREATE TABLE `citation` (
  `id` int(11) NOT NULL,
  `contenu` varchar(250) NOT NULL,
  `clientId` varchar(250) NOT NULL,
  `date` varchar(250) NOT NULL,
  `username` varchar(250) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `citation`
--

INSERT INTO `citation` (`id`, `contenu`, `clientId`, `date`, `username`) VALUES
(18, 'Je connais peu d\'humiliations qui résistent à un nom sur une liste de best-sellers.\r\n', '1189554689927286784', '2024-01-01', 'devhaha'),
(17, 'New 5', '1189554689927286784', '2024-01-01', 'devhaha'),
(16, 'New 4', '1189554689927286784', '2024-01-01', 'devhaha'),
(15, 'New 3', '1189554689927286784', '2024-01-01', 'devhaha'),
(14, 'New 2', '1189554689927286784', '2024-01-01', 'devhaha'),
(26, 'nouvelle citation pour tester id', '1034017450834022470', '2024-01-27', 'aymerlin'),
(19, 'New 8', '1189554689927286784', '2024-01-01', 'devhaha'),
(20, 'New 9', '1189554689927286784', '2024-01-01', 'devhaha'),
(21, 'Tous les jours, je consulte la liste des Américains les plus riches. Si je n’y suis pas, je vais travailler.', '326900142039105536', '2024-01-01', 'walid0301'),
(22, 'Je n’ai pas de liste de choses à réaliser, je ne sais pas ce que je ferai demain, et c’est voulu.', '1034017450834022470', '2024-01-01', 'aymerlin'),
(23, 'Je viens d\'ajouter un bot discord et une citation', '326900142039105536', '2024-01-01', 'walid0301'),
(24, 'TextArea', '1189554689927286784', '2024-01-03', 'devhaha'),
(25, 'L’avenir, fantôme aux mains vides, qui promet tout et qui n’a rien !', '547055411988004884', '2024-01-21', 'bry_llane');

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

CREATE TABLE `client` (
  `username` varchar(250) NOT NULL,
  `isAdmin` int(11) NOT NULL,
  `userID` varchar(250) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `client`
--

INSERT INTO `client` (`username`, `isAdmin`, `userID`) VALUES
('walid0301', 1, '326900142039105536'),
('JonhPitt', 1, '566596137478520856'),
('devhaha', 0, '1189554689927286784');

-- --------------------------------------------------------

--
-- Structure de la table `connexion`
--

CREATE TABLE `connexion` (
  `userID` varchar(250) NOT NULL,
  `token` varchar(250) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `connexion`
--

INSERT INTO `connexion` (`userID`, `token`) VALUES
('1189554689927286784', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTg5NTU0Njg5OTI3Mjg2Nzg0IiwiZXhwIjoxNzA2Mzc2NDg3LCJpYXQiOjE3MDYzNzYzMDd9.o3wthr6_R41G9CaGSXhdCUMSpjl6XsVu8Io9flz7S8I'),
('566596137478520856', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NjY1OTYxMzc0Nzg1MjA4NTYiLCJleHAiOjE3MDYzNzY0NjEsImlhdCI6MTcwNjM3NjI4MX0.-aa_tknL47p6XdvJCfetURi1SkThnFHSprhsxJG1wd4');

-- --------------------------------------------------------

--
-- Structure de la table `favori`
--

CREATE TABLE `favori` (
  `clientId` varchar(250) NOT NULL,
  `citationId` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `favori`
--

INSERT INTO `favori` (`clientId`, `citationId`) VALUES
('1189554689927286784', 16),
('566596137478520856', 14),
('566596137478520856', 15),
('566596137478520856', 23);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `citation`
--
ALTER TABLE `citation`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`username`);

--
-- Index pour la table `connexion`
--
ALTER TABLE `connexion`
  ADD PRIMARY KEY (`userID`);

--
-- Index pour la table `favori`
--
ALTER TABLE `favori`
  ADD PRIMARY KEY (`clientId`,`citationId`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `citation`
--
ALTER TABLE `citation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
