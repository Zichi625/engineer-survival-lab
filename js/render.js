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
