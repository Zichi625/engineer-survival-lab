import { GAS_WEB_APP_URL, GAS_SHARED_SECRET } from '../config.js';

export function submitResponse(answers, persona, survivalIndex, openFeedback) {
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
    survivalIndex: survivalIndex,
    openFeedback: openFeedback || ''
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

function sendOnce(sheetName, payload) {
  return fetch(GAS_WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ secret: GAS_SHARED_SECRET, sheet: sheetName, payload: payload })
  }).then(function (res) {
    return res.json();
  });
}

function postToSheet(sheetName, payload) {
  if (!GAS_WEB_APP_URL) {
    console.warn('GAS_WEB_APP_URL 未設定，略過送出');
    return Promise.resolve({ status: 'skipped' });
  }

  // Booth wifi drops the odd request, so give a failed send one more go before
  // telling the player it did not work.
  return sendOnce(sheetName, payload)
    .catch(function (err) {
      console.warn('送出失敗，1 秒後重試一次（' + sheetName + '）：', err);
      return new Promise(function (resolve) {
        setTimeout(function () { resolve(sendOnce(sheetName, payload)); }, 1000);
      });
    })
    .then(function (body) {
      // Apps Script answers 200 even when it refuses the write (wrong secret,
      // missing tab), so the reason only shows up in the body. Log it -- the
      // player-facing message cannot say which it was.
      if (body && body.status === 'error') {
        console.error('後端拒絕寫入（' + sheetName + '）：' + (body.message || JSON.stringify(body)));
      }
      return body;
    })
    .catch(function (err) {
      console.error('送出失敗，重試後仍不成功（' + sheetName + '）：', err);
      return { status: 'error', error: String(err) };
    });
}
