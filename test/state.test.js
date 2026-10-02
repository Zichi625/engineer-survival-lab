import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, recordSingleAnswer, toggleMultiAnswer, isLastLevel, advanceLevel, goBackLevel } from '../js/state.js';

test('createInitialState starts on the intro screen with no answers', function () {
  var state = createInitialState();
  assert.equal(state.screen, 'intro');
  assert.equal(state.levelIndex, 0);
  assert.deepEqual(state.answers, {});
});

test('recordSingleAnswer stores the value under the question id', function () {
  var state = createInitialState();
  recordSingleAnswer(state, 'role', 'frontend');
  assert.equal(state.answers.role, 'frontend');
});

test('toggleMultiAnswer adds a value the first time it is toggled', function () {
  var state = createInitialState();
  toggleMultiAnswer(state, { id: 'aiTools' }, 'chatgpt');
  assert.deepEqual(state.answers.aiTools, ['chatgpt']);
});

test('toggleMultiAnswer removes a value the second time it is toggled', function () {
  var state = createInitialState();
  toggleMultiAnswer(state, { id: 'aiTools' }, 'chatgpt');
  toggleMultiAnswer(state, { id: 'aiTools' }, 'chatgpt');
  assert.deepEqual(state.answers.aiTools, []);
});

test('toggleMultiAnswer selecting the exclusive option clears other selections', function () {
  var state = createInitialState();
  var question = { id: 'aiTools', exclusiveOption: 'none' };
  toggleMultiAnswer(state, question, 'chatgpt');
  toggleMultiAnswer(state, question, 'none');
  assert.deepEqual(state.answers.aiTools, ['none']);
});

test('toggleMultiAnswer selecting a normal option clears a prior exclusive selection', function () {
  var state = createInitialState();
  var question = { id: 'aiTools', exclusiveOption: 'none' };
  toggleMultiAnswer(state, question, 'none');
  toggleMultiAnswer(state, question, 'chatgpt');
  assert.deepEqual(state.answers.aiTools, ['chatgpt']);
});

test('toggleMultiAnswer ignores a new selection once maxSelections is reached', function () {
  var state = createInitialState();
  var question = { id: 'aiTools', maxSelections: 3 };
  toggleMultiAnswer(state, question, 'a');
  toggleMultiAnswer(state, question, 'b');
  toggleMultiAnswer(state, question, 'c');
  toggleMultiAnswer(state, question, 'd');
  assert.deepEqual(state.answers.aiTools, ['a', 'b', 'c']);
});

test('toggleMultiAnswer still allows deselecting when at maxSelections', function () {
  var state = createInitialState();
  var question = { id: 'aiTools', maxSelections: 3 };
  toggleMultiAnswer(state, question, 'a');
  toggleMultiAnswer(state, question, 'b');
  toggleMultiAnswer(state, question, 'c');
  toggleMultiAnswer(state, question, 'b');
  assert.deepEqual(state.answers.aiTools, ['a', 'c']);
});

test('isLastLevel is false before the final question', function () {
  var state = createInitialState();
  assert.equal(isLastLevel(state, [1, 2, 3]), false);
});

test('isLastLevel is true on the final question index', function () {
  var state = createInitialState();
  state.levelIndex = 2;
  assert.equal(isLastLevel(state, [1, 2, 3]), true);
});

test('advanceLevel increments levelIndex by one', function () {
  var state = createInitialState();
  advanceLevel(state);
  assert.equal(state.levelIndex, 1);
});

test('goBackLevel decrements levelIndex by one', function () {
  var state = createInitialState();
  advanceLevel(state);
  advanceLevel(state);
  goBackLevel(state);
  assert.equal(state.levelIndex, 1);
});

test('goBackLevel stops at the first level', function () {
  var state = createInitialState();
  goBackLevel(state);
  assert.equal(state.levelIndex, 0);
});

test('goBackLevel keeps the answer so it can be changed', function () {
  var state = createInitialState();
  recordSingleAnswer(state, 'role', 'frontend');
  advanceLevel(state);
  goBackLevel(state);
  assert.equal(state.answers.role, 'frontend');
});
