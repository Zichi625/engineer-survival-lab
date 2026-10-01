# 設計規範（DESIGN.md）

這份文件記錄「工程師生存實驗室」目前畫面上已經在用的顏色、間距、字體、元件樣式規則。

**使用方式：每次要調整畫面相關的東西之前，先讀過這份文件，確保新加的樣式跟現有的規則一致，不要憑感覺另外發明一套新的數字。** 如果規則本身需要修改，先更新這份文件，再動 `style.css`。

對應的程式檔案：`style.css`（所有樣式都在這一個檔案裡，沒有拆成多個檔案）。

---

## 1. 色彩

### 1.1 基礎色（`:root` 變數，定義在 `style.css` 最上面）

| 變數名稱 | 數值 | 用途 |
|---|---|---|
| `--color-bg` | `#12161A` | 全站底色（一般畫面） |
| `--color-bg-2` | `#1A1F26` | 底色漸層的第二色 |
| `--color-text` | `#E2E8F0` | 一般內文文字 |
| `--color-text-soft` | `#94A3B8` | 次要／說明文字（標籤、小字） |
| `#F8FAFC` | （未建立變數，直接寫死） | 最亮的標題文字 |
| `--color-card-bg` | `rgba(255,255,255,0.04)` | 玻璃卡片底色 |
| `--color-card-border` | `rgba(255,255,255,0.08)` | 玻璃卡片邊框 |
| `--color-accent` | `#FF6B6B` | 主強調色（珊瑚紅），用在主按鈕、選中狀態 |
| `--color-accent-strong` | `#EF4444` | 主強調色的漸層深色端 |
| `--color-selected` | `rgba(255,107,107,0.16)` | 選項被選中時的底色 |
| `--color-selected-border` | `rgba(255,107,107,0.55)` | 選項被選中時的邊框 |

### 1.2 延伸強調色（目前直接寫在各元件的 CSS 裡，沒有收進變數，但已經是固定搭配）

這是首頁科技感改版（HUD／資訊卡／徽章）之後慣用的第二組配色，語意上代表「科技／AI／資料」，跟上面的珊瑚紅是兩組不同用途的顏色：

| 顏色 | 數值 | 用途 |
|---|---|---|
| 青色 Cyan | `#22D3EE` | 徽章 a（例如「工作狀態」） |
| 淺藍 Light Blue | `#7DD3FC` | 徽章 b、HUD 掃描環、icon 預設色 |
| 紫色 Purple | `#A78BFA` / `#C4B5FD` | 徽章 c、CTA 漸層尾端 |
| 綠色 Green | `#34D399` | 系統狀態燈號（SYSTEM ONLINE）、勾選圖示 |
| 黃色 Amber | `#FBBF24` | 任務／獎勵相關圖示 |

**規則：** 新增跟「科技感 HUD」有關的元素（徽章、掃描環、資訊卡）要從這組顏色裡選，不要另外發明新的顏色。人設結果頁（`result-card`）的強調色則是動態的，來自每個人設自己的 `--persona-accent` / `--persona-accent-strong`（在 `results.js` 裡各自定義），不是固定色。

---

## 2. 間距

目前沒有收成正式的間距變數（像 `--space-sm` 這種），但實際用下來有一套慣用數字，**新增樣式時請從下面這張表挑，不要用表外的數字**（例如不要用 7px、15px 這種奇怪的中間值）：

| 數值 | 用途 |
|---|---|
| `4px` | 極小間隔（例如圖示跟數字之間） |
| `6px` | 小元件內部間距（例如 `.status-online` 圖示跟文字） |
| `8px` | 卡片內部小間距、資訊卡 grid 間距 |
| `10px` | 一般小區塊間距（例如 `.screen--intro` 的整體間距、checkbox 列表間距） |
| `12px` | 選項卡片之間的間距（`.options-grid`） |
| `14px`–`16px` | 卡片內部 padding、一般區塊之間的間距（`.screen` 預設 gap 是 16px） |
| `18px`–`24px` | 卡片內部較大 padding（結果頁卡片 `.result-card` 是 `28px 24px`） |

**目前已知的例外（故意的，不是錯誤）：**
`.intro-body--tags { margin-bottom: 6px; }`——這段文字跟下面徽章之間的間距原本用負間距硬拉近（手機版 390×844 第一屏塞不下的緣故），2026-10 已經放寬到 `6px`（跟上層 `.screen--intro` 的 `10px` gap 疊加，實際間距約 16px，符合第 2 節「一般區塊間距」的級距）。放寬後已確認 390×844 手機版 CTA 按鈕跟底部文字仍然在第一屏內，之後如果要再調整，一樣要用瀏覽器把視窗設成 390×844 檢查一次。

---

## 3. 圓角

| 變數 | 數值 | 用途 |
|---|---|---|
| `--radius-md` | `16px` | 大部分卡片、按鈕的圓角（最常用） |
| `--radius-lg` | `24px` | 結果頁大卡片 `.result-card` |
| `999px` | 完全圓角（藥丸形狀） | 徽章 `.intro-tag`、進度條、圓形按鈕 |

---

## 4. 字體大小

目前沒有收成變數，直接列出實際在用的級距（由小到大）：

| 大小 | 用途 |
|---|---|
| `9px` | 資訊卡最小的英文標籤（`.info-label`） |
| `10px`–`11px` | HUD 小字、footer（`.intro-footer`、`.hud-scanning-label`） |
| `12px`–`13px` | 次要說明文字、徽章文字 |
| `14px`–`15px` | 一般內文、選項文字 |
| `16px`–`18px` | 按鈕文字、小標題 |
| `19px`–`22px` | 區塊標題（`.level-prompt`、`.result-highlight-text`） |
| `28px`–`30px` | 頁面大標題（`.intro-title`、`.result-name`） |
| `56px` | 最大數字（生存分數 `.result-score-number`） |

字型固定用 `"Inter", "PingFang TC", "Noto Sans TC", ...`（在 `body` 上設定一次，不用每個元件重複寫）。

---

## 5. 圖示（Icon）規範

這是這次使用者特別反應過「大小不一致」的地方，規則整理如下：

### 5.1 手繪線稿 SVG 圖示（`js/icons.js` 裡的 `ROLE_ICONS` / `OPTION_ICONS`）
- `viewBox="0 0 48 48"`、`stroke-width="1.8"`、`stroke="currentColor"`、`fill="none"`
- 外層容器 `.option-icon` 固定 `width: 40px; height: 40px;`
- 統一套用淺藍色發光效果（`color: #7DD3FC` + 三層 `drop-shadow`）
- **規則：新畫的題目線稿圖示都要用這個規格，不要用別的 viewBox 尺寸。**

### 5.2 系統小圖示（`js/icons.js` 裡的 `STAT_ICONS` / `UI_ICONS`）
- `viewBox="0 0 24 24"`、`stroke-width="2"`
- 依使用情境縮放容器大小（13px～22px 不等，例如結果頁 stat 圖示 22px、HUD checklist 圖示 13px）

### 5.3 吉祥物素材圖片（PNG，`assets/` 底下）
- 用 `<img>` 搭配 `object-fit: contain`，容器給固定的 `max-width` / `max-height`，不要直接用圖片原始大小
- 目前慣用容器尺寸：選項圖片 `.option-image` 是 `max-width/height: 56px`，結果頁標籤圖片 `.result-tag-image` 是 `32px`，任務徽章 `.result-mission-badge` 是 `44px`

### 5.4 第三方品牌標誌（`js/icons.js` 的 `BRAND_ICONS`）

用在 L09「AI Coding 夥伴」這題。跟其他手繪線稿圖示不一樣，**這組是真實公司的商標，規則完全不同**：

- 路徑資料一律照抄官方／開源品牌庫（目前用 [simple-icons](https://simpleicons.org)，CC0 授權）的原始 SVG，**不重新繪製、不重新詮釋、不加特效**
- 不套用 `.option-icon` 的發光濾鏡，改用專用的 `.option-icon--brand` 容器：`48×52px`、深色玻璃卡片（`rgba(255,255,255,.04)` 底、`rgba(255,255,255,.08)` 邊框、`12px` 圓角）、`filter: none`
- 顏色規則：品牌本身有專屬色的（Claude 橘 `#D97757`、Gemini 紫 `#8E75B2`）維持官方色；原本是黑／白單色商標的（ChatGPT、Cursor、Copilot、Windsurf）在這個深色介面上用白色——這是這類單色標誌本來就該有的「深色背景版本」，不是重新配色
- 非品牌的選項（「其他」「沒使用」）用 [Lucide](https://lucide.dev) 的 `Settings` / `MoreHorizontal`，一樣是照抄原始路徑，套同一個 `.option-icon--brand` 容器
- **商標使用要先確認版權方沒有明確反對**，不是「抓得到檔案就能用」——如果某個品牌的標誌已經被來源庫下架、或使用方式有爭議，要先跟使用者確認，不要自己決定硬是用舊版本

---

## 6. 元件樣式模式

### 6.1 玻璃卡片（Glass Card）
這是整個網站最基本的卡片樣式，所有「卡片感」的元件都是這個模式的變形：
```css
background: rgba(255, 255, 255, 0.04);
border: 1px solid rgba(255, 255, 255, 0.08~0.10);
border-radius: var(--radius-md);
backdrop-filter: blur(10px~20px);
```
用在：`.option-card`、`.info-card`、`.hud-panel`、`.result-detail-section`、`.result-mission`

### 6.2 漸層外框按鈕（Gradient Border Button）
`.btn-cta` 用的手法：用 `::before` 偽元素 + `mask-composite: exclude`，做出「只有邊框是漸層色、中間維持深色玻璃底」的效果，而不是整顆按鈕塗滿顏色。**這是目前唯一的 CTA 樣式，新的主要行動按鈕如果要做「高級感」都照這個模式做**，不要做成早期版本那種整顆塗滿珊瑚紅的按鈕。

### 6.3 徽章／標籤（Pill Badge）
`.intro-tag`、`.result-tag--buff` 用的模式：
```css
border-radius: 999px;
background: 該顏色 12%~16% 透明度;
border: 1px solid 該顏色 35%~45% 透明度;
color: 該顏色;
```

### 6.4 動畫時間長度
- 微互動（hover、點擊回饋）：`0.15s`
- 畫面切換、內容淡入：`0.3s ~ 0.5s`
- 環境背景動畫（HUD 旋轉環、吉祥物飄浮）：刻意放很慢，`2.2s ~ 32s` 之間，讓畫面「感覺活著」但不會讓人分心或頭暈——**新增背景裝飾動畫時，速度要慢，不要低於 2 秒一個循環。**

---

## 7. 版面容器規則

- 整個網站固定在 `#app { max-width: 480px }` 的窄版單欄版面，不管是手機還是電腦瀏覽器打開，畫面都維持手機版型的寬度（這是刻意的設計，因為這是「手機掃 QR Code 填答」為主的攤位問卷，電腦上打開只是為了預覽）
- 唯一的例外是首頁的桌面版「懸浮 HUD 面板」（`@media (min-width: 900px)`），這些面板用絕對定位延伸到 480px 版面外側，只在桌面寬螢幕才顯示，手機版完全隱藏（`display: none`）
- **手機版第一屏優先原則**：首頁（`.screen--intro`）的內容高度要確保在 390×844 這個尺寸下，「開始測驗」按鈕跟底部文字都在不滑動的情況下看得到。之後调整首頁間距前，務必用瀏覽器把視窗設成 390×844 檢查。

---

## 8. 目前已知的待確認事項

1. ~~L09「AI Coding 夥伴」圖示大小不一致~~——2026-10 已處理：換成各工具的官方品牌 Logo（`js/icons.js` 的 `BRAND_ICONS`，來源是 simple-icons 這個 CC0 授權、專門收錄品牌圖示的開源庫，逐字照抄原始路徑，沒有重新繪製或美化），統一包在 5.3 節定義的 `option-icon--brand` 容器裡（`48×52px`，深色玻璃卡片，無發光/漸層）。單色黑底的品牌標誌（ChatGPT、Cursor、Copilot、Windsurf）在深色卡片上改用白色呈現——這是這類單色商標本來就預期的「深色背景版本」，不是重新配色。有真正品牌色的（Claude 的橘色 `#D97757`、Gemini 的紫色 `#8E75B2`）維持官方原色不變。「其他」「沒使用」兩格不是品牌，改用 Lucide 的 Settings／MoreHorizontal 圖示（同樣是照抄原始路徑，來源是 lucide-static，ISC 授權）。

   ⚠️ **ChatGPT 的 Logo 要特別注意**：simple-icons 這個庫已經把 OpenAI 的商標下架，因為 OpenAI 官方要求移除——這是商標方明確表態不希望被這樣收錄使用。這格目前用的圖檔是使用者自己提供、自行負責的版本，不是從 simple-icons 抓的。之後如果要異動這個圖示，要留意這個背景，不要又去抓開源庫裡類似的「仿製」版本。
2. ~~「完成 12 個生存關卡，分析你的」下方間距太擠~~——2026-10 已調整為 `margin-bottom: 6px`，問題已處理，見第 2 節。
