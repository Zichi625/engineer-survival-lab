import { GAS_WEB_APP_URL, GAS_SHARED_SECRET } from '../config.js';

// Takes one object rather than a positional list: with the four dimension
// scores and the recommended course added, the argument order was becoming the
// kind of thing you have to count on your fingers.
export function submitResponse(data) {
  var answers = data.answers || {};
  var dims = data.dimensions || {};
  var course = data.course || {};
  return postToSheet('responses', {
    role: answers.role || '',
    experience: answers.experience || '',
    satisfaction: answers.satisfaction || '',
    salary: answers.salary || '',
    headhunterReaction: answers.headhunterReaction || '',
    jumpThreshold: answers.jumpThreshold || '',
    careerBug: (answers.careerBug || []).join('、'),
    aiFrequency: answers.aiFrequency || '',
    aiTools: (answers.aiTools || []).join('、'),
    aiImpact: answers.aiImpact || '',
    aiFear: answers.aiFear || '',
    goal2027: answers.goal2027 || '',
    persona: data.persona || '',
    survivalIndex: data.survivalIndex,
    openFeedback: data.openFeedback || '',
    // The four scores behind the result card, kept so trends can be read off
    // the sheet instead of being recomputed by hand.
    stability: dims.stability || '',
    radar: dims.radar || '',
    aiAdapt: dims.aiAdapt || '',
    careerBugIndex: dims.careerBugIndex || '',
    recommendedCourse: course.name || '',
    sessionCode: data.sessionCode || ''
  });
}

export function submitLead(leadData, persona, survivalIndex) {
  var consent = leadData.consent || {};
  return postToSheet('leads', {
    nickname: leadData.nickname || '',
    email: leadData.email || '',
    privacyNoticeAccepted: consent.privacyNoticeAccepted ? 'TRUE' : 'FALSE',
    privacyNoticeVersion: consent.privacyNoticeVersion || '',
    privacyNoticeAcceptedAt: consent.privacyNoticeAcceptedAt || '',
    // One tick covering both 主辦單位: only TRUE here may be sent course,
    // activity or job information.
    marketingOptIn: consent.marketingOptIn ? 'TRUE' : 'FALSE',
    marketingOptInAt: consent.marketingOptInAt || '',
    createdAt: consent.createdAt || '',
    persona: persona || '',
    survivalIndex: survivalIndex,
    sessionCode: leadData.sessionCode || ''
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
