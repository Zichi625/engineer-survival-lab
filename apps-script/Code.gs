var SHARED_SECRET = 'REPLACE_WITH_YOUR_OWN_SECRET';
var RESPONSES_SHEET_NAME = '問卷回答';
var LEADS_SHEET_NAME = '名單';

function doPost(e) {
  var body = JSON.parse(e.postData.contents);
  if (body.secret !== SHARED_SECRET) {
    return respond({ status: 'error', message: 'invalid secret' });
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (body.sheet === 'responses') {
    appendResponse(ss, body.payload || {});
  } else if (body.sheet === 'leads') {
    appendLead(ss, body.payload || {});
  } else {
    return respond({ status: 'error', message: 'unknown sheet' });
  }

  return respond({ status: 'ok' });
}

function appendResponse(ss, payload) {
  var sheet = ss.getSheetByName(RESPONSES_SHEET_NAME);
  sheet.appendRow([
    new Date(),
    payload.role || '',
    payload.experience || '',
    payload.satisfaction || '',
    payload.salary || '',
    payload.headhunterReaction || '',
    payload.jumpThreshold || '',
    payload.careerBug || '',
    payload.aiFrequency || '',
    payload.aiTools || '',
    payload.aiImpact || '',
    payload.aiFear || '',
    payload.goal2027 || '',
    payload.persona || '',
    payload.survivalIndex || ''
  ]);
}

function appendLead(ss, payload) {
  var sheet = ss.getSheetByName(LEADS_SHEET_NAME);
  sheet.appendRow([
    new Date(),
    payload.email || '',
    payload.interests || '',
    payload.persona || '',
    payload.survivalIndex || ''
  ]);
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
