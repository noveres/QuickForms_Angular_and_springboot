-- 插入問卷回應
INSERT INTO questionnaire_responses (questionnaire_id, respondent_id, started_at, completed_at, ip_address, user_agent)
VALUES 
(2, 'test-user-1', '2025-02-13 10:00:00', '2025-02-13 10:05:00', '127.0.0.1', 'Mozilla/5.0'),
(2, 'test-user-2', '2025-02-13 10:10:00', '2025-02-13 10:15:00', '127.0.0.1', 'Mozilla/5.0'),
(2, 'test-user-3', '2025-02-13 10:20:00', '2025-02-13 10:25:00', '127.0.0.1', 'Mozilla/5.0');

-- 插入問題答案（根據問卷ID=2的實際問題）
INSERT INTO question_answers (response_id, question_id, answer_value, created_at)
SELECT 
    qr.id,
    qq.id,
    CASE 
        WHEN qq.type = 'radio' THEN '選項1'
        WHEN qq.type = 'checkbox' THEN '["選項1", "選項2"]'
        WHEN qq.type = 'rating' THEN '4'
        ELSE '測試回答'
    END,
    qr.completed_at
FROM questionnaire_responses qr
CROSS JOIN questionnaire_questions qq
WHERE qr.questionnaire_id = 2
AND qq.section_id IN (SELECT id FROM questionnaire_sections WHERE questionnaire_id = 2);
