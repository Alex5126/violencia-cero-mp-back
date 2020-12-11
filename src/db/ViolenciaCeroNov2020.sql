-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.5.5-MariaDB-1:10.5.5+maria~focal - mariadb.org binary distribution
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             11.1.0.6116
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table msegura.centrosatencion
CREATE TABLE IF NOT EXISTS `centrosatencion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) DEFAULT NULL,
  `descripcion` varchar(120) DEFAULT NULL,
  `direccion` varchar(120) DEFAULT NULL,
  `longitud` decimal(22,16) DEFAULT NULL,
  `latitud` decimal(22,16) DEFAULT NULL,
  `estatus` varchar(16) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table msegura.config
CREATE TABLE IF NOT EXISTS `config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `param` varchar(50) DEFAULT NULL,
  `value` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table msegura.contactos
CREATE TABLE IF NOT EXISTS `contactos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `numero` varchar(200) DEFAULT NULL,
  `estatus` varchar(16) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table msegura.denunciados
CREATE TABLE IF NOT EXISTS `denunciados` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idDenuncia` int(11) DEFAULT NULL,
  `nombres` varchar(50) DEFAULT NULL,
  `apellidoPaterno` varchar(50) DEFAULT NULL,
  `apellidoMaterno` varchar(50) DEFAULT NULL,
  `parentesco` varchar(50) DEFAULT NULL,
  `edad` tinyint(4) DEFAULT NULL,
  `ocupacion` varchar(50) DEFAULT NULL,
  `domicilio` varchar(300) DEFAULT NULL,
  `codigoPostal` varchar(16) DEFAULT NULL,
  `tipoViolencia` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table msegura.denuncias
CREATE TABLE IF NOT EXISTS `denuncias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idUsuario` int(11) DEFAULT NULL,
  `estatus` varchar(16) DEFAULT NULL,
  `descripcionProblema` text DEFAULT NULL,
  `tipoAyuda` varchar(128) DEFAULT NULL,
  `fechaSolicitud` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table msegura.informacion
CREATE TABLE IF NOT EXISTS `informacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(200) DEFAULT NULL,
  `parrafos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `estatus` varchar(16) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table msegura.poblados
CREATE TABLE IF NOT EXISTS `poblados` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pais` varchar(60) DEFAULT NULL,
  `estado` varchar(60) DEFAULT NULL,
  `poblado` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table msegura.procedimientos
CREATE TABLE IF NOT EXISTS `procedimientos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(200) DEFAULT NULL,
  `parrafos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`parrafos`)),
  `estatus` varchar(16) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table msegura.registros
CREATE TABLE IF NOT EXISTS `registros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(128) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table msegura.solicitantes
CREATE TABLE IF NOT EXISTS `solicitantes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idDenuncia` int(11) NOT NULL DEFAULT 0,
  `nombres` varchar(50) DEFAULT NULL,
  `apellidoPaterno` varchar(50) DEFAULT NULL,
  `apellidoMaterno` varchar(50) DEFAULT NULL,
  `genero` varchar(16) DEFAULT NULL,
  `edad` tinyint(4) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `lugarNacimiento` varchar(50) DEFAULT NULL,
  `domicilio` varchar(300) DEFAULT NULL,
  `codigoPostal` varchar(16) DEFAULT NULL,
  `escolaridad` varchar(32) DEFAULT NULL,
  `edoCivil` varchar(32) DEFAULT NULL,
  `ocupacion` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table msegura.usuariosadm
CREATE TABLE IF NOT EXISTS `usuariosadm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(128) DEFAULT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `estatus` varchar(50) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table msegura.usuariosapp
CREATE TABLE IF NOT EXISTS `usuariosapp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(50) DEFAULT NULL,
  `apellido_paterno` varchar(30) DEFAULT NULL,
  `apellido_materno` varchar(30) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `estatus` varchar(30) DEFAULT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `cp` varchar(16) DEFAULT NULL,
  `fch_registro` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `config` (`param`, `value`) VALUES ('EMAIL_CONFIG', 'EMAIL=|PORT=|PASS=|SMTP=');
INSERT INTO `config` (`param`, `value`) VALUES ('EMAIL_NOTIFY', '');

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
