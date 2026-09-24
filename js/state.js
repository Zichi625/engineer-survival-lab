export function createInitialState() {
  return {
    screen: 'intro',
    levelIndex: 0,
    answers: {},
    persona: null,
    survivalIndex: null,
    dimensions: null
  };
}

export function recordSingleAnswer(state, questionId, value) {
  state.answers[questionId] = value;
  return state;
}

export function toggleMultiAnswer(state, questionId, value) {
  var current = state.answers[questionId] || [];
  var index = current.indexOf(value);
  state.answers[questionId] = index === -1
    ? current.concat([value])
    : current.slice(0, index).concat(current.slice(index + 1));
  return state;
}

export function isLastLevel(state, questions) {
  return state.levelIndex >= questions.length - 1;
}

export function advanceLevel(state) {
  state.levelIndex += 1;
  return state;
}
