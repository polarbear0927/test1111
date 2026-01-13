# 🎸 為什麼要演奏春日影 - 交流論壇前端專案

這是一個以《BanG Dream! It's MyGO!!!!!》為主題的簡單論壇系統。

## 🛠️ 技術規格
- **前端**: HTML5, CSS3, Vanilla JavaScript (原生 JS)
- **身份驗證**: 使用 `localStorage` 管理 JWT Token 與使用者資訊
- **資安規範**: 完全符合 CSP (Content Security Policy)，禁止行內腳本 (Inline Script) 以提升安全性

## 📋 已完成功能
1. **登入/註冊**: 包含 Email 格式檢查與圖片驗證邏輯
2. **論壇主頁**: 顯示討論文章，並根據登入狀態呈現不同 UI
3. **個人資料**: 支援大頭貼上傳 (Base64 編碼儲存) 與 Email 顯示

## ⚠️ 接手開發注意事項 (Handover Notes)
1. **事件綁定**: 請勿使用 `onclick` 屬性，必須使用 `addEventListener`，否則會被安全性政策攔截
2. **後端對接**: 目前前端透過 `fetch` 呼叫 `/api/auth/`。接手者需準備對應的 ASP.NET Core 或其他後端 API
3. **圖片儲存**: 目前大頭貼存於 `localStorage` (上限約 5MB)，未來建議串接雲端儲存空間

## 專案概述  
1. 專案功能  
  ● 使用者認證：提供註冊（Signup）與登入（Login）功能  
  ● 權限授權：基於角色的訪問控制，區分 `ROLE_USER`, `ROLE_MODERATOR`, `ROLE_ADMIN`  
  ● 狀態維護：使用 JWT 進行無狀態認證  
  ● 測試接口：提供不同權限等級可訪問的 API 端點（公共、僅限使用者、僅限管理員）
2. 架構  
  ● 採用 MVC 分層架構  
  ● Controller 層：處理 HTTP 請求並驗證輸入  
  ● Service/Security 層：處理業務邏輯、密碼加密及 JWT 令牌生成/驗證  
  ● Repository 層：使用 Spring Data JPA 與資料庫交互  
  ● Model 層：定義資料庫實體與傳輸對象
3. 部屬方式  
  可透過 Maven 打包為 JAR 檔，在任何安裝有 JRE 的環境運行，如果有寫Dockerfile也支援Docker化部屬  
4. 運行流程  
  (1). 用戶發送登入請求（含帳密）  
  (2). 系統驗證帳密，成功後生成 JWT  
  (3). 用戶後續請求在 Header 攜帶 `Authorization: Bearer <JWT>`  
  (4). `AuthTokenFilter` 攔截請求，驗證 JWT 有效性並將權限存入 `SecurityContext`  
  (5). Controller 根據權限決定是否允許訪問  

## 專案原始碼結構  
src/main/java/com/example/demo/  
├── SpringBootSecurityJwtApplication.java (啟動類)  
├── controllers/  
│&emsp;&emsp;├── AuthController.java (登入註冊入口)  
│&emsp;&emsp;└── TestController.java (權限測試接口)  
├── models/  
│&emsp;&emsp;├── ERole.java (枚舉類：USER, MODERATOR, ADMIN)  
│&emsp;&emsp;├── Role.java (資料表：roles)  
│&emsp;&emsp;└── User.java (資料表：users)  
├── payload/ (請求與回應的數據結構)  
│&emsp;&emsp;├── request/ (LoginRequest, SignupRequest)  
│&emsp;&emsp;└── response/ (UserInfoResponse, MessageResponse)  
├── repository/  
│&emsp;&emsp;├── RoleRepository.java  
│&emsp;&emsp;└── UserRepository.java  
└── security/  
&emsp;&emsp;├── WebSecurityConfig.java (核心安全配置)  
&emsp;&emsp;├── jwt/  
&emsp;&emsp;│&emsp;&emsp;├── AuthEntryPointJwt.java (異常處理)  
&emsp;&emsp;│&emsp;&emsp;├── AuthTokenFilter.java (過濾器)  
&emsp;&emsp;│&emsp;&emsp;└── JwtUtils.java (JWT 工具類)  
&emsp;&emsp;└── services/  
&emsp;&emsp;&emsp;&emsp;&emsp;├── UserDetailsImpl.java  
&emsp;&emsp;&emsp;&emsp;&emsp;└── UserDetailsServiceImpl.java (用戶資料加載)  

##  安全設計說明
1. 密碼加密：使用 `BCryptPasswordEncoder` 對用戶密碼進行單向雜湊存儲，防止資料庫洩漏後密碼被還原
2. JWT 認證：  
   ● 使用 `HS256` 算法簽名  
   ● 令牌包含用戶資訊與過期時間，避免在伺服器端存儲 Session  
3. 跨域防護 (CORS)：在 `WebSecurityConfig` 中配置了 CORS，限制僅允許特定來源訪問
4. 預防攻擊：Spring Security 默認配置了防護措施，且通過 `AuthTokenFilter` 過濾非法請求
5. 授權控制：使用 `@PreAuthorize` 註解在方法層級控制 API 訪問權限

## 運行環境
● 作業系統：Windows / macOS / Linux   
● 開發環境：Visual Studio Code  
● 後端環境：Node.js v14+ / npm  
● 瀏覽器限制：建議使用 Chrome 或 Edge 以確保 localStorage 與圖片渲染完全相
容  
● 偵錯工具：  
&emsp;&emsp;○ DevTools (F12)：監測 Application 標籤中的 localStorage 變動   
&emsp;&emsp;○ Network 標籤：監控 API 請求狀態與路徑正確性  

## 資料庫建置方式與資料表設計  
1. 建置方式：  
   在 `src/main/resources/application.properties` 中配置  
   spring.datasource.url=jdbc:mysql://localhost:3306/testdb  
   spring.datasource.username=******  
   spring.datasource.password=******  
   spring.jpa.hibernate.ddl-auto=update
   初次運行需手動在 `roles` 表中插入三筆初始化資料：`ROLE_USER`, `ROLE_MODERATOR`, `ROLE_ADMIN`
2. 資料表設計：  
   ● user  
   &emsp;○ `id`: BigInt (Primary Key, Auto Increment)  
   &emsp;○ `username`: Varchar(20) (Unique)  
   &emsp;○ `email`: Varchar(50) (Unique)  
   &emsp;○ `password`: Varchar(120) (BCrypt 雜湊值)  
   ● roles  
   &emsp;○ `id`: Integer (Primary Key)  
   &emsp;○ `name`: Varchar(20) (存儲 ROLE_USER 等)  
   ● user_roles  
   &emsp;○ `user_id`: BigInt (Foreign Key -> users.id)  
   &emsp;○ `role_id`: Integer (Foreign Key -> roles.id)  
