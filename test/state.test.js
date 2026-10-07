import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, recordSingleAnswer, toggleMultiAnswer, isLastLevel, advanceLevel, goBackLevel, recordRegistration, validateRegistration } from '../js/state.js';
import { PRIVACY_CONFIG } from '../privacy-config.js';

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

test('沒勾個資告知就不能開始', function () {
  assert.equal(validateRegistration({ email: 'a@b.co', privacyAccepted: false }), 'privacy');
});

test('Email 現在是必填', function () {
  assert.equal(validateRegistration({ email: '', privacyAccepted: true }), 'email');
  assert.equal(validateRegistration({ email: '   ', privacyAccepted: true }), 'email');
});

test('Email 要是合理格式', function () {
  assert.equal(validateRegistration({ email: 'not-an-email', privacyAccepted: true }), 'email');
  assert.equal(validateRegistration({ email: 'a@b.co', privacyAccepted: true }), null);
});

test('暱稱留空會自動產生實驗代號', function () {
  var state = createInitialState();
  recordRegistration(state, { nickname: '  ', email: 'a@b.co', privacyAccepted: true });
  assert.match(state.nickname, /^ENGINEER_\d{4}$/);
});

test('有填暱稱就用他填的，並去掉前後空白', function () {
  var state = createInitialState();
  recordRegistration(state, { nickname: '  小琪  ', email: '  a@b.co ', privacyAccepted: true });
  assert.equal(state.nickname, '小琪');
  assert.equal(state.email, 'a@b.co');
});

test('同意紀錄會留下版本與時間，不是只有 true/false', function () {
  var state = createInitialState();
  recordRegistration(state, {
    nickname: '小琪', email: 'a@b.co', privacyAccepted: true, marketingOptIn: true
  });
  assert.equal(state.consent.privacyNoticeAccepted, true);
  assert.equal(state.consent.privacyNoticeVersion, PRIVACY_CONFIG.noticeVersion);
  assert.match(state.consent.privacyNoticeAcceptedAt, /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/);
  assert.equal(state.consent.marketingOptIn, true);
  assert.match(state.consent.marketingOptInAt, /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/);
  assert.match(state.consent.createdAt, /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/);
});

test('沒同意行銷時不留行銷同意時間', function () {
  var state = createInitialState();
  recordRegistration(state, {
    nickname: '小琪', email: 'a@b.co', privacyAccepted: true, marketingOptIn: false
  });
  assert.equal(state.consent.marketingOptIn, false);
  assert.equal(state.consent.marketingOptInAt, '');
});

test('同意時間寫的是台灣時間，不是 UTC', function () {
  var state = createInitialState();
  recordRegistration(state, { email: 'a@b.co', privacyAccepted: true });
  // 不管填答者的手機時區設在哪，都要換算成台灣時間才對得起試算表
  var expected = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit', hourCycle: 'h23'
  }).format(new Date()).replace(/-/g, '/');
  assert.equal(state.consent.createdAt.slice(0, 10), expected);
});

test('兩個選填同意是分開記錄的，不會互相套用', function () {
  var state = createInitialState();
  recordRegistration(state, {
    email: 'a@b.co', privacyAccepted: true, marketingOptIn: true, jobMatchOptIn: false
  });
  assert.equal(state.consent.marketingOptIn, true);
  assert.ok(state.consent.marketingOptInAt);
  assert.equal(state.consent.jobMatchOptIn, false);
  assert.equal(state.consent.jobMatchOptInAt, '');
});

test('只同意職缺聯繫時不會被當成同意課程資訊', function () {
  var state = createInitialState();
  recordRegistration(state, {
    email: 'a@b.co', privacyAccepted: true, marketingOptIn: false, jobMatchOptIn: true
  });
  assert.equal(state.consent.marketingOptIn, false);
  assert.equal(state.consent.marketingOptInAt, '');
  assert.equal(state.consent.jobMatchOptIn, true);
  assert.ok(state.consent.jobMatchOptInAt);
});
