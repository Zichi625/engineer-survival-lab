import { QUESTIONS } from './questions.js';
import { ROLE_ICONS, STAT_ICONS } from './icons.js';
import { flashClass } from './animations.js';

var TOTAL_LEVELS = QUESTIONS.length;

function mascotSrc(mood) {
  return 'assets/mascot/mascot-' + (mood || 'coding') + '.png';
}

export function renderIntro(root, handlers) {
  root.innerHTML = '';
  var screen = createEl('div', 'screen screen--intro');
  var hero = createEl('div', 'hero-illustration');
  var heroImg = document.createElement('img');
  heroImg.src = mascotSrc('cheering');
  heroImg.alt = '多角龍研究員';
  hero.appendChild(heroImg);
  screen.appendChild(hero);
  var title = createEl('h1', 'intro-title');
  title.textContent = '歡迎進入工程師生存實驗室';
  var body = createEl('p', 'intro-body');
  body.textContent = '聽說工程師每天都在 Debug，但最大的 Bug 好像是自己的職涯？回答 12 個問題，看看你在 AI 時代的工程師生存狀態。';
  var timeHint = createEl('p', 'intro-time');
  timeHint.textContent = '⏱ 約 60–90 秒';
  var privacyHint = createEl('p', 'intro-time');
  privacyHint.textContent = '🔒 前 12 題完全匿名';
  var startBtn = createEl('button', 'btn-primary');
  startBtn.type = 'button';
  startBtn.textContent = '開始生存測驗 🚀';
  startBtn.addEventListener('click', handlers.onStart);

  [title, body, timeHint, privacyHint, startBtn].forEach(function (el) { screen.appendChild(el); });
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

  question.options.forEach(function (option, index) {
    var isSelected = isMulti
      ? selectedValues.indexOf(option.value) !== -1
      : selectedValue === option.value;
    var isFilled = Boolean(
      question.fillProgressive &&
      !isMulti &&
      selectedValue &&
      indexOfValue(question.options, selectedValue) >= index
    );

    var classNames = ['option-card'];
    if (isSelected) classNames.push('option-card--selected');
    if (isFilled) classNames.push('option-card--filled');

    var btn = createEl('button', classNames.join(' '));
    btn.type = 'button';
    btn.disabled = !isMulti && Boolean(selectedValue);

    var iconMarkup = question.id === 'role' ? ROLE_ICONS[option.value] : null;
    if (option.image) {
      var optionImg = document.createElement('img');
      optionImg.className = 'option-image';
      optionImg.src = option.image;
      optionImg.alt = option.label;
      btn.appendChild(optionImg);
    } else if (iconMarkup) {
      var icon = createEl('span', 'option-icon');
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

function indexOfValue(options, value) {
  for (var i = 0; i < options.length; i++) {
    if (options[i].value === value) return i;
  }
  return -1;
}

function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

var CALCULATING_ITEMS = ['工作穩定度', 'AI Buff', 'Career Bug', '轉職雷達', '2027 任務'];
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
  stats.appendChild(buildStatRow('bug', 'Career Bug 指數', data.dimensions.careerBugIndex));

  var highlight = createEl('div', 'result-highlight');
  var highlightText = createEl('p', 'result-highlight-text');
  highlightText.textContent = data.persona.highlight;
  highlight.appendChild(highlightText);

  var detailSections = createEl('div', 'result-detail-sections');
  detailSections.appendChild(buildDetailSection('核心動機', data.persona.deepDive.motivation));
  detailSections.appendChild(buildDetailSection('潛在風險', data.persona.deepDive.risk));
  detailSections.appendChild(buildDetailSection('建議行動', data.persona.deepDive.action));
  detailSections.hidden = true;

  var detailToggle = createEl('button', 'result-detail-toggle');
  detailToggle.type = 'button';
  detailToggle.textContent = '深入解讀 ▾';
  detailToggle.addEventListener('click', function () {
    detailSections.hidden = !detailSections.hidden;
    detailToggle.textContent = detailSections.hidden ? '深入解讀 ▾' : '收合 ▴';
  });

  var tags = createEl('div', 'result-tags');
  tags.appendChild(buildTag('bug', 'result-tag--bug', 'Career Bug：' + data.careerBugLabel, data.careerBugImage));
  tags.appendChild(buildTag('zap', 'result-tag--buff', 'AI Buff：' + data.aiBuffLabel));

  var mission = buildMissionCard(data.goalLabel, data.goalImage);

  [badge, name, englishName, scoreBlock, stats, highlight, detailToggle, detailSections, tags, mission].forEach(function (el) { card.appendChild(el); });
  screen.appendChild(card);

  var shareBtn = createEl('button', 'btn-primary');
  shareBtn.type = 'button';
  shareBtn.textContent = '產生我的生存卡';
  shareBtn.addEventListener('click', handlers.onShare);
  screen.appendChild(shareBtn);

  var continueBtn = createEl('button', 'btn-secondary');
  continueBtn.type = 'button';
  continueBtn.textContent = '看看 2026 工程師生存調查 →';
  continueBtn.addEventListener('click', handlers.onContinue);
  screen.appendChild(continueBtn);

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

function buildDetailSection(label, text) {
  var section = createEl('div', 'result-detail-section');
  var labelEl = createEl('p', 'result-detail-label');
  labelEl.textContent = label;
  var textEl = createEl('p', 'result-detail-text');
  textEl.textContent = text;
  section.appendChild(labelEl);
  section.appendChild(textEl);
  return section;
}

function buildTag(iconKey, className, text, image) {
  var tag = createEl('div', 'result-tag ' + className);
  if (image) {
    var img = document.createElement('img');
    img.className = 'result-tag-image';
    img.src = image;
    img.alt = '';
    tag.appendChild(img);
  } else {
    tag.appendChild(buildIconSpan(STAT_ICONS[iconKey], 'result-tag-icon'));
  }
  var label = createEl('span', 'result-tag-label');
  label.textContent = text;
  tag.appendChild(label);
  return tag;
}

function buildIconSpan(svgMarkup, className) {
  var span = createEl('span', className);
  span.innerHTML = svgMarkup;
  return span;
}

function buildMissionCard(goalLabel, goalImage) {
  var mission = createEl('div', 'result-mission');
  var label = createEl('p', 'result-mission-label');
  label.textContent = 'NEXT MISSION · 2027';

  var content = createEl('div', 'result-mission-content');
  var icon = buildIconSpan(STAT_ICONS.lock, 'result-mission-icon');
  var text = createEl('span', 'result-mission-text');
  text.textContent = '解鎖中……';
  content.appendChild(icon);
  content.appendChild(text);

  mission.appendChild(label);
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

  var title = createEl('h2', 'lead-title');
  title.textContent = '🎁 要不要把這次的研究結果寄給你？';
  screen.appendChild(title);

  var options = [
    { id: 'report', label: '想收到《2026 工程師生存調查》' },
    { id: 'jobs', label: '有適合我的職缺也可以找我' },
    { id: 'jobSeeking', label: '我最近正在找工作' },
    { id: 'justFun', label: '我只是來玩玩 😂' }
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
      interests: options.filter(function (opt) { return checkedState[opt.id]; }).map(function (opt) { return opt.label; })
    });
  });
  screen.appendChild(submitBtn);

  var skipBtn = createEl('button', 'btn-secondary');
  skipBtn.type = 'button';
  skipBtn.textContent = '不用了，直接完成';
  skipBtn.addEventListener('click', handlers.onSkip);
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
