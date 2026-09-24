import { QUESTIONS } from './questions.js';

var TOTAL_LEVELS = QUESTIONS.length;

var CHARACTER_EMOJI = {
  default: '🧑🏻‍💻',
  sweat: '🧑🏻‍💻💦',
  robot: '🤖',
  happy: '🧑🏻‍💻🎉'
};

export function renderIntro(root, handlers) {
  root.innerHTML = '';
  var screen = createEl('div', 'screen screen--intro');
  var character = createEl('div', 'character character--large');
  character.textContent = CHARACTER_EMOJI.default;
  var title = createEl('h1', 'intro-title');
  title.textContent = '歡迎進入工程師生存實驗室';
  var body = createEl('p', 'intro-body');
  body.textContent = '聽說工程師每天都在 Debug，但最大的 Bug 好像是自己的職涯？回答 12 個問題，看看你在 AI 時代的工程師生存狀態。';
  var timeHint = createEl('p', 'intro-time');
  timeHint.textContent = '⏱ 約 60–90 秒';
  var startBtn = createEl('button', 'btn-primary');
  startBtn.type = 'button';
  startBtn.textContent = '開始生存測驗 🚀';
  startBtn.addEventListener('click', handlers.onStart);

  [character, title, body, timeHint, startBtn].forEach(function (el) { screen.appendChild(el); });
  root.appendChild(screen);
}

export function renderLevel(root, question, state, handlers) {
  root.innerHTML = '';
  var screen = createEl('div', 'screen screen--level');
  screen.appendChild(buildLevelHeader(question));

  var character = createEl('div', 'character');
  character.textContent = CHARACTER_EMOJI[question.characterMood] || CHARACTER_EMOJI.default;
  screen.appendChild(character);

  var prompt = createEl('h2', 'level-prompt');
  prompt.textContent = question.prompt;
  screen.appendChild(prompt);

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

    var emoji = createEl('span', 'option-emoji');
    emoji.textContent = option.emoji;
    var label = createEl('span', 'option-label');
    label.textContent = option.label;
    btn.appendChild(emoji);
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

export function renderCalculating(root) {
  root.innerHTML = '';
  var screen = createEl('div', 'screen screen--calculating');
  var text = createEl('p', 'calculating-text');
  text.textContent = '🔬 分析你的工程師生存數據中……';
  var track = createEl('div', 'progress-track');
  var fill = createEl('div', 'progress-fill progress-fill--animated');
  track.appendChild(fill);
  screen.appendChild(text);
  screen.appendChild(track);
  root.appendChild(screen);
}

export function renderResult(root, data, handlers) {
  root.innerHTML = '';
  var screen = createEl('div', 'screen screen--result');
  var card = createEl('div', 'result-card');

  var heading = createEl('p', 'result-heading');
  heading.textContent = '👀 你的工程師生存類型';

  var name = createEl('h2', 'result-name');
  name.textContent = data.persona.emoji + ' ' + data.persona.name;

  var index = createEl('p', 'result-index');
  index.textContent = '生存指數 ' + data.survivalIndex + '%';

  var stats = createEl('div', 'result-stats');
  stats.appendChild(buildStatRow('💰 薪資滿意度', data.dimensions.salary));
  stats.appendChild(buildStatRow('❤️ 工作穩定度', data.dimensions.stability));
  stats.appendChild(buildStatRow('🤖 AI 適應度', data.dimensions.aiAdapt));
  stats.appendChild(buildStatRow('🚀 轉職雷達', data.dimensions.radar));

  var status = createEl('p', 'result-status');
  status.textContent = data.persona.statusText;

  var bug = createEl('p', 'result-line');
  bug.textContent = '你的 Career Bug：' + data.careerBugLabel;
  var buff = createEl('p', 'result-line');
  buff.textContent = 'AI Buff：' + data.aiBuffLabel;
  var goal = createEl('p', 'result-line');
  goal.textContent = '🏆 2027 想解鎖：' + data.goalLabel;

  [heading, name, index, stats, status, bug, buff, goal].forEach(function (el) { card.appendChild(el); });
  screen.appendChild(card);

  var shareBtn = createEl('button', 'btn-primary');
  shareBtn.type = 'button';
  shareBtn.textContent = '產生我的生存卡';
  shareBtn.addEventListener('click', handlers.onShare);
  screen.appendChild(shareBtn);

  var continueBtn = createEl('button', 'btn-secondary');
  continueBtn.type = 'button';
  continueBtn.textContent = '繼續 →';
  continueBtn.addEventListener('click', handlers.onContinue);
  screen.appendChild(continueBtn);

  root.appendChild(screen);
}

function buildStatRow(label, value) {
  var row = createEl('div', 'stat-row');
  var labelEl = createEl('span', 'stat-label');
  labelEl.textContent = label;
  var starsEl = createEl('span', 'stat-stars');
  starsEl.textContent = '★'.repeat(value) + '☆'.repeat(5 - value);
  row.appendChild(labelEl);
  row.appendChild(starsEl);
  return row;
}
