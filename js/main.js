import { QUESTIONS } from './questions.js';
import { PERSONAS } from './results.js';
import { computeDimensions, computeSurvivalIndex, computePersona } from './scoring.js';
import { createInitialState, recordSingleAnswer, toggleMultiAnswer, isLastLevel, advanceLevel } from './state.js';
import { renderIntro, renderLevel, renderCalculating, renderResult, renderLead, renderDone } from './render.js';
import { exportResultCardImage, shareOrDownloadImage } from './share.js';
import { submitResponse, submitLead } from './submit.js';
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
  } else if (state.screen === 'level') {
    renderLevel(root, QUESTIONS[state.levelIndex], state, {
      onSingleSelect: handleSingleSelect,
      onMultiToggle: handleMultiToggle,
      onMultiNext: handleMultiNext
    });
  } else if (state.screen === 'calculating') {
    renderCalculating(root);
  } else if (state.screen === 'result') {
    renderResult(root, buildResultData(), { onShare: handleShare, onContinue: handleGoToLead });
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
    aiBuffLabel: findBuffLabel('aiFrequency', state.answers.aiFrequency),
    goalLabel: findLabel('goal2027', state.answers.goal2027)
  };
}

function findQuestion(questionId) {
  return QUESTIONS.filter(function (q) { return q.id === questionId; })[0] || null;
}

function findLabel(questionId, value) {
  var question = findQuestion(questionId);
  if (!question) return '';
  var option = question.options.filter(function (o) { return o.value === value; })[0];
  return option ? option.label : '';
}

function findBuffLabel(questionId, value) {
  var question = findQuestion(questionId);
  if (!question) return '';
  var option = question.options.filter(function (o) { return o.value === value; })[0];
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
  state.screen = 'level';
  state.levelIndex = 0;
  rerender();
}

function handleSingleSelect(value) {
  var question = QUESTIONS[state.levelIndex];
  recordSingleAnswer(state, question.id, value);
  rerender();
  var characterEl = root.querySelector('.character');
  if (characterEl) flashClass(characterEl, 'character--pop', 400);
  setTimeout(goToNextLevelOrCalculate, 450);
}

function handleMultiToggle(value) {
  var question = QUESTIONS[state.levelIndex];
  toggleMultiAnswer(state, question.id, value);
  rerender();
}

function handleMultiNext() {
  goToNextLevelOrCalculate();
}

function goToNextLevelOrCalculate() {
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
  });
}

function handleGoToLead() {
  state.screen = 'lead';
  rerender();
}

async function handleLeadSubmit(leadData) {
  var personaName = PERSONAS[state.persona].name;
  var labeledAnswers = buildLabeledAnswers();
  var promises = [submitResponse(labeledAnswers, personaName, state.survivalIndex)];
  var hasLeadInfo = Boolean(leadData.email) || leadData.interests.length > 0;
  if (hasLeadInfo) {
    promises.push(submitLead(leadData, personaName, state.survivalIndex));
  }
  var results = await Promise.all(promises);
  state.hasSubmitError = results.some(function (r) { return r.status === 'error'; });
  state.screen = 'done';
  rerender();
}

async function handleLeadSkip() {
  var labeledAnswers = buildLabeledAnswers();
  var result = await submitResponse(labeledAnswers, PERSONAS[state.persona].name, state.survivalIndex);
  state.hasSubmitError = result.status === 'error';
  state.screen = 'done';
  rerender();
}

rerender();
