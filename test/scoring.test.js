import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeDimensions, computeSurvivalIndex, computePersona, pickHighestByPriority } from '../js/scoring.js';

function baseAnswers(overrides) {
  var answers = {
    role: 'frontend',
    experience: 'gt10',
    satisfaction: 'great',
    salary: 'over100',
    headhunterReaction: 'ignore',
    jumpThreshold: 'workMatters',
    careerBug: 'skill',
    aiFrequency: 'sometimes',
    aiTools: ['chatgpt'],
    aiImpact: 'noDiff',
    aiFear: 'notScared',
    goal2027: 'remote'
  };
  return Object.assign(answers, overrides);
}

test('computeDimensions averages the relevant question values per dimension', function () {
  var dims = computeDimensions(baseAnswers());
  assert.equal(dims.salary, 5);
  assert.equal(dims.stability, 5);
  assert.equal(dims.aiAdapt, 3);
  assert.equal(dims.radar, 1);
});

test('computeSurvivalIndex is the four-dimension average scaled to a percentage', function () {
  assert.equal(computeSurvivalIndex(baseAnswers()), 70);
});

test('computePersona picks stableGrowth for a content, low-radar profile', function () {
  assert.equal(computePersona(baseAnswers()), 'stableGrowth');
});

test('computePersona picks jobHopper for a dissatisfied, highly-mobile profile', function () {
  var persona = computePersona(baseAnswers({
    satisfaction: 'terrible',
    headhunterReaction: 'please',
    jumpThreshold: 'noRaise',
    goal2027: 'switchJob'
  }));
  assert.equal(persona, 'jobHopper');
});

test('computePersona picks aiEvolved for a heavy multi-tool AI user', function () {
  var persona = computePersona(baseAnswers({
    aiFrequency: 'daily',
    aiTools: ['chatgpt', 'claude', 'cursor'],
    aiImpact: 'faster',
    goal2027: 'switchToAI',
    careerBug: 'promotion'
  }));
  assert.equal(persona, 'aiEvolved');
});

test('pickHighestByPriority returns the strictly-higher score', function () {
  var result = pickHighestByPriority({ a: 1, b: 5, c: 3 }, ['a', 'b', 'c']);
  assert.equal(result, 'b');
});

test('pickHighestByPriority breaks ties using priority order', function () {
  var result = pickHighestByPriority(
    { aiEvolved: 4, jobHopper: 4, careerDebugger: 1, radarWatcher: 1, stableGrowth: 1 },
    ['aiEvolved', 'jobHopper', 'careerDebugger', 'radarWatcher', 'stableGrowth']
  );
  assert.equal(result, 'aiEvolved');
});
