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