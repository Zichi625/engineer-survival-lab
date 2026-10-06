// Flip to true when Email should block the start as well. Everything else
// -- the field, the hint, the validation -- is already in place.
export var EMAIL_REQUIRED = false;

export function createInitialState() {
  return {
    screen: 'intro',
    levelIndex: 0,
    nickname: '',
    email: '',
    answers: {},
    persona: null,
    survivalIndex: null,
    dimensions: null,
    isAdvancing: false,
    isSubmitting: false,
    hasSubmitError: false
  };
}

export function recordSingleAnswer(state, questionId, value) {
  state.answers[questionId] = value;
  return state;
}

export function toggleMultiAnswer(state, question, value) {
  var current = state.answers[question.id] || [];
  var index = current.indexOf(value);
  var next;

  if (index !== -1) {
    next = current.slice(0, index).concat(current.slice(index + 1));
  } else if (question.exclusiveOption && value === question.exclusiveOption) {
    next = [value];
  } else if (question.exclusiveOption && current.indexOf(question.exclusiveOption) !== -1) {
    next = [value];
  } else if (question.maxSelections && current.length >= question.maxSelections) {
    next = current;
  } else {
    next = current.concat([value]);
  }

  state.answers[question.id] = next;
  return state;
}

export function isLastLevel(state, questions) {
  return state.levelIndex >= questions.length - 1;
}

export function advanceLevel(state) {
  state.levelIndex += 1;
  return state;
}

export function goBackLevel(state) {
  if (state.levelIndex > 0) {
    state.levelIndex -= 1;
  }
  return state;
}

export function recordRegistration(state, nickname, email) {
  state.nickname = (nickname || '').trim();
  state.email = (email || '').trim();
  return state;
}

// Returns the field that is not acceptable yet, or null when good to go.
export function validateRegistration(nickname, email) {
  if (!(nickname || '').trim()) return 'nickname';
  var mail = (email || '').trim();
  if (!mail) return EMAIL_REQUIRED ? 'email' : null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail) ? null : 'email';
}
