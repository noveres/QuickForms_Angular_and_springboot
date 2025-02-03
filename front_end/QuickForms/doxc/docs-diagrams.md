# QuickForms 系統流程圖與架構圖

## 1. 用戶操作流程

### 1.1 問卷管理流程
```mermaid
graph TD
    A[首頁] --> B{選擇操作}
    B --> C[創建問卷]
    B --> D[查看列表]
    B --> E[查看統計]
    
    C --> C1[從頭創建]
    C --> C2[使用模板]
    C1 --> F[編輯問卷]
    C2 --> F
    
    F --> G[預覽]
    G --> H{確認}
    H -->|需要修改| F
    H -->|確認| I[保存]
    
    I --> J{是否發布}
    J -->|否| K[保存為草稿]
    J -->|是| L[發布問卷]
    
    D --> M[問卷列表]
    M --> N{操作選擇}
    N --> O[編輯]
    N --> P[刪除]
    N --> Q[分享]
    O --> F
    
    E --> R[統計數據]
    R --> S[導出報告]
```

### 1.2 問卷填寫流程
```mermaid
graph TD
    A[開啟問卷連結] --> B[載入問卷]
    B --> C[填寫答案]
    C --> D{驗證}
    D -->|不通過| C
    D -->|通過| E[提交答案]
    E --> F[保存回應]
    F --> G[更新統計]
    G --> H[完成頁面]
```

## 2. 系統架構圖

### 2.1 前後端架構
```mermaid
graph LR
    A[前端 Angular] --> B[API Layer]
    B --> C[後端 Spring Boot]
    C --> D[(MySQL)]
    
    subgraph Frontend
    A --> A1[Components]
    A --> A2[Services]
    A --> A3[Guards]
    end
    
    subgraph Backend
    C --> C1[Controllers]
    C --> C2[Services]
    C --> C3[Repositories]
    end
```

### 2.2 數據流向圖
```mermaid
graph LR
    A[用戶界面] --> B[前端服務]
    B --> C[API 請求]
    C --> D[後端控制器]
    D --> E[業務邏輯]
    E --> F[數據訪問]
    F --> G[(數據庫)]
```

## 3. 功能模塊圖

```mermaid
mindmap
  root((QuickForms))
    問卷管理
        創建問卷
            基本設置
            問題編輯
            選項配置
        問卷列表
            草稿箱
            已發布
        預覽功能
    模板系統
        模板列表
        模板預覽
        模板使用
    數據收集
        問卷填寫
        數據驗證
        回答儲存
    統計分析
        數據統計
            總覽
            詳細分析
        報表導出
```

## 4. 數據模型關係

```mermaid
erDiagram
    QUESTIONNAIRE ||--o{ SECTION : contains
    SECTION ||--o{ QUESTION : contains
    QUESTION ||--o{ OPTION : has
    QUESTIONNAIRE ||--o{ RESPONSE : receives
    RESPONSE ||--o{ ANSWER : contains
    
    QUESTIONNAIRE {
        string id
        string title
        string description
        enum status
        datetime created_at
        datetime updated_at
    }
    
    SECTION {
        string id
        string title
        int order
    }
    
    QUESTION {
        string id
        string content
        enum type
        boolean required
        int order
    }
    
    OPTION {
        string id
        string content
        int order
    }
    
    RESPONSE {
        string id
        datetime submitted_at
    }
    
    ANSWER {
        string id
        string value
    }
```

## 5. 狀態流轉圖

```mermaid
stateDiagram-v2
    [*] --> 草稿
    草稿 --> 編輯中
    編輯中 --> 草稿: 保存
    編輯中 --> 已發布: 發布
    已發布 --> 已關閉: 關閉問卷
    已關閉 --> [*]
```

## 6. 部署架構圖

```mermaid
graph TD
    A[用戶] --> B[負載均衡器]
    B --> C1[Web Server 1]
    B --> C2[Web Server 2]
    C1 --> D[API Gateway]
    C2 --> D
    D --> E1[Service 1]
    D --> E2[Service 2]
    E1 --> F[(主數據庫)]
    E2 --> F
    F --> G[(備份數據庫)]
```

這些圖表使用 Mermaid 語法繪製，可以：
1. 在支持 Mermaid 的 Markdown 查看器中查看
2. 使用 Mermaid Live Editor (https://mermaid.live) 查看和編輯
3. 在 GitHub 上直接查看

每個圖表都清晰展示了系統的不同方面：
- 用戶操作流程
- 系統架構
- 功能模塊
- 數據關係
- 狀態流轉
- 部署架構
