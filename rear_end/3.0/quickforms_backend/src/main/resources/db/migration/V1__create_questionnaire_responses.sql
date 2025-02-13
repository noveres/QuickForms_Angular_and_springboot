CREATE TABLE IF NOT EXISTS questionnaire_responses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    questionnaire_id BIGINT NOT NULL,
    answers TEXT,
    user_agent VARCHAR(255),
    created_at DATETIME,
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id)
);
