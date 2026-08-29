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

   背景啟動 `npm start`，等它 compile 成功，然後告訴 Roy 開 http://localhost:3000 確認。有 $ARGUMENTS 描述本次改動時，明確指出要看哪幾個區塊。
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
