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
