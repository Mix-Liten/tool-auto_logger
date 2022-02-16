## Auto_Logger

公司內專用的排程打卡工具
環境為 Windows 10 1909

### 使用說明

1. 需有 node 14 latest 版本以上環境，進入專案執行 `npm install`

2. 複製 `.env.example` 為 `.env`，並填寫如下變數
     - userid 員工編號
     - password 人資系統密碼
     - onHour 上班時間之`時數位`，如 8:30 上班，即 8 為時數、30 為分數
     - onMinute 上班時間之`分數位`
     - offHour 下班時間之`時數位`
     - offMinute 下班時間之`分數位`

3. 可選，使用 Google Sheet 排定以`日期為單位`的班表，`若無使用則預設週一到週五打上下班卡`
     1. 登入 google 帳號，[範例表單](https://docs.google.com/spreadsheets/d/16ZvIga5xAgOxhkPecJVzg8Ekcc30VsOc4ZbVSbadlXA/edit?usp=sharing)，建立副本到自己帳號下的雲端硬碟，沿用原格式並調整成當前月份排班表，**排班**`欄位只要有字即為需上班日`
     2. 依照[教學](https://ithelp.ithome.com.tw/articles/10234325)建立憑證並下載，以及將前步驟表單與服務帳戶共享
     3. 回到 `.env` 填寫如下變數
          - docID 表單網址中間的亂數ID，ex: `https://.../spreadsheets/d/<docID>/edit`
          - GOOGLE_SERVICE_ACCOUNT_EMAIL 下載下來憑證中的 `client_email`
          - GOOGLE_PRIVATE_KEY 下載下來憑證中的 `private_key`

4. 建置執行檔，`npm run build`，cd 進 /dist 資料夾並參閱下一段落 

### 執行檔的使用方式
1. 背景運行，但是會綁定使用指令的命令視窗
可選，後面的 log 紀錄，一個大於符號(>)會覆蓋舊檔，兩個(>>)則是插入後方

    ```bash
    start /B logger.exe >> log.txt
    ```


2. 印出 log.txt
可選，type 是一次全印，more 預設顯示屏幕高度並往下捲動

    ```bash
    type log.txt
    more log.txt
    ```

