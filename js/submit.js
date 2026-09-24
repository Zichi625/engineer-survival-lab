import { GAS_WEB_APP_URL, GAS_SHARED_SECRET } from '../config.js';

export function submitResponse(answers, persona, survivalIndex) {
  return postToSheet('responses', {
    role: answers.role || '',
    experience: answers.experience || '',
    satisfaction: answers.satisfaction || '',
    salary: answers.salary || '',
    headhunterReaction: answers.headhunterReaction || '',
    jumpThreshold: answers.jumpThreshold || '',
    careerBug: answers.careerBug || '',
    aiFrequency: answers.aiFrequency || '',
    aiTools: (answers.aiTools || []).join('、'),
    aiImpact: answers.aiImpact || '',
    aiFear: answers.aiFear || '',
    goal2027: answers.goal2027 || '',
    persona: persona || '',
    survivalIndex: survivalIndex
  });
}

export function submitLead(leadData, persona, survivalIndex) {
  return postToSheet('leads', {
    email: leadData.email || '',
    interests: (leadData.interests || []).join('、'),
    persona: persona || '',
    survivalIndex: survivalIndex
  });
}

function postToSheet(sheetName, payload) {
  if (!GAS_WEB_APP_URL) {
    console.warn('GAS_WEB_APP_URL 未設定，略過送出');
    return Promise.resolve({ status: 'skipped' });
  }
  return fetch(GAS_WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ secret: GAS_SHARED_SECRET, sheet: sheetName, payload: payload })
  })
    .then(function (res) { return res.json(); })
    .catch(function (err) {
      console.error('送出失敗', err);
      return { status: 'error', error: String(err) };
    });
}
