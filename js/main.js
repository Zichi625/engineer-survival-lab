import { QUESTIONS } from './questions.js';
import { PERSONAS } from './results.js';
import { computeDimensions, computeSurvivalIndex, computePersona } from './scoring.js';
import { createInitialState, recordSingleAnswer, toggleMultiAnswer, isLastLevel, advanceLevel } from './state.js';
import { renderIntro, renderLevel, renderCalculating, renderResult, renderLead, renderDone } from './render.js';
import { exportResultCardImage, shareOrDownloadImage } from './share.js';
import { submitResponse, submitLead } from './submit.js';

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
    setTimeout(handleCalculatingDone, 1700);
  } else if (state.screen === 'result') {
    renderResult(root, buildResultData(), { onShare: handleShare, onContinue: handleGoToLead });
  } else if (state.screen === 'lead') {
    renderLead(root, { onSubmit: handleLeadSubmit, onSkip: handleLeadSkip });
  } else if (state.screen === 'done') {
    renderDone(root);
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

function handleStart() {
  state.screen = 'level';
  state.levelIndex = 0;
  rerender();
}

function handleSingleSelect(value) {
  var question = QUESTIONS[state.levelIndex];
  recordSingleAnswer(state, question.id, value);
  rerender();
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

function handleLeadSubmit(leadData) {
  var personaName = PERSONAS[state.persona].name;
  submitResponse(state.answers, personaName, state.survivalIndex);
  submitLead(leadData, personaName, state.survivalIndex);
  state.screen = 'done';
  rerender();
}

function handleLeadSkip() {
  submitResponse(state.answers, PERSONAS[state.persona].name, state.survivalIndex);
  state.screen = 'done';
  rerender();
}

rerender();
