import { QUESTIONS } from './questions.js';
import { PERSONAS } from './results.js';
import { computeDimensions, computeSurvivalIndex, computePersona } from './scoring.js';
import { createInitialState, recordSingleAnswer, toggleMultiAnswer, isLastLevel, advanceLevel, goBackLevel, recordRegistration, validateRegistration } from './state.js';
import { renderIntro, renderRegister, renderLevel, renderCalculating, renderResult, renderLead, renderDone } from './render.js';
import { exportResultCardImage, shareOrDownloadImage } from './share.js';
import { submitResponse, submitLead } from './submit.js';
import { recommendCourse } from './courses.js';
import { flashClass } from './animations.js';

var SINGLE_SELECT_FIELDS = [
  'role', 'experience', 'satisfaction', 'salary', 'headhunterReaction',
  'jumpThreshold', 'careerBug', 'aiFrequency', 'aiImpact', 'aiFear', 'goal2027'
];

var root = document.getElementById('app');
var state = createInitialState();

function rerender() {
  if (state.screen === 'intro') {
    renderIntro(root, { onStart: handleStart });
  } else if (state.screen === 'register') {
    renderRegister(root, state, { onSubmit: handleRegister });
  } else if (state.screen === 'level') {
    renderLevel(root, QUESTIONS[state.levelIndex], state, {
      onSingleSelect: handleSingleSelect,
      onMultiToggle: handleMultiToggle,
      onMultiNext: handleMultiNext,
      onBack: handleBack
    });
  } else if (state.screen === 'calculating') {
    renderCalculating(root);
  } else if (state.screen === 'result') {
    renderResult(root, buildResultData(), { onShare: handleShare, onRestart: handleRestart });
  } else if (state.screen === 'lead') {
    renderLead(root, { onSubmit: handleLeadSubmit, onSkip: handleLeadSkip });
  } else if (state.screen === 'done') {
    renderDone(root, { hasError: state.hasSubmitError });
  }
}

function buildResultData() {
  if (!state.persona) {
    state.dimensions = computeDimensions(state.answers);
    state.survivalIndex = computeSurvivalIndex(state.answers);
    state.persona = computePersona(state.answers);
  }
  return {
    persona: PERSONAS[state.persona],
    dimensions: state.dimensions,
    survivalIndex: state.survivalIndex,
    careerBugLabel: findLabel('careerBug', state.answers.careerBug),
    careerBugImage: findImage('careerBug', state.answers.careerBug),
    aiBuffLabel: findBuffLabel('aiFrequency', state.answers.aiFrequency),
    goalLabel: findLabel('goal2027', state.answers.goal2027),
    goalImage: findImage('goal2027', state.answers.goal2027),
    course: recommendCourse(state.answers),
    nickname: state.nickname
  };
}

function findQuestion(questionId) {
  return QUESTIONS.filter(function (q) { return q.id === questionId; })[0] || null;
}

function findOption(questionId, value) {
  var question = findQuestion(questionId);
  if (!question) return null;
  return question.options.filter(function (o) { return o.value === value; })[0] || null;
}

function findLabel(questionId, value) {
  var option = findOption(questionId, value);
  return option ? option.label : '';
}

function findImage(questionId, value) {
  var option = findOption(questionId, value);
  return option && option.image ? option.image : '';
}

function findBuffLabel(questionId, value) {
  var option = findOption(questionId, value);
  return option && option.buffLabel ? option.buffLabel : '';
}

function buildLabeledAnswers() {
  var labeled = {};
  SINGLE_SELECT_FIELDS.forEach(function (fieldId) {
    labeled[fieldId] = findLabel(fieldId, state.answers[fieldId]);
  });
  labeled.aiTools = (state.answers.aiTools || []).map(function (value) {
    return findLabel('aiTools', value);
  });
  return labeled;
}

function handleStart() {
  state.screen = 'register';
  rerender();
}

// Returns the offending field name so the form can mark it, or nothing on success.
function handleRegister(nickname, email) {
  var problem = validateRegistration(nickname, email);
  if (problem) return problem;
  recordRegistration(state, nickname, email);
  state.screen = 'level';
  state.levelIndex = 0;
  rerender();
}

function handleSingleSelect(value) {
  if (state.isAdvancing) return;
  var question = QUESTIONS[state.levelIndex];
  recordSingleAnswer(state, question.id, value);
  state.isAdvancing = true;
  rerender();
  var characterEl = root.querySelector('.character');
  if (characterEl) flashClass(characterEl, 'character--pop', 400);
  setTimeout(goToNextLevelOrCalculate, 450);
}

function handleMultiToggle(value) {
  var question = QUESTIONS[state.levelIndex];
  toggleMultiAnswer(state, question, value);
  rerender();
}

function handleMultiNext() {
  goToNextLevelOrCalculate();
}

function handleBack() {
  if (state.isAdvancing) return;
  goBackLevel(state);
  rerender();
}

function goToNextLevelOrCalculate() {
  state.isAdvancing = false;
  if (isLastLevel(state, QUESTIONS)) {
    state.screen = 'calculating';
    setTimeout(handleCalculatingDone, 1700);
  } else {
    advanceLevel(state);
  }
  rerender();
}

function handleCalculatingDone() {
  state.screen = 'result';
  rerender();
}

function handleShare() {
  exportResultCardImage(buildResultData()).then(function (canvas) {
    shareOrDownloadImage(canvas);
    handleGoToLead();
  });
}

function handleRestart() {
  Object.assign(state, createInitialState());
  rerender();
}

function handleGoToLead() {
  state.screen = 'lead';
  rerender();
}

async function handleLeadSubmit(leadData) {
  if (state.isSubmitting) return;
  state.isSubmitting = true;
  setLeadButtonsSubmitting(true, 'submit');
  var personaName = PERSONAS[state.persona].name;
  var labeledAnswers = buildLabeledAnswers();
  var promises = [submitResponse(labeledAnswers, personaName, state.survivalIndex, leadData.openFeedback)];
  var hasLeadInfo = Boolean(state.email) || leadData.interests.length > 0;
  if (hasLeadInfo) {
    promises.push(submitLead({
      nickname: state.nickname,
      email: state.email,
      interests: leadData.interests
    }, personaName, state.survivalIndex));
  }
  var results = await Promise.all(promises);
  state.hasSubmitError = results.some(function (r) { return r.status === 'error'; });
  state.isSubmitting = false;
  state.screen = 'done';
  rerender();
}

async function handleLeadSkip(openFeedback) {
  if (state.isSubmitting) return;
  state.isSubmitting = true;
  setLeadButtonsSubmitting(true, 'skip');
  var labeledAnswers = buildLabeledAnswers();
  var result = await submitResponse(labeledAnswers, PERSONAS[state.persona].name, state.survivalIndex, openFeedback);
  state.hasSubmitError = result.status === 'error';
  state.isSubmitting = false;
  state.screen = 'done';
  rerender();
}

// Only the button the player actually pressed shows a busy label. The other
// is disabled so it cannot be pressed too, but keeps its own wording -- having
// 送出 flip to 送出中… after tapping 我只是來玩玩 read as if it had submitted.
function setLeadButtonsSubmitting(isSubmitting, pressed) {
  var buttons = [
    { el: document.querySelector('.screen--lead .btn-primary'), key: 'submit', busy: '送出中…' },
    { el: document.querySelector('.screen--lead .btn-secondary'), key: 'skip', busy: '完成中…' }
  ];
  buttons.forEach(function (btn) {
    if (!btn.el) return;
    btn.el.disabled = isSubmitting;
    if (isSubmitting && btn.key === pressed) {
      btn.el.textContent = btn.busy;
    }
  });
}

rerender();
