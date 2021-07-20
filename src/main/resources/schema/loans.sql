# MySQL-Front 3.2  (Build 7.31)

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES 'utf8mb4' */;

# Host: 192.168.0.30    Database: loans
# ------------------------------------------------------
# Server version 5.5.5-10.1.48-MariaDB-0+deb9u1

CREATE DATABASE `loans` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `loans`;

#
# Table structure for table sin_verification
#

CREATE TABLE `sin_verification` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `sin` varchar(50) NOT NULL,
  `verified` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

#
# Dumping data for table sin_verification
#



#
# Table structure for table users
#

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `forename` varchar(50) DEFAULT NULL,
  `surname` varchar(50) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `dob` varchar(50) DEFAULT NULL,
  `address_1` varchar(50) DEFAULT NULL,
  `address_2` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `postcode` varchar(50) DEFAULT NULL,
  `sin` varchar(50) DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

#
# Dumping data for table users
#

INSERT INTO `users` VALUES (1,'Alex','Beaton','12345678','22/04/76','142 Potter Way','Ingles','Surrey','SU12 3HG','123-456-789','+1 416 837 2913');
INSERT INTO `users` VALUES (2,'Josephine','Clarke','142663236','15/07/83','35 Roxburgh Lane','Meles','Oxford','O65 8FD','385-198-184','+1 416 837 2914');
INSERT INTO `users` VALUES (3,'Rex','Smith','83623513','09/11/80','35 Oldmill Road','Rocherston','Cromwell','CI12 9UI','295-916-095','+1 416 837 2915');
INSERT INTO `users` VALUES (4,'Jill','White','28530451','27/06/77','14 Walk Way','High Lake','Tielferd','T12 2FG','835-124-623','+1 416 837 2916');
INSERT INTO `users` VALUES (5,'Paul','Macgregor','47568254','14/02/89','47 Danbury Crescent','Helensport','Shropsburgh','SO78 2GH','375-635-154','+1 416 837 2917');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
