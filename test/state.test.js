import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, recordSingleAnswer, toggleMultiAnswer, isLastLevel, advanceLevel } from '../js/state.js';

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
  toggleMultiAnswer(state, 'aiTools', 'chatgpt');
  assert.deepEqual(state.answers.aiTools, ['chatgpt']);
});

test('toggleMultiAnswer removes a value the second time it is toggled', function () {
  var state = createInitialState();
  toggleMultiAnswer(state, 'aiTools', 'chatgpt');
  toggleMultiAnswer(state, 'aiTools', 'chatgpt');
  assert.deepEqual(state.answers.aiTools, []);
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
