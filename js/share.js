var CARD_X = 60;
var CARD_RIGHT = 1020;
var CARD_TOP = 90;
var CARD_BOTTOM = 1270;
var CANVAS_WIDTH = 1080;
var CANVAS_HEIGHT = 1350;
var FONT = '"Inter", "PingFang TC", "Noto Sans TC", sans-serif';

export function exportResultCardImage(data) {
  var canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  var ctx = canvas.getContext('2d');
  var accent = data.persona.accent || '#FF6B6B';
  var accentStrong = data.persona.accentStrong || '#7DD3FC';

  drawBackground(ctx, canvas, accent, accentStrong);
  drawCardPanel(ctx, accent, accentStrong);
  drawBadgeAndHeading(ctx, data, accent, accentStrong);
  drawStats(ctx, data, accent, accentStrong);
  drawHighlight(ctx, data, accent);
  drawTags(ctx, data);
  drawMission(ctx, data);
  drawFooter(ctx);

  return Promise.resolve(canvas);
}

export function shareOrDownloadImage(canvas) {
  canvas.toBlob(function (blob) {
    if (!blob) return;
    var file = new File([blob], 'engineer-survival-card.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: '我的工程師生存卡' }).catch(function (err) {
        if (err && err.name !== 'AbortError') {
          downloadBlob(blob);
        }
      });
    } else {
      downloadBlob(blob);
    }
  }, 'image/png');
}

function drawBackground(ctx, canvas, accent, accentStrong) {
  var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#12161A');
  gradient.addColorStop(1, '#1A1F26');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var glow = ctx.createRadialGradient(220, 180, 0, 220, 180, 480);
  glow.addColorStop(0, hexToRgba(accent, 0.18));
  glow.addColorStop(1, hexToRgba(accent, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var glow2 = ctx.createRadialGradient(900, 100, 0, 900, 100, 480);
  glow2.addColorStop(0, hexToRgba(accentStrong, 0.14));
  glow2.addColorStop(1, hexToRgba(accentStrong, 0));
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCardPanel(ctx, accent, accentStrong) {
  var r = 36;
  roundRectPath(ctx, CARD_X, CARD_TOP, CARD_RIGHT - CARD_X, CARD_BOTTOM - CARD_TOP, r);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.045)';
  ctx.fill();

  var borderGradient = ctx.createLinearGradient(CARD_X, CARD_TOP, CARD_RIGHT, CARD_BOTTOM);
  borderGradient.addColorStop(0, hexToRgba(accent, 0.8));
  borderGradient.addColorStop(1, hexToRgba(accentStrong, 0.7));
  ctx.lineWidth = 3;
  ctx.strokeStyle = borderGradient;
  roundRectPath(ctx, CARD_X, CARD_TOP, CARD_RIGHT - CARD_X, CARD_BOTTOM - CARD_TOP, r);
  ctx.stroke();
}

function drawBadgeAndHeading(ctx, data, accent, accentStrong) {
  ctx.font = 'bold 22px ' + FONT;
  var badgeText = 'SURVIVAL TYPE';
  var badgeWidth = ctx.measureText(badgeText).width + 56;
  var badgeX = 540 - badgeWidth / 2;
  var badgeY = 138;
  roundRectPath(ctx, badgeX, badgeY, badgeWidth, 44, 22);
  ctx.fillStyle = hexToRgba(accent, 0.12);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = hexToRgba(accent, 0.5);
  roundRectPath(ctx, badgeX, badgeY, badgeWidth, 44, 22);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(badgeText, 540, badgeY + 23);
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 58px ' + FONT;
  ctx.fillText(data.persona.emoji + ' ' + data.persona.name, 540, 250);

  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 22px ' + FONT;
  ctx.fillText(data.persona.englishName || '', 540, 288);

  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 20px ' + FONT;
  ctx.fillText('SURVIVAL SCORE', 540, 345);

  ctx.fillStyle = accent;
  ctx.font = 'bold 64px ' + FONT;
  ctx.fillText(String(data.survivalIndex), 540, 415);
  var scoreWidth = ctx.measureText(String(data.survivalIndex)).width;
  ctx.font = 'bold 26px ' + FONT;
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('/100', 540 + scoreWidth / 2 + 34, 415);

  roundRectPath(ctx, 140, 440, 800, 14, 7);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fill();
  var indexGradient = ctx.createLinearGradient(140, 0, 940, 0);
  indexGradient.addColorStop(0, accent);
  indexGradient.addColorStop(1, accentStrong);
  roundRectPath(ctx, 140, 440, 800 * (data.survivalIndex / 100), 14, 7);
  ctx.fillStyle = indexGradient;
  ctx.fill();
}

function drawStats(ctx, data, accent, accentStrong) {
  var rows = [
    ['工作穩定度', data.dimensions.stability],
    ['AI 適應度', data.dimensions.aiAdapt],
    ['轉職雷達', data.dimensions.radar],
    ['Career Bug 指數', data.dimensions.careerBugIndex]
  ];
  var startY = 520;
  var rowHeight = 105;

  rows.forEach(function (row, i) {
    var labelY = startY + i * rowHeight;
    var percent = Math.round((row[1] / 5) * 100);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '30px ' + FONT;
    ctx.fillText(row[0], 140, labelY);
    ctx.textAlign = 'right';
    ctx.fillStyle = accent;
    ctx.font = 'bold 30px ' + FONT;
    ctx.fillText(percent + '%', 940, labelY);

    var barY = labelY + 22;
    roundRectPath(ctx, 140, barY, 800, 14, 7);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fill();
    var barGradient = ctx.createLinearGradient(140, 0, 940, 0);
    barGradient.addColorStop(0, accent);
    barGradient.addColorStop(1, accentStrong);
    roundRectPath(ctx, 140, barY, 800 * (percent / 100), 14, 7);
    ctx.fillStyle = barGradient;
    ctx.fill();
  });

  ctx.textAlign = 'left';
}

function drawHighlight(ctx, data, accent) {
  var boxY = 970;
  var boxH = 110;
  roundRectPath(ctx, 140, boxY, 800, boxH, 12);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.fill();
  ctx.fillStyle = hexToRgba(accent, 0.9);
  ctx.fillRect(140, boxY, 6, boxH);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 30px ' + FONT;
  wrapText(ctx, data.persona.highlight, 176, boxY + 46, 720, 42);
}

function drawTags(ctx, data) {
  var bugY = 1105;
  var tagH = 64;
  roundRectPath(ctx, 140, bugY, 390, tagH, 14);
  ctx.fillStyle = 'rgba(255, 77, 77, 0.08)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 77, 77, 0.35)';
  roundRectPath(ctx, 140, bugY, 390, tagH, 14);
  ctx.stroke();
  ctx.fillStyle = '#FF8A8A';
  ctx.font = '24px ' + FONT;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  wrapText(ctx, '🐛 ' + data.careerBugLabel, 160, bugY + tagH / 2 - 4, 350, 24);
  ctx.textBaseline = 'alphabetic';

  var buffX = 550;
  roundRectPath(ctx, buffX, bugY, 390, tagH, tagH / 2);
  ctx.fillStyle = 'rgba(139, 92, 246, 0.12)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
  roundRectPath(ctx, buffX, bugY, 390, tagH, tagH / 2);
  ctx.stroke();
  ctx.fillStyle = '#C4B5FD';
  ctx.textBaseline = 'middle';
  wrapText(ctx, '⚡ ' + data.aiBuffLabel, buffX + 20, bugY + tagH / 2 - 4, 350, 24);
  ctx.textBaseline = 'alphabetic';
}

function drawMission(ctx, data) {
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 18px ' + FONT;
  ctx.fillText('NEXT MISSION · 2027', 540, 1215);
  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 30px ' + FONT;
  ctx.fillText('🏆 ' + data.goalLabel, 540, 1252);
}

function drawFooter(ctx) {
  ctx.textAlign = 'center';
  ctx.font = '24px ' + FONT;
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('多角人才 × 工程師真心話研究所', 540, 1315);
}

function hexToRgba(hex, alpha) {
  var normalized = hex.replace('#', '');
  var r = parseInt(normalized.substring(0, 2), 16);
  var g = parseInt(normalized.substring(2, 4), 16);
  var b = parseInt(normalized.substring(4, 6), 16);
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
}

function roundRectPath(ctx, x, y, width, height, radius) {
  var r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  var chars = text.split('');
  var line = '';
  var currentY = y;
  chars.forEach(function (char) {
    var testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
      ctx.fillText(line, x, currentY);
      line = char;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  });
  if (line) {
    ctx.fillText(line, x, currentY);
  }
  return currentY;
}

function downloadBlob(blob) {
  var url = URL.createObjectURL(blob);
  var link = document.createElement('a');
  link.href = url;
  link.download = 'engineer-survival-card.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}
