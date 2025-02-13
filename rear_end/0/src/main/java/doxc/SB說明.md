在 **Spring Boot** 的開發中，分層架構（Layered Architecture）是一種常見的設計模式，能夠提高系統的模組化、可讀性和可維護性。一般來說，Spring Boot 應用程式的分層架構可以分為以下幾個層次：

---

## **1. 表現層（Controller 層）**
- 負責處理 HTTP 請求，作為前端（如 Web、App）與後端的接口。
- 依賴 **Service 層** 來執行業務邏輯。
- 返回 JSON、HTML 或其他格式的響應。

### **常見技術**
- `@RestController`
- `@RequestMapping`
- `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`
- `@ResponseBody`

```java
@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }
}
```

---

## **2. 服務層（Service 層）**
- 負責處理業務邏輯，並調用 **Repository 層** 存取數據。
- 提供事務管理，確保數據一致性。

### **常見技術**
- `@Service`
- `@Transactional`（用於數據庫事務）

```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
```

---

## **3. 資料訪問層（Repository 層）**
- 負責與資料庫交互，通常使用 **Spring Data JPA** 或 **MyBatis** 來簡化數據操作。

### **常見技術**
- `@Repository`
- `JpaRepository` (Spring Data JPA)
- `CrudRepository`
- MyBatis (`@Mapper`)

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 自動生成基礎的 CRUD 方法
}
```

---

## **4. 實體層（Entity 層 / Model 層）**
- 定義與資料庫對應的物件（Entity），通常使用 **JPA** 來管理。

### **常見技術**
- `@Entity`
- `@Table`
- `@Id`
- `@GeneratedValue`
- `@Column`

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;

    // Getter 和 Setter
}
```

---

## **5. DTO（Data Transfer Object，數據傳輸對象）**
- 用於 **Controller 層** 和 **Service 層** 之間的數據傳遞，避免直接暴露 **Entity** 給外部，增加安全性。

```java
public class UserDTO {
    private Long id;
    private String name;
    private String email;

    // Getter 和 Setter
}
```

---

## **6. 配置層（Config 層）**
- 負責 Spring Boot 的各種設定，如 **CORS 設定、數據源設定、安全性設定** 等。

### **範例：CORS 設定**
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }
}
```

---

## **7. 異常處理層（Exception Handling 層）**
- 用於統一處理應用中的異常，提升可維護性。

### **範例：全域異常處理**
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}
```

---

## **整體架構**
```
com.example.project
│── controller   → 負責接收請求 (Controller 層)
│── service      → 負責業務邏輯 (Service 層)
│── repository   → 負責數據訪問 (Repository 層)
│── entity       → 資料庫實體 (Entity 層)
│── dto          → 數據傳輸對象 (DTO)
│── config       → 配置信息 (Config 層)
│── exception    → 全域異常處理 (Exception Handling 層)
└── Application.java  → 主入口
```

---

## **結論**
Spring Boot 的分層架構有助於保持代碼的清晰和可維護性，每一層都有明確的職責：
- **Controller 層**：處理請求
- **Service 層**：處理業務邏輯
- **Repository 層**：數據存取
- **Entity 層**：數據結構
- **DTO 層**：數據傳輸
- **Config 層**：應用設定
- **Exception 層**：錯誤處理

這種架構適用於大多數的 Spring Boot 應用，能夠提高系統的可擴展性與可測試性 🚀