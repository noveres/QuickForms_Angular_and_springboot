# QuickForms API 文檔

## 1. 問卷管理 API

### 1.1 獲取問卷列表
- **URL**: `/api/questionnaires`
- **Method**: GET
- **Query 參數**:
  ```
  page: 頁碼 (從0開始)
  size: 每頁數量
  status: 狀態篩選 (DRAFT/PUBLISHED)
  ```
- **Response**:
  ```json
  {
    "content": [
      {
        "id": "string",
        "title": "string",
        "status": "DRAFT/PUBLISHED",
        "createdAt": "2024-02-03T12:00:00Z",
        "updatedAt": "2024-02-03T12:00:00Z"
      }
    ],
    "totalElements": 100,
    "totalPages": 5
  }
  ```

### 1.2 創建問卷
- **URL**: `/api/questionnaires`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "title": "問卷標題",
    "sections": [
      {
        "title": "區段標題",
        "questions": [
          {
            "type": "TEXT/RADIO/CHECKBOX",
            "label": "問題描述",
            "required": true,
            "options": ["選項1", "選項2"]
          }
        ]
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "title": "string",
    "status": "DRAFT",
    "createdAt": "2024-02-03T12:00:00Z"
  }
  ```

### 1.3 獲取問卷詳情
- **URL**: `/api/questionnaires/{id}`
- **Method**: GET
- **Response**:
  ```json
  {
    "id": "string",
    "title": "string",
    "sections": [],
    "status": "DRAFT/PUBLISHED",
    "createdAt": "2024-02-03T12:00:00Z",
    "updatedAt": "2024-02-03T12:00:00Z"
  }
  ```

### 1.4 更新問卷
- **URL**: `/api/questionnaires/{id}`
- **Method**: PUT
- **Request Body**:
  ```json
  {
    "title": "更新的標題",
    "sections": []
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "updatedAt": "2024-02-03T12:00:00Z"
  }
  ```

### 1.5 發布問卷
- **URL**: `/api/questionnaires/{id}/publish`
- **Method**: PATCH
- **Response**:
  ```json
  {
    "id": "string",
    "status": "PUBLISHED",
    "publishedAt": "2024-02-03T12:00:00Z"
  }
  ```

### 1.6 刪除問卷
- **URL**: `/api/questionnaires/{id}`
- **Method**: DELETE
- **Response**:
  ```json
  {
    "success": true
  }
  ```

## 2. 問卷模板 API

### 2.1 獲取模板列表
- **URL**: `/api/templates`
- **Method**: GET
- **Query 參數**:
  ```
  page: 頁碼
  size: 每頁數量
  ```
- **Response**:
  ```json
  {
    "content": [
      {
        "id": "string",
        "name": "string",
        "description": "string"
      }
    ],
    "totalElements": 100
  }
  ```

### 2.2 獲取模板詳情
- **URL**: `/api/templates/{id}`
- **Method**: GET
- **Response**:
  ```json
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "sections": []
  }
  ```

## 3. 問卷回答 API

### 3.1 提交問卷回答
- **URL**: `/api/questionnaires/{id}/responses`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "answers": [
      {
        "questionId": "string",
        "value": "string or array"
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "submittedAt": "2024-02-03T12:00:00Z"
  }
  ```

### 3.2 獲取回答統計
- **URL**: `/api/questionnaires/{id}/stats`
- **Method**: GET
- **Response**:
  ```json
  {
    "totalResponses": 100,
    "questions": [
      {
        "id": "string",
        "type": "string",
        "stats": {
          "options": [
            {
              "label": "string",
              "count": 50
            }
          ]
        }
      }
    ]
  }
  ```

## 4. 通用信息

### 4.1 認證
所有請求需要在 Header 中包含 JWT Token：
```
Authorization: Bearer <token>
```

### 4.2 錯誤響應格式
```json
{
  "errorCode": "ERROR_CODE",
  "message": "錯誤描述",
  "timestamp": "2024-02-03T12:00:00Z"
}
```

### 4.3 狀態碼
- 200: 請求成功
- 201: 創建成功
- 400: 請求參數錯誤
- 401: 未授權
- 403: 禁止訪問
- 404: 資源不存在
- 500: 服務器錯誤

## 5. 前端調用位置

### 5.1 問卷列表頁面 (list.component.ts)
- 獲取問卷列表 API
- 刪除問卷 API

### 5.2 問卷編輯頁面 (questionnaire-form.component.ts)
- 創建問卷 API
- 更新問卷 API
- 發布問卷 API
- 獲取問卷詳情 API

### 5.3 模板選擇頁面 (template-list.component.ts)
- 獲取模板列表 API
- 獲取模板詳情 API

### 5.4 問卷統計頁面 (stats.component.ts)
- 獲取回答統計 API
