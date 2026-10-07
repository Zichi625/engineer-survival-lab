import { QUESTIONS } from './questions.js';
import { ROLE_ICONS, STAT_ICONS, OPTION_ICONS, UI_ICONS, BRAND_ICONS } from './icons.js';
import { flashClass } from './animations.js';
import { PRIVACY_CONFIG } from '../privacy-config.js';

// The notice quotes this word for word, so both read from here. One tick
// covers both 主辦單位 -- section 一 of the notice names them, which is what
// makes a single combined consent workable.
var CONSENT_LABELS = {
  marketing: '我願意收到課程、活動、職缺及職涯相關資訊'
};

var TOTAL_LEVELS = QUESTIONS.length;

var AI_TOOL_BRAND_KEYS = {
  chatgpt: 'chatgpt',
  claude: 'claude',
  cursor: 'cursor',
  copilot: 'githubcopilot',
  gemini: 'googlegemini',
  windsurf: 'windsurf'
};

function mascotSrc(mood) {
  return 'assets/mascot/mascot-' + (mood || 'coding') + '.png';
}

function buildSystemStatus() {
  var statusBar = createEl('div', 'intro-status-bar');
  var statusOnline = createEl('div', 'status-online');
  statusOnline.appendChild(createEl('span', 'status-dot'));
  statusOnline.appendChild(document.createTextNode('SYSTEM ONLINE'));
  var statusLab = createEl('div', 'status-lab');
  statusLab.appendChild(document.createTextNode('SURVIVAL LAB / 2026 '));
  var statusGlyph = createEl('span', 'status-glyph');
  statusGlyph.textContent = '</>';
  statusLab.appendChild(statusGlyph);
  statusBar.appendChild(statusOnline);
  statusBar.appendChild(statusLab);
  return statusBar;
}

function buildMascotScanner() {
  var hudWrap = createEl('div', 'intro-hud-wrap');
  var parts = [
    createEl('div', 'hud-ticks'),
    createEl('div', 'hud-arc'),
    createEl('div', 'hud-ring hud-ring--1'),
    createEl('div', 'hud-ring hud-ring--2'),
    createEl('div', 'hud-ring hud-ring--3'),
    createEl('div', 'hud-crosshair')
  ];
  ['n', 'e', 's', 'w'].forEach(function (dir) {
    parts.push(createEl('div', 'hud-dot hud-dot--' + dir));
  });
  var hero = createEl('div', 'hero-illustration');
  var heroImg = document.createElement('img');
  heroImg.src = mascotSrc('cheering');
  heroImg.alt = '多角龍研究員';
  hero.appendChild(heroImg);
  parts.push(hero);
  var scanningLabel = createEl('div', 'hud-scanning-label');
  scanningLabel.textContent = 'SCANNING...';
  parts.push(scanningLabel);
  var codeSymbolA = createEl('span', 'hud-code-symbol hud-code-symbol--1');
  codeSymbolA.textContent = '</>';
  var codeSymbolB = createEl('span', 'hud-code-symbol hud-code-symbol--2');
  codeSymbolB.textContent = '01';
  parts.push(codeSymbolA, codeSymbolB);

  parts.forEach(function (el) { hudWrap.appendChild(el); });
  return hudWrap;
}

function buildTechBadge(label, variant) {
  var tagEl = createEl('span', 'intro-tag intro-tag--' + variant);
  var icon = createEl('span', 'intro-tag-icon');
  icon.innerHTML = variant === 'a' ? STAT_ICONS.cpu : variant === 'b' ? ROLE_ICONS.ai : STAT_ICONS.radar;
  tagEl.appendChild(icon);
  tagEl.appendChild(document.createTextNode(label));
  return tagEl;
}

function buildGameInfoCard(def) {
  var card = createEl('div', 'info-card');
  var icon = createEl('div', 'info-icon');
  icon.innerHTML = def.icon;
  var value = createEl('div', 'info-value');
  value.textContent = def.value;
  var label = createEl('div', 'info-label');
  label.textContent = def.label;
  var sub = createEl('div', 'info-sub');
  sub.textContent = def.sub;
  [icon, value, label, sub].forEach(function (el) { card.appendChild(el); });
  return card;
}

function buildHudPanel(variant, content) {
  var panel = createEl('div', 'hud-panel hud-panel--' + variant);
  panel.setAttribute('aria-hidden', 'true');
  panel.appendChild(content);
  return panel;
}

function buildCodePanel() {
  var pre = createEl('pre', 'hud-panel-code');
  pre.textContent = "const future = {\n  career: 'You',\n  ai: 'Opportunity',\n  status: 'Loading...'\n}";
  pre.appendChild(createEl('span', 'hud-code-caret'));
  return pre;
}

function buildChecklistPanel() {
  var list = createEl('div', 'hud-panel-checklist');
  ['AI', 'CAREER', 'SKILLS', 'OPPORTUNITY'].forEach(function (label) {
    var row = createEl('div', 'hud-checklist-row');
    var check = createEl('span', 'hud-checklist-icon');
    check.innerHTML = UI_ICONS.check;
    row.appendChild(check);
    row.appendChild(document.createTextNode(label));
    list.appendChild(row);
  });
  return list;
}



function buildInitializeButton(handlers) {
  var startBtn = createEl('button', 'btn-cta');
  startBtn.type = 'button';
  var ctaMain = createEl('span', 'btn-cta-main');
  ctaMain.appendChild(document.createTextNode('INITIALIZE TEST '));
  var ctaArrow = createEl('span', 'btn-cta-arrow');
  ctaArrow.textContent = '→';
  ctaMain.appendChild(ctaArrow);
  var ctaSub = createEl('span', 'btn-cta-sub');
  ctaSub.textContent = '開始生存測驗';
  startBtn.appendChild(ctaMain);
  startBtn.appendChild(ctaSub);
  startBtn.addEventListener('click', handlers.onStart);
  return startBtn;
}

export function renderIntro(root, handlers) {
  root.innerHTML = '';
  var screen = createEl('div', 'screen screen--intro');
  var fadeIndex = 0;
  function fadeUp(el) {
    el.classList.add('intro-fade-up');
    el.style.animationDelay = (fadeIndex * 70) + 'ms';
    fadeIndex += 1;
    return el;
  }

  screen.appendChild(fadeUp(buildSystemStatus()));

  var heroStage = createEl('div', 'intro-hero-stage');
  heroStage.appendChild(buildHudPanel('code', buildCodePanel()));
  heroStage.appendChild(buildMascotScanner());
  heroStage.appendChild(buildHudPanel('checklist', buildChecklistPanel()));
  screen.appendChild(fadeUp(heroStage));

  var eyebrowRow = createEl('div', 'intro-eyebrow-row');
  eyebrowRow.appendChild(createEl('span', 'eyebrow-line'));
  var eyebrow = createEl('span', 'intro-eyebrow');
  eyebrow.textContent = 'ENGINEER SURVIVAL LAB';
  eyebrowRow.appendChild(eyebrow);
  eyebrowRow.appendChild(createEl('span', 'eyebrow-line'));
  screen.appendChild(fadeUp(eyebrowRow));

  var title = createEl('h1', 'intro-title');
  title.textContent = '工程師生存實驗室';
  screen.appendChild(fadeUp(title));

  var brand = createEl('p', 'intro-brand');
  brand.textContent = '六角學院 X 多角人才共同開發';
  screen.appendChild(fadeUp(brand));

  var subtitle = createEl('p', 'intro-subtitle');
  subtitle.textContent = 'AI 時代，你是哪一種工程師生存者？';
  screen.appendChild(fadeUp(subtitle));

  var bodyTags = createEl('p', 'intro-body intro-body--tags');
  bodyTags.appendChild(document.createTextNode('完成 12 個生存關卡，分析你的'));
  screen.appendChild(fadeUp(bodyTags));

  var tagRow = createEl('div', 'intro-tag-row');
  tagRow.appendChild(buildTechBadge('工作狀態', 'a'));
  tagRow.appendChild((function () { var s = createEl('span', 'intro-tag-sep'); s.textContent = '×'; return s; })());
  tagRow.appendChild(buildTechBadge('AI 適應度', 'b'));
  tagRow.appendChild((function () { var s = createEl('span', 'intro-tag-sep'); s.textContent = '×'; return s; })());
  tagRow.appendChild(buildTechBadge('轉職雷達', 'c'));
  screen.appendChild(fadeUp(tagRow));

  var infoGrid = createEl('div', 'intro-info-grid');
  var infoDefs = [
    { icon: UI_ICONS.layers, value: '12', label: 'LEVELS', sub: '生存關卡' },
    { icon: UI_ICONS.clock, value: '60–90s', label: 'EST. TIME', sub: '預計完成時間' },
    // Not 'ANONYMOUS MODE' any more: registration now takes an Email, so a
    // blanket anonymity claim would not match what the data actually does.
    { icon: STAT_ICONS.lock, value: 'NO LOGIN', label: 'QUICK START', sub: '免註冊帳號' }
  ];
  infoDefs.forEach(function (def) { infoGrid.appendChild(buildGameInfoCard(def)); });
  screen.appendChild(fadeUp(infoGrid));

  screen.appendChild(fadeUp(buildInitializeButton(handlers)));

  var footer = createEl('p', 'intro-footer');
  footer.textContent = 'ENGINEER SURVIVAL LAB // EXPERIMENT 2026';
  screen.appendChild(fadeUp(footer));

  root.appendChild(screen);
}

function buildFormField(opts) {
  var wrap = createEl('div', 'profile-field');
  var row = createEl('label', 'profile-label-row');
  row.setAttribute('for', opts.id);
  var label = createEl('span', 'profile-label');
  label.appendChild(buildIconSpan(opts.icon, 'profile-label-icon'));
  label.appendChild(document.createTextNode(opts.label));
  row.appendChild(label);
  var tag = createEl('span', 'profile-tag' + (opts.required ? ' profile-tag--required' : ''));
  tag.textContent = opts.required ? '必填' : '選填';
  row.appendChild(tag);
  wrap.appendChild(row);

  var input = document.createElement('input');
  input.type = opts.type || 'text';
  input.id = opts.id;
  input.className = 'profile-input';
  input.placeholder = opts.placeholder;
  if (opts.maxLength) input.maxLength = opts.maxLength;
  if (opts.autocomplete) input.autocomplete = opts.autocomplete;
  input.value = opts.value || '';
  wrap.appendChild(input);

  var help = createEl('p', 'profile-help');
  help.textContent = opts.help;
  wrap.appendChild(help);

  return { wrap: wrap, input: input };
}

function buildConsentCheckbox(opts) {
  var row = createEl('label', 'consent-row');
  var input = document.createElement('input');
  input.type = 'checkbox';
  input.className = 'consent-box';
  input.checked = false;          // never pre-ticked
  row.appendChild(input);

  var body = createEl('span', 'consent-body');
  var text = createEl('span', 'consent-text');
  opts.parts.forEach(function (part) {
    if (typeof part === 'string') {
      text.appendChild(document.createTextNode(part));
      return;
    }
    // A link inside a <label> would toggle the box, so it is a button that
    // stops the click from reaching the label.
    var link = createEl('button', 'consent-link');
    link.type = 'button';
    link.textContent = part.label;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      part.onClick();
    });
    text.appendChild(link);
  });
  body.appendChild(text);
  if (opts.tag) {
    var tag = createEl('span', 'consent-tag');
    tag.textContent = opts.tag;
    body.appendChild(tag);
  }
  row.appendChild(body);
  return { row: row, input: input };
}

function buildMarketingConsent() {
  return buildConsentCheckbox({ parts: [CONSENT_LABELS.marketing], tag: '選填' });
}

function buildStartTestButton(onClick) {
  var btn = createEl('button', 'btn-start');
  btn.type = 'button';
  var label = createEl('span', 'btn-start-label');
  label.textContent = '開始生存測驗';
  btn.appendChild(label);
  var arrow = createEl('span', 'btn-start-arrow');
  arrow.innerHTML = UI_ICONS.chevronRight;
  btn.appendChild(arrow);
  btn.addEventListener('click', onClick);
  return btn;
}

function buildPersonalDataNotice(onClose) {
  var cfg = PRIVACY_CONFIG;

  var overlay = createEl('div', 'notice-overlay');
  var sheet = createEl('div', 'notice-sheet');
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-modal', 'true');
  sheet.setAttribute('aria-labelledby', 'notice-heading');

  var header = createEl('div', 'notice-header');
  var heading = createEl('div', 'notice-heading-group');
  var h = createEl('h2', 'notice-title');
  h.id = 'notice-heading';
  h.textContent = '個人資料蒐集告知事項';
  var sub = createEl('p', 'notice-subtitle');
  sub.textContent = 'PERSONAL DATA NOTICE';
  heading.appendChild(h);
  heading.appendChild(sub);
  header.appendChild(heading);
  var closeBtn = createEl('button', 'notice-close');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', '關閉');
  closeBtn.innerHTML = UI_ICONS.close;
  closeBtn.addEventListener('click', onClose);
  header.appendChild(closeBtn);
  sheet.appendChild(header);

  var body = createEl('div', 'notice-body');

  // Blocks: a string is a paragraph, an array is a bullet list, and
  // { sub: '...' } is a numbered sub-heading inside a section.
  function section(title, blocks) {
    var sec = createEl('section', 'notice-section');
    var t = createEl('h3', 'notice-section-title');
    t.textContent = title;
    sec.appendChild(t);
    blocks.forEach(function (block) {
      if (Array.isArray(block)) {
        var ul = createEl('ul', 'notice-list');
        block.forEach(function (item) {
          var li = createEl('li');
          li.textContent = item;
          ul.appendChild(li);
        });
        sec.appendChild(ul);
        return;
      }
      // Must test the type: every string has a legacy String.prototype.sub,
      // so `block.sub` alone is truthy for plain paragraphs too.
      if (block && typeof block === 'object' && block.sub) {
        var sh = createEl('p', 'notice-subheading');
        sh.textContent = block.sub;
        sec.appendChild(sh);
        return;
      }
      var p = createEl('p', 'notice-text');
      p.textContent = block;
      sec.appendChild(p);
    });
    body.appendChild(sec);
  }

  var lead = createEl('p', 'notice-lead');
  lead.textContent = '為辦理「2026 工程師生存實驗室」活動及提供相關服務，' +
    cfg.collectors.join('及') + '依《個人資料保護法》相關規定，向您說明下列事項：';
  body.appendChild(lead);

  section('一、蒐集單位', [
    '本活動個人資料蒐集及利用單位為：',
    cfg.collectors,
    '以下合稱「主辦單位」。'
  ]);

  section('二、蒐集目的', ['主辦單位蒐集之資料將用於下列目的：', [
    '辦理「2026 工程師生存實驗室」活動。',
    '活動參與、線上報到及必要聯繫。',
    '產生個人化工程師生存測驗結果及生存卡。',
    '進行工程師職涯、工作狀態、AI 使用情形及相關趨勢之統計與分析。',
    '如您另行同意接收相關資訊，' + cfg.courseProvider + '得透過電子郵件提供工程師學習、課程、講座、活動及相關服務資訊。',
    '如您另行同意接收相關資訊，' + cfg.jobProvider + '得依您提供之資料及職涯需求，提供職缺、人才媒合、職涯發展建議及相關職涯服務資訊。'
  ]]);

  section('三、蒐集之個人資料類別', ['本活動可能蒐集下列資料：', [
    '暱稱／實驗代號。',
    '電子郵件地址。',
    '本活動問卷及測驗作答資料。',
    '求職狀態，以及您自行選擇是否接收課程、活動、職缺及職涯相關資訊之意願。',
    '活動參與及系統運作所必要之紀錄。'
  ]]);

  section('四、個人資料來源', [
    '上述資料由您本人於「2026 工程師生存實驗室」活動頁面直接提供。'
  ]);

  section('五、個人資料利用之期間、地區、對象及方式', [
    { sub: '1. 利用期間' },
    [
      '本活動之報到、問卷、測驗及相關活動資料，' + cfg.retentionPeriod + '；保存期間屆滿或蒐集目的消失後，依相關規定停止利用或刪除。',
      '如您另行同意接收課程、活動、職涯或人才媒合相關資訊，相關聯絡資料得利用至您撤回同意、取消訂閱，或相關服務及蒐集目的消失為止。',
      '法令另有保存規定者，依相關法令規定辦理。'
    ],
    { sub: '2. 利用地區' },
    '中華民國（臺灣），以及提供本活動所必要之資訊系統、電子郵件寄送或雲端服務所在地區。',
    { sub: '3. 利用對象' },
    cfg.collectors.concat(['為提供本活動、資訊系統、資料儲存、電子郵件寄送及相關服務所必要之受託服務提供者。']),
    { sub: '4. 利用方式' },
    '以自動化或非自動化方式進行個人資料之蒐集、處理及利用，包括活動報到、測驗結果產生、統計分析、活動聯繫，以及依您所選擇之同意項目提供課程、活動、職涯或人才媒合相關資訊。'
  ]);

  section('六、當事人權利', ['您得依《個人資料保護法》相關規定，就您的個人資料行使下列權利：', [
    '查詢或請求閱覽。',
    '請求製給複製本。',
    '請求補充或更正。',
    '請求停止蒐集、處理或利用。',
    '請求刪除。'
  ], '如需行使上述權利，請聯絡：' + cfg.contactEmail,
    '主辦單位將依相關法令及內部作業程序處理。']);

  section('七、不提供個人資料之影響', [
    '暱稱／實驗代號為選填。如未提供，系統得以隨機實驗代號顯示於您的生存卡。',
    'Email 為本活動線上報到之必要資料。如不提供 Email，將無法完成本活動之線上報到及進入測驗。',
    '是否同意接收課程、活動、職缺及職涯相關資訊，由您自由選擇。',
    '未勾選上述選填項目，不影響您參與本次活動、完成測驗及取得工程師生存卡。'
  ]);

  section('八、課程、活動資訊及人才媒合', [
    '如您勾選「' + CONSENT_LABELS.marketing + '」，即表示您同意主辦單位依本告知事項所載方式，提供下列資訊：',
    [
      cfg.courseProvider + '：透過電子郵件提供工程師學習、課程、講座、活動及相關服務資訊。',
      cfg.jobProvider + '：依您提供之資料及職涯需求，提供職缺、人才媒合、職涯發展建議、產業與人才市場趨勢及相關職涯服務資訊。'
    ],
    '您可隨時透過電子郵件中的「取消訂閱」功能，或聯絡 ' + cfg.contactEmail + '，停止接收上述資訊或提出停止利用之要求。',
    '本項為自由選擇，未勾選或日後取消，不影響您參與本次活動或已取得之測驗結果及生存卡。'
  ]);

  section('九、其他說明', [
    '主辦單位將於蒐集目的必要範圍內處理及利用您的個人資料，並採取適當之安全維護措施。',
    '如本告知事項內容因活動內容、服務方式或法令要求而有所調整，將於活動頁面公告更新版本。'
  ]);

  var updated = createEl('p', 'notice-updated');
  updated.textContent = '最後更新：' + cfg.lastUpdated;
  body.appendChild(updated);

  sheet.appendChild(body);

  var footer = createEl('div', 'notice-footer');
  var done = createEl('button', 'btn-notice-done');
  done.type = 'button';
  done.textContent = '我已了解並返回';
  done.addEventListener('click', onClose);
  footer.appendChild(done);
  sheet.appendChild(footer);

  overlay.appendChild(sheet);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) onClose();
  });
  return { overlay: overlay, sheet: sheet, done: done };
}

export function renderRegister(root, state, handlers) {
  root.innerHTML = '';
  var screen = createEl('div', 'screen screen--profile');
  var form = createEl('div', 'profile-form');

  var eyebrow = createEl('p', 'profile-eyebrow');
  eyebrow.textContent = 'ENGINEER PROFILE';
  form.appendChild(eyebrow);

  var headRow = createEl('div', 'profile-head');
  var mascot = document.createElement('img');
  mascot.className = 'profile-mascot';
  mascot.src = mascotSrc('idea');
  mascot.alt = '多角龍研究員';
  headRow.appendChild(mascot);
  var headText = createEl('div', 'profile-head-text');
  var title = createEl('h2', 'profile-title');
  title.textContent = '建立你的生存檔案';
  var subtitle = createEl('p', 'profile-subtitle');
  subtitle.textContent = '留下你的實驗代號，完成 12 道關卡後，解鎖專屬工程師生存卡。';
  headText.appendChild(title);
  headText.appendChild(subtitle);
  headRow.appendChild(headText);
  form.appendChild(headRow);

  var error = createEl('p', 'profile-error');
  error.setAttribute('role', 'alert');
  error.hidden = true;
  form.appendChild(error);

  var nickname = buildFormField({
    id: 'profile-nickname',
    icon: UI_ICONS.fileText,
    label: '實驗代號',
    required: false,
    placeholder: '例如：每天都在 Debug',
    help: '會顯示在你的生存卡上，不用填真名。留空會自動產生一組代號。',
    maxLength: 20,
    autocomplete: 'nickname',
    value: state.nickname
  });
  form.appendChild(nickname.wrap);

  var email = buildFormField({
    id: 'profile-email',
    icon: UI_ICONS.mail,
    label: 'Email',
    required: true,
    type: 'email',
    placeholder: 'you@example.com',
    help: '用於本次活動聯繫；若你另外同意，也會寄送工程師課程、學習、活動與職涯相關資訊。',
    autocomplete: 'email',
    value: state.email
  });
  form.appendChild(email.wrap);

  var noticeHost = createEl('div', 'notice-host');
  var openNotice = function () {
    var notice = buildPersonalDataNotice(function () {
      noticeHost.innerHTML = '';
      document.body.classList.remove('notice-open');
      privacy.input.focus();
    });
    noticeHost.appendChild(notice.overlay);
    document.body.classList.add('notice-open');
    notice.done.focus();
  };

  var privacy = buildConsentCheckbox({
    parts: ['我已閱讀並了解', { label: '個人資料蒐集告知事項', onClick: openNotice }]
  });
  privacy.row.classList.add('consent-row--required');
  form.appendChild(privacy.row);

  var marketing = buildMarketingConsent();
  form.appendChild(marketing.row);

  function submit() {
    if (!privacy.input.checked) {
      error.hidden = false;
      error.textContent = '請先閱讀並確認個人資料蒐集告知事項';
      privacy.row.classList.add('consent-row--bad');
      privacy.input.focus();
      return;
    }
    var problem = handlers.onSubmit({
      nickname: nickname.input.value,
      email: email.input.value,
      privacyAccepted: true,
      marketingOptIn: marketing.input.checked
    });
    if (!problem) return;
    error.hidden = false;
    error.textContent = problem === 'email'
      ? (email.input.value.trim() ? 'Email 格式看起來不太對，再檢查一下。' : '請留下 Email，這是本次活動的必要資料。')
      : '還有欄位需要補一下。';
    email.input.classList.add('profile-input--bad');
    email.input.focus();
  }

  [nickname.input, email.input].forEach(function (input) {
    input.addEventListener('input', function () {
      input.classList.remove('profile-input--bad');
      error.hidden = true;
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); submit(); }
    });
  });
  privacy.input.addEventListener('change', function () {
    privacy.row.classList.remove('consent-row--bad');
    error.hidden = true;
  });

  form.appendChild(buildStartTestButton(submit));

  var micro = createEl('p', 'profile-micro');
  micro.appendChild(buildIconSpan(UI_ICONS.clock3, 'profile-micro-icon'));
  micro.appendChild(document.createTextNode('約 60–90 秒完成'));
  var divider = createEl('span', 'profile-micro-sep');
  divider.textContent = '｜';
  micro.appendChild(divider);
  micro.appendChild(buildIconSpan(UI_ICONS.lockKeyhole, 'profile-micro-icon'));
  micro.appendChild(document.createTextNode('你的 Email 不會顯示於生存卡'));
  form.appendChild(micro);

  form.appendChild(noticeHost);
  screen.appendChild(form);
  root.appendChild(screen);
}

export function renderLevel(root, question, state, handlers) {
  root.innerHTML = '';
  var screen = createEl('div', 'screen screen--level');
  screen.appendChild(buildLevelHeader(question));

  var character = document.createElement('img');
  character.className = 'character';
  character.src = mascotSrc(question.characterMood);
  character.alt = '多角龍研究員';
  screen.appendChild(character);

  var prompt = createEl('h2', 'level-prompt');
  prompt.textContent = question.prompt;
  screen.appendChild(prompt);

  if (question.subtitle) {
    var subtitle = createEl('p', 'level-subtitle');
    subtitle.textContent = question.subtitle;
    screen.appendChild(subtitle);
  }

  screen.appendChild(buildOptionsGrid(question, state, handlers));

  if (question.type === 'multi') {
    var selected = state.answers[question.id] || [];
    var nextBtn = createEl('button', 'btn-primary');
    nextBtn.type = 'button';
    nextBtn.textContent = selected.length > 0 ? '下一步 →' : '略過';
    nextBtn.addEventListener('click', handlers.onMultiNext);
    screen.appendChild(nextBtn);
  }

  if (state.levelIndex > 0) {
    var backBtn = createEl('button', 'btn-back');
    backBtn.type = 'button';
    backBtn.textContent = '← 上一題';
    backBtn.disabled = Boolean(state.isAdvancing);
    backBtn.addEventListener('click', handlers.onBack);
    screen.appendChild(backBtn);
  }

  root.appendChild(screen);
}

function buildLevelHeader(question) {
  var header = createEl('div', 'level-header');
  var badge = createEl('div', 'level-badge');
  badge.textContent = 'LEVEL ' + pad2(question.level) + ' / ' + TOTAL_LEVELS;
  var track = createEl('div', 'progress-track');
  var fill = createEl('div', 'progress-fill');
  fill.style.width = Math.round((question.level / TOTAL_LEVELS) * 100) + '%';
  track.appendChild(fill);
  header.appendChild(badge);
  header.appendChild(track);
  return header;
}

function buildOptionsGrid(question, state, handlers) {
  var isMulti = question.type === 'multi';
  var selectedValue = state.answers[question.id];
  var selectedValues = isMulti ? (state.answers[question.id] || []) : [];
  var grid = createEl('div', 'options-grid options-grid--' + question.visualStyle);

  question.options.forEach(function (option) {
    var isSelected = isMulti
      ? selectedValues.indexOf(option.value) !== -1
      : selectedValue === option.value;

    var classNames = ['option-card'];
    if (isSelected) classNames.push('option-card--selected');

    var btn = createEl('button', classNames.join(' '));
    btn.type = 'button';
    // Locked only while the answer animation plays, so a double tap cannot
    // skip a level. Keying this off the stored answer instead would leave the
    // options dead after stepping back to change one.
    btn.disabled = !isMulti && Boolean(state.isAdvancing);

    var isAiToolsBrand = question.id === 'aiTools';
    var iconMarkup = question.id === 'role'
      ? ROLE_ICONS[option.value]
      : isAiToolsBrand
        ? (BRAND_ICONS[AI_TOOL_BRAND_KEYS[option.value]] ||
           (option.value === 'other' ? UI_ICONS.settings : option.value === 'none' ? UI_ICONS.moreHorizontal : null))
        : OPTION_ICONS[question.id + ':' + option.value];
    if (option.image) {
      var optionImg = document.createElement('img');
      optionImg.className = 'option-image';
      optionImg.src = option.image;
      optionImg.alt = option.label;
      btn.appendChild(optionImg);
    } else if (iconMarkup) {
      var icon = createEl('span', isAiToolsBrand ? 'option-icon option-icon--brand' : 'option-icon');
      icon.innerHTML = iconMarkup;
      btn.appendChild(icon);
    } else {
      var emoji = createEl('span', 'option-emoji');
      emoji.textContent = option.emoji;
      btn.appendChild(emoji);
    }
    var label = createEl('span', 'option-label');
    label.textContent = option.label;
    btn.appendChild(label);

    btn.addEventListener('click', function () {
      if (isMulti) {
        handlers.onMultiToggle(option.value);
      } else {
        handlers.onSingleSelect(option.value);
      }
    });

    grid.appendChild(btn);
  });

  return grid;
}

function createEl(tag, className) {
  var el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

var CALCULATING_ITEMS = ['工作穩定度', 'AI Buff', '職涯卡點', '轉職雷達', '2027 任務'];
var CALCULATING_STAGGER_MS = 250;

export function renderCalculating(root) {
  root.innerHTML = '';
  var screen = createEl('div', 'screen screen--calculating');
  var text = createEl('p', 'calculating-text');
  text.textContent = '🔬 分析你的工程師生存數據中……';
  screen.appendChild(text);

  var checklist = createEl('div', 'calculating-checklist');
  CALCULATING_ITEMS.forEach(function (label, i) {
    var item = createEl('div', 'calculating-item');
    item.style.animationDelay = (i * CALCULATING_STAGGER_MS) + 'ms';
    var labelEl = createEl('span');
    labelEl.textContent = label;
    var check = createEl('span', 'calculating-check');
    check.textContent = '✓';
    check.style.animationDelay = (i * CALCULATING_STAGGER_MS + 150) + 'ms';
    item.appendChild(labelEl);
    item.appendChild(check);
    checklist.appendChild(item);
  });
  screen.appendChild(checklist);

  var track = createEl('div', 'progress-track');
  var fill = createEl('div', 'progress-fill progress-fill--animated');
  track.appendChild(fill);
  screen.appendChild(track);
  root.appendChild(screen);
}

export function renderResult(root, data, handlers) {
  root.innerHTML = '';
  var screen = createEl('div', 'screen screen--result');
  var card = createEl('div', 'result-card');
  card.style.setProperty('--persona-accent', data.persona.accent);
  card.style.setProperty('--persona-accent-strong', data.persona.accentStrong);
  card.style.setProperty('--persona-glow', data.persona.accentGlow);

  if (data.nickname) {
    var greeting = createEl('p', 'result-greeting');
    greeting.textContent = data.nickname + '，你的生存報告出爐了';
    card.appendChild(greeting);
  }

  var badge = createEl('div', 'result-badge');
  badge.textContent = 'SURVIVAL TYPE';

  var name = createEl('h2', 'result-name');
  name.textContent = data.persona.emoji + ' ' + data.persona.name;

  var englishName = createEl('p', 'result-english-name');
  englishName.textContent = data.persona.englishName;

  var scoreBlock = createEl('div', 'result-score');
  var scoreLabel = createEl('p', 'result-score-label');
  scoreLabel.textContent = 'SURVIVAL SCORE';
  var scoreNumberRow = createEl('div', 'result-score-number-row');
  var scoreNumber = createEl('span', 'result-score-number');
  scoreNumber.textContent = '0';
  var scoreMax = createEl('span', 'result-score-max');
  scoreMax.textContent = '/100';
  scoreNumberRow.appendChild(scoreNumber);
  scoreNumberRow.appendChild(scoreMax);
  var indexBar = createEl('div', 'progress-track progress-track--index');
  var indexFill = createEl('div', 'progress-fill');
  indexFill.style.width = '0%';
  indexBar.appendChild(indexFill);
  scoreBlock.appendChild(scoreLabel);
  scoreBlock.appendChild(scoreNumberRow);
  scoreBlock.appendChild(indexBar);

  setTimeout(function () {
    indexFill.style.width = data.survivalIndex + '%';
    animateCountUp(scoreNumber, data.survivalIndex, 900);
  }, 30);

  var stats = createEl('div', 'result-stats');
  stats.appendChild(buildStatRow('heart', '工作穩定度', data.dimensions.stability));
  stats.appendChild(buildStatRow('cpu', 'AI 適應度', data.dimensions.aiAdapt));
  stats.appendChild(buildStatRow('radar', '轉職雷達', data.dimensions.radar));
  stats.appendChild(buildStatRow('bug', '職涯卡點指數', data.dimensions.careerBugIndex));

  var insightHero = buildInsightHero(data.persona.highlight);

  var insightGrid = createEl('div', 'result-insight-grid');
  insightGrid.appendChild(buildInsightCard('crosshair', 'CORE DRIVE', data.persona.deepDive.motivationTitle, data.persona.deepDive.motivation));
  insightGrid.appendChild(buildInsightCard('triangleAlert', 'RISK', data.persona.deepDive.riskTitle, data.persona.deepDive.risk));
  insightGrid.appendChild(buildInsightCard('moveUpRight', 'NEXT MOVE', data.persona.deepDive.actionTitle, data.persona.deepDive.action));

  var statusGrid = createEl('div', 'result-status-grid');
  var bugCard = buildStatusCard('bug', 'bug', 'BUG DETECTED', data.careerBugLabel, data.careerBugImage);
  // Up to three bugs can be picked; two or more need the full row to fit.
  if ((data.careerBugLabel || '').indexOf('、') !== -1) {
    bugCard.classList.add('result-status-card--wide');
  }
  statusGrid.appendChild(bugCard);
  statusGrid.appendChild(buildStatusCard('cpu', 'ai', 'AI STATUS', data.aiBuffLabel));

  var mission = buildMissionCard(data.goalLabel, data.goalImage);
  var course = buildCourseCard(data.course);

  // Course sits right after the deep-dive analysis: the cards above end on
  // 建議行動, so the suggestion follows straight on from it instead of
  // trailing after the 2027 mission, which closes the card.
  [badge, name, englishName, scoreBlock, stats, insightHero, insightGrid, course, statusGrid, mission].forEach(function (el) { card.appendChild(el); });
  screen.appendChild(card);

  // The result card runs about two screens tall on a phone, so the main
  // action rides along at the bottom of the viewport instead of waiting at
  // the very end where it has to be scrolled for.
  var shareBtn = createEl('button', 'btn-primary');
  shareBtn.type = 'button';
  shareBtn.textContent = '產生我的生存卡';
  shareBtn.addEventListener('click', handlers.onShare);
  var actions = createEl('div', 'result-actions');
  actions.appendChild(shareBtn);
  screen.appendChild(actions);

  var restartBtn = createEl('button', 'btn-secondary');
  restartBtn.type = 'button';
  restartBtn.textContent = '再測一次';
  restartBtn.addEventListener('click', handlers.onRestart);
  screen.appendChild(restartBtn);

  root.appendChild(screen);
}

function buildStatRow(iconKey, label, value) {
  var percent = Math.round((value / 5) * 100);
  var row = createEl('div', 'stat-row');
  row.appendChild(buildIconSpan(STAT_ICONS[iconKey], 'stat-icon'));

  var info = createEl('div', 'stat-info');
  var labelRow = createEl('div', 'stat-label-row');
  var labelEl = createEl('span', 'stat-label');
  labelEl.textContent = label;
  var percentEl = createEl('span', 'stat-percent');
  percentEl.textContent = percent + '%';
  labelRow.appendChild(labelEl);
  labelRow.appendChild(percentEl);

  var bar = createEl('div', 'stat-bar');
  var fill = createEl('div', 'stat-bar-fill');
  fill.style.width = percent + '%';
  bar.appendChild(fill);

  info.appendChild(labelRow);
  info.appendChild(bar);
  row.appendChild(info);
  return row;
}

function buildInsightHero(headline) {
  var hero = createEl('div', 'result-insight-hero');
  var eyebrow = createEl('p', 'result-insight-hero-eyebrow');
  eyebrow.textContent = 'YOUR INSIGHT';
  var text = createEl('p', 'result-insight-hero-text');
  text.textContent = headline;
  hero.appendChild(eyebrow);
  hero.appendChild(text);
  return hero;
}

function buildInsightCard(iconKey, eyebrow, title, description) {
  var card = createEl('div', 'result-insight-card');
  var iconBox = createEl('div', 'result-insight-icon');
  iconBox.appendChild(buildIconSpan(STAT_ICONS[iconKey], 'result-insight-icon-svg'));
  var eyebrowEl = createEl('p', 'result-insight-eyebrow');
  eyebrowEl.textContent = eyebrow;
  var titleEl = createEl('p', 'result-insight-title');
  titleEl.textContent = title;
  var descEl = createEl('p', 'result-insight-desc');
  descEl.textContent = description;
  var body = createEl('div', 'result-insight-body');
  body.appendChild(eyebrowEl);
  body.appendChild(titleEl);
  body.appendChild(descEl);
  card.appendChild(iconBox);
  card.appendChild(body);
  return card;
}

function buildStatusCard(iconKey, variant, eyebrow, text, image) {
  var card = createEl('div', 'result-status-card result-status-card--' + variant);
  var iconBox = createEl('div', 'result-status-icon');
  if (image) {
    var img = document.createElement('img');
    img.className = 'result-status-icon-image';
    img.src = image;
    img.alt = '';
    iconBox.appendChild(img);
  } else {
    iconBox.appendChild(buildIconSpan(STAT_ICONS[iconKey], 'result-status-icon-svg'));
  }
  var body = createEl('div', 'result-status-body');
  var eyebrowEl = createEl('p', 'result-status-eyebrow');
  eyebrowEl.textContent = eyebrow;
  var textEl = createEl('p', 'result-status-text');
  textEl.textContent = text;
  body.appendChild(eyebrowEl);
  body.appendChild(textEl);
  card.appendChild(iconBox);
  card.appendChild(body);
  return card;
}

function buildIconSpan(svgMarkup, className) {
  var span = createEl('span', className);
  span.innerHTML = svgMarkup;
  return span;
}

function buildCourseCard(course) {
  var wrap = createEl('a', 'result-course');
  wrap.href = course.url;
  wrap.target = '_blank';
  wrap.rel = 'noopener noreferrer';

  // Leads with the recommendation, then explains why, so it reads as advice
  // following on from the analysis above rather than a footer ad.
  var label = createEl('p', 'result-course-label');
  label.textContent = '先推薦你這門課';

  var row = createEl('div', 'result-course-row');
  row.appendChild(buildIconSpan(UI_ICONS.layers, 'result-course-icon'));
  var nameEl = createEl('span', 'result-course-name');
  nameEl.textContent = course.name;
  row.appendChild(nameEl);
  row.appendChild(buildIconSpan(STAT_ICONS.moveUpRight, 'result-course-arrow'));

  var reason = createEl('p', 'result-course-reason');
  reason.textContent = course.reason;

  var source = createEl('p', 'result-course-source');
  source.textContent = '六角學院';

  [label, row, reason, source].forEach(function (el) { wrap.appendChild(el); });
  return wrap;
}

function buildMissionCard(goalLabel, goalImage) {
  var mission = createEl('div', 'result-mission');
  var label = createEl('p', 'result-mission-label');
  label.textContent = 'NEXT MISSION';

  var year = createEl('p', 'result-mission-year');
  year.textContent = '2027';

  var content = createEl('div', 'result-mission-content');
  var icon = buildIconSpan(STAT_ICONS.lock, 'result-mission-icon');
  var text = createEl('span', 'result-mission-text');
  text.textContent = '解鎖中……';
  content.appendChild(icon);
  content.appendChild(text);

  mission.appendChild(label);
  mission.appendChild(year);
  mission.appendChild(content);

  setTimeout(function () {
    icon.remove();
    if (goalImage) {
      var badgeImg = document.createElement('img');
      badgeImg.className = 'result-mission-badge';
      badgeImg.src = goalImage;
      badgeImg.alt = '';
      content.insertBefore(badgeImg, text);
      flashClass(badgeImg, 'result-mission-icon--pop', 400);
    } else {
      var unlockIcon = buildIconSpan(STAT_ICONS.unlock, 'result-mission-icon');
      content.insertBefore(unlockIcon, text);
      flashClass(unlockIcon, 'result-mission-icon--pop', 400);
    }
    text.textContent = goalLabel;
    text.classList.add('result-mission-text--revealed');
  }, 650);

  return mission;
}

function animateCountUp(el, target, duration) {
  var start = Date.now();
  var STEP_MS = 30;
  var timer = setInterval(function () {
    var progress = Math.min(1, (Date.now() - start) / duration);
    el.textContent = Math.round(progress * target);
    if (progress >= 1) clearInterval(timer);
  }, STEP_MS);
}

export function renderLead(root, handlers) {
  root.innerHTML = '';
  var screen = createEl('div', 'screen screen--lead');

  // Marketing consent is taken once, on the profile page. Asking again here
  // would leave two answers to the same question and no way to say which wins.
  var feedbackTitle = createEl('h2', 'lead-title');
  feedbackTitle.textContent = '還有什麼想說的嗎？';
  screen.appendChild(feedbackTitle);

  var feedbackHint = createEl('p', 'lead-feedback-hint');
  feedbackHint.textContent = '選填，前面選項沒問到、但你最在意的事都可以打在這裡';
  screen.appendChild(feedbackHint);

  var feedbackInput = document.createElement('textarea');
  feedbackInput.className = 'lead-feedback';
  feedbackInput.placeholder = '例如：希望公司多重視什麼、面試時最想被問到什麼⋯⋯';
  feedbackInput.rows = 4;
  screen.appendChild(feedbackInput);

  var submitBtn = createEl('button', 'btn-primary');
  submitBtn.type = 'button';
  submitBtn.textContent = '送出';
  submitBtn.addEventListener('click', function () {
    handlers.onSubmit({ openFeedback: feedbackInput.value.trim() });
  });
  screen.appendChild(submitBtn);

  var skipBtn = createEl('button', 'btn-secondary');
  skipBtn.type = 'button';
  skipBtn.textContent = '不用了，直接完成';
  skipBtn.addEventListener('click', function () {
    handlers.onSkip(feedbackInput.value.trim());
  });
  screen.appendChild(skipBtn);

  root.appendChild(screen);
}

export function renderDone(root, options) {
  var hasError = Boolean(options && options.hasError);
  root.innerHTML = '';
  var screen = createEl('div', 'screen screen--done');
  var character = document.createElement('img');
  character.className = 'character character--large';
  character.src = mascotSrc('celebrate');
  character.alt = '多角龍研究員';
  var text = createEl('p', 'done-text');
  text.textContent = hasError
    ? '網路好像不太順，資料可能沒送出成功，麻煩跟工作人員說一聲 🙏'
    : '感謝你來體驗工程師生存實驗室！';
  screen.appendChild(character);
  screen.appendChild(text);
  root.appendChild(screen);
}
