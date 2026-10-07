// 個人資料蒐集告知事項的設定。
//
// 告知事項的正文寫在 js/render.js 的 buildPersonalDataNotice()，
// 這裡只放會重複出現、或之後可能單獨異動的欄位。
//
// ⚠️ 這是法律文件。內容如有實質修改（不只是錯字），請一併把 noticeVersion
//    往上加一版，之後才分得出每一筆同意是針對哪一版給的。
//
// 改完這個檔案記得 git push，正式網站才會更新。

export const PRIVACY_CONFIG = {
  // 依法實際蒐集及利用資料的單位，兩家合稱「主辦單位」。
  collectors: [
    '波利馬資訊科技有限公司（六角學院）',
    '多角人才顧問有限公司'
  ],

  // 課程／活動資訊的寄送單位（對應「我願意收到六角學院的課程／活動資訊」）。
  courseProvider: '波利馬資訊科技有限公司（六角學院）',

  // 職缺／人才媒合的聯繫單位（對應「有適合我的職缺時，多角人才可以聯絡我」）。
  jobProvider: '多角人才顧問有限公司',

  // 當事人要行使查詢、更正、刪除等權利時的聯絡信箱。
  contactEmail: 'service@hexschool.com',

  // 活動資料的保存期間。
  retentionPeriod: '自蒐集日起保存 2 年',

  // 告知事項的最後更新日期，顯示在彈窗底部。
  lastUpdated: '2026 年 10 月 7 日',

  // 同意書版本。內容有實質調整時請往上加一版。
  noticeVersion: '2026-survival-lab-v1'
};
