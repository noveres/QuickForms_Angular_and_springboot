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
-- Table structure for table `answer_values`
--

DROP TABLE IF EXISTS `answer_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answer_values` (
  `answer_id` bigint NOT NULL,
  `answer_value` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `question_id` bigint NOT NULL,
  PRIMARY KEY (`answer_id`,`question_id`),
  CONSTRAINT `FK4gsk2rrswy3placdpb5t313rk` FOREIGN KEY (`answer_id`) REFERENCES `answers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer_values`
--

LOCK TABLES `answer_values` WRITE;
/*!40000 ALTER TABLE `answer_values` DISABLE KEYS */;
/*!40000 ALTER TABLE `answer_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `completed` bit(1) DEFAULT NULL,
  `end_time` datetime(6) DEFAULT NULL,
  `ip_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `questionnaire_id` bigint DEFAULT NULL,
  `start_time` datetime(6) DEFAULT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_answers`
--

DROP TABLE IF EXISTS `question_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_answers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `response_id` bigint DEFAULT NULL,
  `question_id` bigint DEFAULT NULL,
  `answer_value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_answers`
--

LOCK TABLES `question_answers` WRITE;
/*!40000 ALTER TABLE `question_answers` DISABLE KEYS */;
/*!40000 ALTER TABLE `question_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_options`
--

DROP TABLE IF EXISTS `question_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_options` (
  `question_id` bigint NOT NULL,
  `option_value` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  KEY `FKsb9v00wdrgc9qojtjkv7e1gkp` (`question_id`),
  CONSTRAINT `FKsb9v00wdrgc9qojtjkv7e1gkp` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_options`
--

LOCK TABLES `question_options` WRITE;
/*!40000 ALTER TABLE `question_options` DISABLE KEYS */;
/*!40000 ALTER TABLE `question_options` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `questionnaire_question_options` VALUES (1690,'{\"0\":\"Very Satisfied\",\"1\":\"Satisfied\",\"2\":\"00\",\"3\":\"Dissatisfied\"}','choices'),(1803,'{\"0\":\"選項1\",\"1\":\"選項2\"}','choices'),(1804,'{\"0\":\"選項1\",\"1\":\"選項2\"}','choices'),(1805,'{\"0\":\"選項1\",\"1\":\"選項2\"}','choices'),(1817,'{\"0\":\"選項1\",\"1\":\"選項3\"}','choices'),(1820,'{}','choices'),(1821,'{\"0\":\"選項1\",\"1\":\"選項2\"}','choices'),(1822,'{\"0\":\"選項1\",\"1\":\"選項2\"}','choices'),(1823,'{}','choices'),(1824,'{}','choices'),(1825,'{}','choices'),(1826,'{\"0\":\"選項1\",\"1\":\"選項2\",\"2\":\"選項3\"}','choices'),(1827,'{\"0\":\"選項1\",\"1\":\"選項2\",\"2\":\"選項3\"}','choices'),(1828,'{\"0\":\"選項1\",\"1\":\"選項2\",\"2\":\"選項3\"}','choices'),(1829,'{}','choices'),(1830,'{}','choices'),(1831,'{}','choices'),(1861,'{}','choices'),(1862,'{}','choices'),(1863,'{\"0\":\"選項1\",\"1\":\"選項2\"}','choices'),(1894,'{}','choices'),(1895,'{\"0\":\"選項1\",\"1\":\"選項2\"}','choices');
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
  `options` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `section_id` (`section_id`),
  CONSTRAINT `questionnaire_questions_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `questionnaire_sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1995 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionnaire_questions`
--

LOCK TABLES `questionnaire_questions` WRITE;
/*!40000 ALTER TABLE `questionnaire_questions` DISABLE KEYS */;
INSERT INTO `questionnaire_questions` VALUES (14,11,'更新後的姓名','short-text',1,NULL),(15,11,'更新後的姓名','short-text',1,NULL),(40,20,'姓名','short-text',1,NULL),(41,20,'電子郵件','email',1,NULL),(42,20,'聯繫電話','phone',1,NULL),(43,20,'參加場次','radio',1,NULL),(44,20,'飲食偏好','checkbox',0,NULL),(60,26,'姓名','short-text',1,NULL),(61,26,'電子郵件','email',1,NULL),(62,26,'聯繫電話','phone',1,NULL),(63,26,'參加場次','radio',1,NULL),(64,26,'飲食偏好','checkbox',0,NULL),(65,37,'问题标题','short-text',1,NULL),(66,37,'单选题','radio',1,NULL),(67,37,'多选题','checkbox',0,NULL),(1688,2019,'What is your name?','text',1,NULL),(1689,2019,'What is your age?','number',1,NULL),(1690,2020,'How satisfied are you with our service?','rating',1,NULL),(1803,2091,'222','checkbox',0,NULL),(1804,2092,'222','checkbox',0,NULL),(1805,2094,'222','checkbox',0,NULL),(1817,2101,'222','checkbox',0,NULL),(1820,2103,'问题标题','short-text',1,NULL),(1821,2103,'单选题','radio',1,NULL),(1822,2103,'多选题','checkbox',0,NULL),(1823,2104,'姓名','short-text',1,NULL),(1824,2104,'電子郵件','email',1,NULL),(1825,2104,'聯繫電話','phone',0,NULL),(1826,2105,'產品質量滿意度','checkbox',1,NULL),(1827,2105,'服務態度滿意度','radio',1,NULL),(1828,2105,'','checkbox',0,NULL),(1829,2106,'您對我們的產品或服務有什麼建議？','long-text',0,NULL),(1830,2106,'','short-text',0,NULL),(1831,2106,'','short-text',0,NULL),(1861,2114,'更新後的姓名','short-text',1,NULL),(1862,2114,'更新後的姓名','short-text',1,NULL),(1863,2114,'參加場次','radio',1,NULL),(1921,2128,'222','rating',0,'{\"choices\":{\"1\":\"非常不滿意\",\"2\":\"不滿意\",\"3\":\"一般\",\"4\":\"滿意\",\"5\":\"非常滿意\"}}'),(1922,2128,'222','email',0,'{\"placeholder\":\"\"}'),(1923,2128,'','radio',0,'{\"choices\":{\"0\":\"選項1\",\"1\":\"選項2\",\"2\":\"選項3\"}}'),(1958,2135,'姓名','short-text',1,'{\"placeholder\":\"\"}'),(1959,2135,'電子郵件','email',1,'{\"placeholder\":\"\"}'),(1960,2135,'聯繫電話','phone',1,'{\"placeholder\":\"\"}'),(1961,2135,'參加場次','radio',1,'{\"choices\":{\"0\":\"選項1\",\"1\":\"選項2\"}}'),(1962,2135,'飲食偏好','checkbox',0,'{\"choices\":{\"0\":\"選項1\",\"1\":\"選項2\"}}'),(1963,2135,'TEST','rating',0,'{\"choices\":{\"1\":\"非常不滿意\",\"2\":\"不滿意\",\"3\":\"一般\",\"4\":\"滿意\",\"5\":\"非常滿意\"}}'),(1964,2135,'下拉','select',0,'{\"choices\":{\"0\":\"選項1\",\"1\":\"選項2\"}}'),(1965,2136,'111','short-text',0,'{\"placeholder\":\"\"}'),(1966,2136,'111','radio',0,'{\"choices\":{\"0\":\"選項1\",\"1\":\"選項2\"}}'),(1967,2137,'111','short-text',0,'{\"placeholder\":\"\"}'),(1968,2137,'1111','radio',0,'{\"choices\":{\"0\":\"選項1\",\"1\":\"選項2\"}}'),(1969,2137,'333','select',0,'{\"choices\":{\"0\":\"選項1\",\"1\":\"選項2\"}}'),(1970,2138,'姓名','short-text',1,'{\"placeholder\":\"\"}'),(1971,2138,'電子郵件','email',1,'{\"placeholder\":\"\"}'),(1972,2138,'聯繫電話','phone',1,'{\"placeholder\":\"\"}'),(1973,2138,'參加場次','radio',1,'{\"choices\":{\"1\":\"上午場 (9:00-12:00)\",\"2\":\"下午場 (14:00-17:00)\"}}'),(1974,2138,'飲食偏好','checkbox',0,'{\"choices\":{\"1\":\"素食\",\"2\":\"不含海鮮\",\"3\":\"不含花生\"}}'),(1991,2147,'工作質量','rating',1,'{\"choices\":{\"1\":\"非常不滿意\",\"2\":\"不滿意\",\"3\":\"一般\",\"4\":\"滿意\",\"5\":\"非常滿意\"}}'),(1992,2147,'團隊合作','rating',1,'{\"choices\":{\"1\":\"非常不滿意\",\"2\":\"不滿意\",\"3\":\"一般\",\"4\":\"滿意\",\"5\":\"非常滿意\"}}'),(1993,2148,'主要成就','long-text',1,'{\"placeholder\":\"請描述本期主要工作成就...\"}'),(1994,2148,'改進建議','long-text',0,'{\"placeholder\":\"請提出改進建議...\"}');
/*!40000 ALTER TABLE `questionnaire_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questionnaire_responses`
--

DROP TABLE IF EXISTS `questionnaire_responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questionnaire_responses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `questionnaire_id` bigint unsigned NOT NULL,
  `answers` text COLLATE utf8mb4_unicode_ci,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `questionnaire_id` (`questionnaire_id`),
  CONSTRAINT `questionnaire_responses_ibfk_1` FOREIGN KEY (`questionnaire_id`) REFERENCES `questionnaires` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionnaire_responses`
--

LOCK TABLES `questionnaire_responses` WRITE;
/*!40000 ALTER TABLE `questionnaire_responses` DISABLE KEYS */;
INSERT INTO `questionnaire_responses` VALUES (1,72,'[{\"answerValue\":\"4444\"},{\"answerValue\":\"4444@11\"},{\"answerValue\":\"1111\"},{\"answerValue\":\"0\"},{\"answerValue\":\"0\"},{\"answerValue\":\"5\"},{\"answerValue\":\"1\"}]','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36','2025-02-13 12:55:38'),(2,72,'[{\"answerValue\":\"1111\"},{\"answerValue\":\"11111@111\"},{\"answerValue\":\"1111\"},{\"answerValue\":\"0\"},{\"answerValue\":\"0\"},{\"answerValue\":\"3\"},{\"answerValue\":\"1\"}]','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36','2025-02-13 13:17:55'),(3,72,'[{\"answerValue\":\"6666\"},{\"answerValue\":\"6666@6666\"},{\"answerValue\":\"6666\"},{\"answerValue\":\"0\"},{\"answerValue\":\"0\"},{\"answerValue\":\"5\"},{\"answerValue\":\"1\"}]','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36','2025-02-13 14:49:43'),(4,72,'[{\"answerValue\":\"4444\"},{\"answerValue\":\"4444@55\"},{\"answerValue\":\"4444\"},{\"answerValue\":\"0\"},{\"answerValue\":\"0\"},{\"answerValue\":\"2\"},{\"answerValue\":\"1\"}]','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36','2025-02-13 14:50:20'),(5,72,'[{\"answerValue\":\"6666\"},{\"answerValue\":\"6666@6\"},{\"answerValue\":\"6666\"},{\"answerValue\":\"0\"},{\"answerValue\":\"0\"},{\"answerValue\":\"5\"},{\"answerValue\":\"1\"}]','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36','2025-02-13 15:18:25'),(6,72,'[{\"answerValue\":\"444\"},{\"answerValue\":\"444@11\"},{\"answerValue\":\"1111\"},{\"answerValue\":\"0\"},{\"answerValue\":\"0\"},{\"answerValue\":\"1\"},{\"answerValue\":\"1\"}]','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36','2025-02-13 15:18:59');
/*!40000 ALTER TABLE `questionnaire_responses` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = gbk */ ;
/*!50003 SET character_set_results = gbk */ ;
/*!50003 SET collation_connection  = gbk_chinese_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_response_insert` AFTER INSERT ON `questionnaire_responses` FOR EACH ROW BEGIN
    UPDATE questionnaires
    SET response_count = response_count + 1
    WHERE id = NEW.questionnaire_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = gbk */ ;
/*!50003 SET character_set_results = gbk */ ;
/*!50003 SET collation_connection  = gbk_chinese_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_response_update` AFTER UPDATE ON `questionnaire_responses` FOR EACH ROW BEGIN
    
    UPDATE questionnaires
    SET response_count = response_count - 1
    WHERE id = OLD.questionnaire_id;

    
    UPDATE questionnaires
    SET response_count = response_count + 1
    WHERE id = NEW.questionnaire_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = gbk */ ;
/*!50003 SET character_set_results = gbk */ ;
/*!50003 SET collation_connection  = gbk_chinese_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_response_delete` AFTER DELETE ON `questionnaire_responses` FOR EACH ROW BEGIN
    UPDATE questionnaires
    SET response_count = response_count - 1
    WHERE id = OLD.questionnaire_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

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
) ENGINE=InnoDB AUTO_INCREMENT=2149 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionnaire_sections`
--

LOCK TABLES `questionnaire_sections` WRITE;
/*!40000 ALTER TABLE `questionnaire_sections` DISABLE KEYS */;
INSERT INTO `questionnaire_sections` VALUES (11,26,'更新後的基本信息','text'),(20,33,'參與者信息','text'),(26,39,'參與者信息','text'),(37,50,'章节标题','text'),(100,4,'新區塊','default'),(2019,62,'General Information','text'),(2020,62,'Feedback','multiple-choice'),(2091,66,'新區塊','default'),(2092,67,'新區塊','default'),(2094,69,'新區塊','default'),(2101,70,'新區塊','default'),(2103,3,'章节标题','text'),(2104,63,'基本信息','text'),(2105,63,'評分項目','rating'),(2106,63,'詳細反饋','text'),(2114,28,'參與者信息','text'),(2128,60,'新區塊','default'),(2135,72,'參與者信息','text'),(2136,5,'新區塊','default'),(2137,2,'新區塊','default'),(2138,73,'參與者信息','text'),(2147,74,'基本評分','rating'),(2148,74,'詳細評價','text');
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
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '未命名問卷',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `response_count` bigint NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime(6) DEFAULT NULL,
  `published` bit(1) NOT NULL,
  `published_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionnaires`
--

LOCK TABLES `questionnaires` WRITE;
/*!40000 ALTER TABLE `questionnaires` DISABLE KEYS */;
INSERT INTO `questionnaires` VALUES (1,'客戶滿意度調查','了解客戶對我們服務的滿意程度','PUBLISHED',0,'2025-02-10 07:15:28',NULL,_binary '\0',NULL,NULL),(2,'員工福利調查','收集員工對公司福利的意見','DRAFT',0,'2025-02-09 15:30:00',NULL,_binary '\0',NULL,NULL),(3,'问卷标题','问卷描述','PUBLISHED',0,'2025-02-08 09:45:00',NULL,_binary '\0',NULL,NULL),(4,'工作環境改善調查','了解員工對辦公環境的建議','DRAFT',0,'2025-02-07 14:20:00',NULL,_binary '\0',NULL,NULL),(5,'培訓需求調查','收集員工的培訓需求和建議','PUBLISHED',0,'2025-02-06 11:10:00',NULL,_binary '\0',NULL,NULL),(6,'培訓需求調查','收集員工的培訓需求和建議','PUBLISHED',0,'2025-02-06 11:10:00',NULL,_binary '\0',NULL,NULL),(25,'未命名問卷','更新後的問卷標題','DRAFT',0,'2025-02-11 23:35:28',NULL,_binary '\0',NULL,NULL),(26,'更新後的問卷標題','更新後的問卷描述','DRAFT',0,'2025-02-11 23:37:49',NULL,_binary '\0',NULL,NULL),(28,'活動報名表','活動和會議報名','PUBLISHED',0,'2025-02-11 23:58:40',NULL,_binary '\0',NULL,NULL),(33,'活動報名表','活動和會議報名','DRAFT',0,'2025-02-12 10:43:53',NULL,_binary '\0',NULL,NULL),(39,'活動報名表','活動和會議報名','DRAFT',0,'2025-02-12 12:12:43',NULL,_binary '\0',NULL,NULL),(50,'问卷标题','问卷描述','DRAFT',0,'2025-02-12 12:47:51',NULL,_binary '\0',NULL,NULL),(60,'未命名問卷','未提供描述','PUBLISHED',0,'2025-02-12 15:18:13',NULL,_binary '\0',NULL,NULL),(62,'Customer Satisfaction Survey','A survey to gauge customer satisfaction.','PUBLISHED',0,'2025-02-12 19:07:39',NULL,_binary '\0',NULL,NULL),(63,'客戶滿意度調查','','PUBLISHED',0,'2025-02-12 20:45:13',NULL,_binary '\0',NULL,NULL),(66,'員工福利調查','收集員工對公司福利的意見','DRAFT',0,'2025-02-12 21:04:30',NULL,_binary '\0',NULL,NULL),(67,'員工福利調查','收集員工對公司福利的意見','DRAFT',0,'2025-02-12 21:05:46',NULL,_binary '\0',NULL,NULL),(69,'員工福利調查','收集員工對公司福利的意見','DRAFT',0,'2025-02-12 21:07:34',NULL,_binary '\0',NULL,NULL),(70,'員工福利調查','收集員工對公司福利的意見','PUBLISHED',0,'2025-02-12 21:09:47',NULL,_binary '\0',NULL,NULL),(71,'活動報名表','','DRAFT',0,'2025-02-12 22:30:42',NULL,_binary '\0',NULL,NULL),(72,'活動報名表','','PUBLISHED',6,'2025-02-12 22:55:52',NULL,_binary '\0',NULL,NULL),(73,'活動報名表','','DRAFT',0,'2025-02-13 17:05:02',NULL,_binary '\0',NULL,NULL),(74,'員工考核表','','DRAFT',0,'2025-02-13 20:35:54',NULL,_binary '\0',NULL,NULL);
/*!40000 ALTER TABLE `questionnaires` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `max_length` int DEFAULT NULL,
  `max_rating` int DEFAULT NULL,
  `min_length` int DEFAULT NULL,
  `min_rating` int DEFAULT NULL,
  `order_index` int DEFAULT NULL,
  `placeholder` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `questionnaire_id` bigint DEFAULT NULL,
  `rating_step` int DEFAULT NULL,
  `required` bit(1) DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'quickforms'
--

--
-- Dumping routines for database 'quickforms'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-13 20:44:46
