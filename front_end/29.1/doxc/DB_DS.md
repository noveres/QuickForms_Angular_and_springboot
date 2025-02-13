-- 創建數據庫
CREATE DATABASE quickforms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quickforms;

-- 問卷表
CREATE TABLE questionnaires (
    id VARCHAR(36) PRIMARY KEY,                    -- 問卷唯一標識 (UUID)
    title VARCHAR(255) NOT NULL,                   -- 問卷標題
    description TEXT,                              -- 問卷描述
    status ENUM('DRAFT','PUBLISHED','CLOSED') NOT NULL DEFAULT 'DRAFT', -- 問卷狀態
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 創建時間
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 更新時間
    published_at TIMESTAMP NULL,                   -- 發布時間
    created_by VARCHAR(36) NOT NULL,              -- 創建者ID
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,     -- 軟刪除標記
    version INT NOT NULL DEFAULT 1,                -- 版本號(樂觀鎖)
    
    INDEX idx_status (status),                     -- 狀態索引
    INDEX idx_created_by (created_by),            -- 創建者索引
    INDEX idx_created_at (created_at)             -- 創建時間索引
) ENGINE=InnoDB;

-- 區段表
CREATE TABLE sections (
    id VARCHAR(36) PRIMARY KEY,                    -- 區段唯一標識
    questionnaire_id VARCHAR(36) NOT NULL,         -- 關聯的問卷ID
    title VARCHAR(255) NOT NULL,                   -- 區段標題
    description TEXT,                              -- 區段描述
    order_index INT NOT NULL,                      -- 排序順序
    
    FOREIGN KEY (questionnaire_id) 
        REFERENCES questionnaires(id)
        ON DELETE CASCADE,                         -- 問卷刪除時級聯刪除
    
    INDEX idx_questionnaire (questionnaire_id),    -- 問卷ID索引
    INDEX idx_order (order_index)                  -- 排序索引
) ENGINE=InnoDB;

-- 問題表
CREATE TABLE questions (
    id VARCHAR(36) PRIMARY KEY,                    -- 問題唯一標識
    section_id VARCHAR(36) NOT NULL,               -- 關聯的區段ID
    type ENUM('TEXT','TEXTAREA','RADIO','CHECKBOX','SELECT','DATE','TIME','RATING') NOT NULL, -- 問題類型
    label VARCHAR(500) NOT NULL,                   -- 問題標題
    description TEXT,                              -- 問題描述
    required BOOLEAN NOT NULL DEFAULT FALSE,       -- 是否必填
    order_index INT NOT NULL,                      -- 排序順序
    validation_rules JSON,                         -- 驗證規則（JSON格式）
    
    FOREIGN KEY (section_id) 
        REFERENCES sections(id)
        ON DELETE CASCADE,                         -- 區段刪除時級聯刪除
    
    INDEX idx_section (section_id),                -- 區段ID索引
    INDEX idx_type (type),                         -- 類型索引
    INDEX idx_order (order_index)                  -- 排序索引
) ENGINE=InnoDB;

-- 選項表
CREATE TABLE options (
    id VARCHAR(36) PRIMARY KEY,                    -- 選項唯一標識
    question_id VARCHAR(36) NOT NULL,              -- 關聯的問題ID
    value VARCHAR(255) NOT NULL,                   -- 選項值
    label VARCHAR(255) NOT NULL,                   -- 選項標籤
    order_index INT NOT NULL,                      -- 排序順序
    
    FOREIGN KEY (question_id) 
        REFERENCES questions(id)
        ON DELETE CASCADE,                         -- 問題刪除時級聯刪除
    
    INDEX idx_question (question_id),              -- 問題ID索引
    INDEX idx_order (order_index)                  -- 排序索引
) ENGINE=InnoDB;

-- 回答表
CREATE TABLE responses (
    id VARCHAR(36) PRIMARY KEY,                    -- 回答唯一標識
    questionnaire_id VARCHAR(36) NOT NULL,         -- 關聯的問卷ID
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 提交時間
    submitted_by VARCHAR(36),                      -- 提交者ID（可為空，支持匿名）
    ip_address VARCHAR(45),                        -- 提交者IP
    user_agent TEXT,                              -- 用戶代理信息
    
    FOREIGN KEY (questionnaire_id) 
        REFERENCES questionnaires(id)
        ON DELETE CASCADE,                         -- 問卷刪除時級聯刪除
    
    INDEX idx_questionnaire (questionnaire_id),    -- 問卷ID索引
    INDEX idx_submitted_at (submitted_at),         -- 提交時間索引
    INDEX idx_submitted_by (submitted_by)          -- 提交者索引
) ENGINE=InnoDB;

-- 答案表
CREATE TABLE answers (
    id VARCHAR(36) PRIMARY KEY,                    -- 答案唯一標識
    response_id VARCHAR(36) NOT NULL,              -- 關聯的回答ID
    question_id VARCHAR(36) NOT NULL,              -- 關聯的問題ID
    value TEXT NOT NULL,                           -- 答案值
    
    FOREIGN KEY (response_id) 
        REFERENCES responses(id)
        ON DELETE CASCADE,                         -- 回答刪除時級聯刪除
    FOREIGN KEY (question_id) 
        REFERENCES questions(id)
        ON DELETE CASCADE,                         -- 問題刪除時級聯刪除
    
    INDEX idx_response (response_id),              -- 回答ID索引
    INDEX idx_question (question_id)               -- 問題ID索引
) ENGINE=InnoDB;

-- 統計表（用於快速查詢統計數據）
CREATE TABLE statistics (
    questionnaire_id VARCHAR(36) PRIMARY KEY,      -- 問卷ID
    total_responses INT NOT NULL DEFAULT 0,        -- 總回答數
    completion_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00, -- 完成率
    last_response_at TIMESTAMP NULL,              -- 最後回答時間
    stats_data JSON,                              -- 詳細統計數據（JSON格式）
    
    FOREIGN KEY (questionnaire_id) 
        REFERENCES questionnaires(id)
        ON DELETE CASCADE,                         -- 問卷刪除時級聯刪除
    
    INDEX idx_last_response (last_response_at)     -- 最後回答時間索引
) ENGINE=InnoDB;
