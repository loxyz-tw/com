---
name: deploy
description: 把 fun-tech.vip 官網發佈上線——切到 master、檢查 CNAME、本地預覽、經 Roy 確認後才跑 npm run deploy。
disable-model-invocation: true
---

發佈 https://fun-tech.vip。**這是對外動作，未經 Roy 明確確認不可執行最後一步。**

依序執行，任何一步失敗就停下來回報，不要自己想辦法繞過：

1. **切到原始碼分支**

   ```bash
   git status --porcelain        # 有未提交變更就先停下來問
   git checkout master
   git pull --ff-only
   ```

   若 `node_modules` 不存在，執行 `npm install`。

2. **檢查 CNAME**

   ```bash
   cat public/CNAME              # 必須是 fun-tech.vip
   ```

   內容不對或檔案不存在就停下來——這個檔案掉了會讓自訂網域斷線。不要自己補寫後就直接發佈，先告訴 Roy。

3. **本地預覽**

   背景啟動 `npm start`，等它 compile 成功，然後 agent 自己用 Chrome 自動化檢查，把結果呈現給 Roy，Roy 只需要看過點頭。有 $ARGUMENTS 描述本次改動時，明確指出要看哪幾個區塊。

   預覽不能只是一張靜態截圖。至少涵蓋：

   - desktop 與 mobile 兩種寬度的截圖
   - 讀 console，確認沒有 error
   - 實際操作導覽捲動與手機版選單，確認 react-scroll 正常
   - 檢查對外連結沒有壞掉

   Chrome 自動化不可用時，fallback：請 Roy 自己開 http://localhost:3000 確認。不可以因為工具不能用就跳過預覽。

   看完後把 dev server 關掉。

4. **確認提交**

   確保這次的原始碼改動已經 commit 並 push 到 `master`（`gh-pages` 只是產物，不是紀錄）。

5. **問過再發佈**

   把「將要發佈什麼、會影響正式站」講清楚，**等 Roy 回覆同意**，才執行：

   ```bash
   npm run deploy
   ```

6. **驗收**

   回報 deploy 輸出結果，並提醒 GitHub Pages 通常需要一兩分鐘才會更新。
