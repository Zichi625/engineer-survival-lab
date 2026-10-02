import { QUESTIONS } from './questions.js';
import { ROLE_ICONS, STAT_ICONS, OPTION_ICONS, UI_ICONS, BRAND_ICONS } from './icons.js';
import { flashClass } from './animations.js';

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

function buildBarChartPanel() {
  var chart = createEl('div', 'hud-panel-bars');
  [40, 65, 50, 85].forEach(function (h) {
    var bar = createEl('span', 'hud-bar');
    bar.style.height = h + '%';
    chart.appendChild(bar);
  });
  return chart;
}

function buildDonutPanel() {
  var wrap = createEl('div', 'hud-panel-donut');
  var donut = createEl('div', 'hud-donut');
  var label = createEl('span', 'hud-donut-label');
  label.textContent = '72%';
  wrap.appendChild(donut);
  wrap.appendChild(label);
  return wrap;
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
  heroStage.appendChild(buildHudPanel('chart-left', buildBarChartPanel()));
  heroStage.appendChild(buildMascotScanner());
  heroStage.appendChild(buildHudPanel('checklist', buildChecklistPanel()));
  heroStage.appendChild(buildHudPanel('chart-right', buildDonutPanel()));
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

  var subtitle = createEl('p', 'intro-subtitle');
  subtitle.textContent = 'AI 時代，你是哪一種工程師生存者？';
  screen.appendChild(fadeUp(subtitle));

  var brand = createEl('p', 'intro-brand');
  brand.textContent = '六角學院 X 多角人才共同開發';
  screen.appendChild(fadeUp(brand));

  var body = createEl('p', 'intro-body');
  body.innerHTML = '工程師每天都在 Debug，<br>這次換你的職涯上機測試。';
  screen.appendChild(fadeUp(body));

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
    { icon: STAT_ICONS.lock, value: 'ANONYMOUS MODE', label: 'NO LOGIN REQUIRED', sub: '前 12 題完全匿名' }
  ];
  infoDefs.forEach(function (def) { infoGrid.appendChild(buildGameInfoCard(def)); });
  screen.appendChild(fadeUp(infoGrid));

  screen.appendChild(fadeUp(buildInitializeButton(handlers)));

  var footer = createEl('p', 'intro-footer');
  footer.textContent = 'ENGINEER SURVIVAL LAB // EXPERIMENT 2026';
  screen.appendChild(fadeUp(footer));

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
  statusGrid.appendChild(buildStatusCard('bug', 'bug', 'BUG DETECTED', data.careerBugLabel, data.careerBugImage));
  statusGrid.appendChild(buildStatusCard('cpu', 'ai', 'AI STATUS', data.aiBuffLabel));

  var mission = buildMissionCard(data.goalLabel, data.goalImage);
  var course = buildCourseCard(data.course);

  [badge, name, englishName, scoreBlock, stats, insightHero, insightGrid, statusGrid, mission, course].forEach(function (el) { card.appendChild(el); });
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

  var label = createEl('p', 'result-course-label');
  label.textContent = 'RECOMMENDED FOR YOU';

  var reason = createEl('p', 'result-course-reason');
  reason.textContent = course.reason;

  var row = createEl('div', 'result-course-row');
  row.appendChild(buildIconSpan(UI_ICONS.layers, 'result-course-icon'));
  var nameEl = createEl('span', 'result-course-name');
  nameEl.textContent = course.name;
  row.appendChild(nameEl);
  row.appendChild(buildIconSpan(STAT_ICONS.moveUpRight, 'result-course-arrow'));

  var source = createEl('p', 'result-course-source');
  source.textContent = '六角學院';

  [label, reason, row, source].forEach(function (el) { wrap.appendChild(el); });
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

  var feedbackTitle = createEl('h2', 'lead-title');
  feedbackTitle.textContent = '💬 還有什麼想說的嗎？';
  screen.appendChild(feedbackTitle);

  var feedbackHint = createEl('p', 'lead-feedback-hint');
  feedbackHint.textContent = '選填，前面選項沒問到、但你最在意的事都可以打在這裡';
  screen.appendChild(feedbackHint);

  var feedbackInput = document.createElement('textarea');
  feedbackInput.className = 'lead-feedback';
  feedbackInput.placeholder = '例如：希望公司多重視什麼、面試時最想被問到什麼⋯⋯';
  feedbackInput.rows = 3;
  screen.appendChild(feedbackInput);

  var title = createEl('h2', 'lead-title');
  title.textContent = '📮 想收到後續消息嗎？';
  screen.appendChild(title);

  var options = [
    { id: 'hexschoolInfo', label: '想收到六角學院的課程/活動資訊' },
    { id: 'jobs', label: '有適合我的職缺也可以找我' },
    { id: 'jobSeeking', label: '我最近正在找工作' }
  ];
  var checkedState = {};
  var checkboxList = createEl('div', 'lead-checkboxes');
  options.forEach(function (opt) {
    var label = createEl('label', 'lead-checkbox');
    var input = document.createElement('input');
    input.type = 'checkbox';
    input.addEventListener('change', function () {
      checkedState[opt.id] = input.checked;
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(opt.label));
    checkboxList.appendChild(label);
  });
  screen.appendChild(checkboxList);

  var emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.placeholder = 'Email（選填）';
  emailInput.className = 'lead-email';
  screen.appendChild(emailInput);

  var submitBtn = createEl('button', 'btn-primary');
  submitBtn.type = 'button';
  submitBtn.textContent = '送出';
  submitBtn.addEventListener('click', function () {
    handlers.onSubmit({
      email: emailInput.value.trim(),
      interests: options.filter(function (opt) { return checkedState[opt.id]; }).map(function (opt) { return opt.label; }),
      openFeedback: feedbackInput.value.trim()
    });
  });
  screen.appendChild(submitBtn);

  var skipBtn = createEl('button', 'btn-secondary');
  skipBtn.type = 'button';
  skipBtn.textContent = '不用了，我只是來玩玩 😂';
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
