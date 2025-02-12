CREATE DATABASE  IF NOT EXISTS `quickforms` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `quickforms`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: quickforms
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `questionnaire_options`
--

DROP TABLE IF EXISTS `questionnaire_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questionnaire_options` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `question_id` bigint unsigned NOT NULL,
  `choices` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `max` int DEFAULT NULL,
  `choice` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `questionnaire_options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questionnaire_questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionnaire_options`
--

LOCK TABLES `questionnaire_options` WRITE;
/*!40000 ALTER TABLE `questionnaire_options` DISABLE KEYS */;
/*!40000 ALTER TABLE `questionnaire_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questionnaire_question_options`
--

DROP TABLE IF EXISTS `questionnaire_question_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questionnaire_question_options` (
  `questionnaire_question_id` bigint NOT NULL,
  `options` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `options_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`questionnaire_question_id`,`options_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionnaire_question_options`
--

LOCK TABLES `questionnaire_question_options` WRITE;
/*!40000 ALTER TABLE `questionnaire_question_options` DISABLE KEYS */;
INSERT INTO `questionnaire_question_options` VALUES (1690,'{\"0\":\"Very Satisfied\",\"1\":\"Satisfied\",\"2\":\"00\",\"3\":\"Dissatisfied\"}','choices'),(1803,'{\"0\":\"選項1\",\"1\":\"選項2\"}','choices'),(1804,'{\"0\":\"選項1\",\"1\":\"選項2\"}','choices'),(1805,'{\"0\":\"選項1\",\"1\":\"選項2\"}','choices'),(1817,'{\"0\":\"選項1\",\"1\":\"選項3\"}','choices'),(1818,'{}','choices'),(1819,'{\"0\":\"選項1\",\"1\":\"選項2\"}','choices');
/*!40000 ALTER TABLE `questionnaire_question_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questionnaire_questions`
--

DROP TABLE IF EXISTS `questionnaire_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questionnaire_questions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `section_id` bigint unsigned NOT NULL,
  `label` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `required` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `section_id` (`section_id`),
  CONSTRAINT `questionnaire_questions_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `questionnaire_sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1820 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionnaire_questions`
--

LOCK TABLES `questionnaire_questions` WRITE;
/*!40000 ALTER TABLE `questionnaire_questions` DISABLE KEYS */;
INSERT INTO `questionnaire_questions` VALUES (14,11,'更新後的姓名','short-text',1),(15,11,'更新後的姓名','short-text',1),(24,15,'更新後的姓名','short-text',1),(25,15,'更新後的姓名','short-text',1),(26,15,'參加場次','radio',1),(40,20,'姓名','short-text',1),(41,20,'電子郵件','email',1),(42,20,'聯繫電話','phone',1),(43,20,'參加場次','radio',1),(44,20,'飲食偏好','checkbox',0),(60,26,'姓名','short-text',1),(61,26,'電子郵件','email',1),(62,26,'聯繫電話','phone',1),(63,26,'參加場次','radio',1),(64,26,'飲食偏好','checkbox',0),(65,37,'问题标题','short-text',1),(66,37,'单选题','radio',1),(67,37,'多选题','checkbox',0),(68,39,'问题标题','short-text',1),(69,39,'单选题','radio',1),(70,39,'多选题','checkbox',0),(1688,2019,'What is your name?','text',1),(1689,2019,'What is your age?','number',1),(1690,2020,'How satisfied are you with our service?','rating',1),(1778,2074,'姓名','short-text',1),(1779,2074,'電子郵件','email',1),(1780,2074,'聯繫電話','phone',0),(1781,2075,'產品質量滿意度','checkbox',1),(1782,2075,'服務態度滿意度','radio',1),(1783,2075,'','checkbox',0),(1784,2076,'您對我們的產品或服務有什麼建議？','long-text',0),(1803,2091,'222','checkbox',0),(1804,2092,'222','checkbox',0),(1805,2094,'222','checkbox',0),(1817,2101,'222','checkbox',0),(1818,2102,'4444','short-text',0),(1819,2102,'4444','radio',0);
/*!40000 ALTER TABLE `questionnaire_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questionnaire_sections`
--

DROP TABLE IF EXISTS `questionnaire_sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questionnaire_sections` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `questionnaire_id` bigint unsigned NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `questionnaire_sections_ibfk_1` (`questionnaire_id`),
  CONSTRAINT `questionnaire_sections_ibfk_1` FOREIGN KEY (`questionnaire_id`) REFERENCES `questionnaires` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionnaire_sections`
--

LOCK TABLES `questionnaire_sections` WRITE;
/*!40000 ALTER TABLE `questionnaire_sections` DISABLE KEYS */;
INSERT INTO `questionnaire_sections` VALUES (11,26,'更新後的基本信息','text'),(15,28,'參與者信息','text'),(20,33,'參與者信息','text'),(26,39,'參與者信息','text'),(37,50,'章节标题','text'),(39,3,'章节标题','text'),(100,4,'新區塊','default'),(2019,62,'General Information','text'),(2020,62,'Feedback','multiple-choice'),(2074,63,'基本信息','text'),(2075,63,'評分項目','rating'),(2076,63,'詳細反饋','text'),(2091,66,'新區塊','default'),(2092,67,'新區塊','default'),(2094,69,'新區塊','default'),(2101,70,'新區塊','default'),(2102,2,'新區塊','default');
/*!40000 ALTER TABLE `questionnaire_sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questionnaires`
--

DROP TABLE IF EXISTS `questionnaires`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questionnaires` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '未命名問卷',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'DRAFT',
  `response_count` bigint DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionnaires`
--

LOCK TABLES `questionnaires` WRITE;
/*!40000 ALTER TABLE `questionnaires` DISABLE KEYS */;
INSERT INTO `questionnaires` VALUES (1,'客戶滿意度調查','了解客戶對我們服務的滿意程度',NULL,25,'2025-02-10 07:15:28'),(2,'員工福利調查','收集員工對公司福利的意見',NULL,0,'2025-02-09 15:30:00'),(3,'问卷标题','问卷描述','CLOSED',15,'2025-02-08 09:45:00'),(4,'工作環境改善調查','了解員工對辦公環境的建議','DRAFT',0,'2025-02-07 14:20:00'),(5,'培訓需求調查','收集員工的培訓需求和建議','PUBLISHED',30,'2025-02-06 11:10:00'),(6,'培訓需求調查','收集員工的培訓需求和建議','PUBLISHED',30,'2025-02-06 11:10:00'),(25,'未命名問卷','更新後的問卷標題','DRAFT',0,'2025-02-11 23:35:28'),(26,'更新後的問卷標題','更新後的問卷描述','DRAFT',0,'2025-02-11 23:37:49'),(28,'活動報名表','活動和會議報名','DRAFT',0,'2025-02-11 23:58:40'),(33,'活動報名表','活動和會議報名','DRAFT',0,'2025-02-12 10:43:53'),(39,'活動報名表','活動和會議報名','DRAFT',0,'2025-02-12 12:12:43'),(50,'问卷标题','问卷描述','DRAFT',0,'2025-02-12 12:47:51'),(60,'未命名問卷',NULL,'DRAFT',0,'2025-02-12 15:18:13'),(62,'Customer Satisfaction Survey','A survey to gauge customer satisfaction.',NULL,NULL,'2025-02-12 19:07:39'),(63,'客戶滿意度調查','',NULL,NULL,'2025-02-12 20:45:13'),(66,'員工福利調查','收集員工對公司福利的意見','DRAFT',NULL,'2025-02-12 21:04:30'),(67,'員工福利調查','收集員工對公司福利的意見','DRAFT',NULL,'2025-02-12 21:05:46'),(69,'員工福利調查','收集員工對公司福利的意見','DRAFT',NULL,'2025-02-12 21:07:34'),(70,'員工福利調查','收集員工對公司福利的意見',NULL,NULL,'2025-02-12 21:09:47');
/*!40000 ALTER TABLE `questionnaires` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-12 21:44:44
