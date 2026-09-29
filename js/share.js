var CARD_X = 60;
var CARD_RIGHT = 1020;
var CARD_TOP = 110;
var CARD_BOTTOM = 1480;
var CANVAS_HEIGHT = 1600;
var FONT = '"Inter", "PingFang TC", "Noto Sans TC", sans-serif';

export function exportResultCardImage(data) {
  var canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = CANVAS_HEIGHT;
  var ctx = canvas.getContext('2d');

  drawBackground(ctx, canvas);
  drawCardPanel(ctx);
  drawBadgeAndHeading(ctx, data);
  drawStats(ctx, data);
  drawHighlight(ctx, data);
  drawTags(ctx, data);
  drawGoal(ctx, data);
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

function drawBackground(ctx, canvas) {
  var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#12161A');
  gradient.addColorStop(1, '#1A1F26');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var glow = ctx.createRadialGradient(220, 200, 0, 220, 200, 500);
  glow.addColorStop(0, 'rgba(255, 107, 107, 0.18)');
  glow.addColorStop(1, 'rgba(255, 107, 107, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var glow2 = ctx.createRadialGradient(900, 120, 0, 900, 120, 500);
  glow2.addColorStop(0, 'rgba(56, 189, 248, 0.14)');
  glow2.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCardPanel(ctx) {
  var r = 40;
  roundRectPath(ctx, CARD_X, CARD_TOP, CARD_RIGHT - CARD_X, CARD_BOTTOM - CARD_TOP, r);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.045)';
  ctx.fill();

  var borderGradient = ctx.createLinearGradient(CARD_X, CARD_TOP, CARD_RIGHT, CARD_BOTTOM);
  borderGradient.addColorStop(0, 'rgba(255, 107, 107, 0.8)');
  borderGradient.addColorStop(1, 'rgba(56, 189, 248, 0.7)');
  ctx.lineWidth = 3;
  ctx.strokeStyle = borderGradient;
  roundRectPath(ctx, CARD_X, CARD_TOP, CARD_RIGHT - CARD_X, CARD_BOTTOM - CARD_TOP, r);
  ctx.stroke();
}

function drawBadgeAndHeading(ctx, data) {
  ctx.font = 'bold 26px ' + FONT;
  var badgeText = 'SURVIVAL TYPE';
  var badgeWidth = ctx.measureText(badgeText).width + 64;
  var badgeX = 540 - badgeWidth / 2;
  var badgeY = 168;
  roundRectPath(ctx, badgeX, badgeY, badgeWidth, 52, 26);
  ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
  roundRectPath(ctx, badgeX, badgeY, badgeWidth, 52, 26);
  ctx.stroke();
  ctx.fillStyle = '#7DD3FC';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(badgeText, 540, badgeY + 27);
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 66px ' + FONT;
  ctx.fillText(data.persona.emoji + ' ' + data.persona.name, 540, 320);

  ctx.fillStyle = '#FF6B6B';
  ctx.font = 'bold 38px ' + FONT;
  ctx.fillText('生存指數 ' + data.survivalIndex + '%', 540, 390);

  roundRectPath(ctx, 140, 410, 800, 14, 7);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fill();
  var indexGradient = ctx.createLinearGradient(140, 0, 940, 0);
  indexGradient.addColorStop(0, '#FF6B6B');
  indexGradient.addColorStop(1, '#7DD3FC');
  roundRectPath(ctx, 140, 410, 800 * (data.survivalIndex / 100), 14, 7);
  ctx.fillStyle = indexGradient;
  ctx.fill();
}

function drawStats(ctx, data) {
  var rows = [
    ['薪資滿意度', data.dimensions.salary],
    ['工作穩定度', data.dimensions.stability],
    ['AI 適應度', data.dimensions.aiAdapt],
    ['轉職雷達', data.dimensions.radar]
  ];
  var startY = 500;
  var rowHeight = 130;

  rows.forEach(function (row, i) {
    var labelY = startY + i * rowHeight;
    var percent = Math.round((row[1] / 5) * 100);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '34px ' + FONT;
    ctx.fillText(row[0], 140, labelY);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#FF6B6B';
    ctx.font = 'bold 34px ' + FONT;
    ctx.fillText(percent + '%', 940, labelY);

    var barY = labelY + 24;
    roundRectPath(ctx, 140, barY, 800, 16, 8);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fill();
    var barGradient = ctx.createLinearGradient(140, 0, 940, 0);
    barGradient.addColorStop(0, '#FF6B6B');
    barGradient.addColorStop(1, '#7DD3FC');
    roundRectPath(ctx, 140, barY, 800 * (percent / 100), 16, 8);
    ctx.fillStyle = barGradient;
    ctx.fill();
  });

  ctx.textAlign = 'left';
}

function drawHighlight(ctx, data) {
  var boxY = 1000;
  var boxH = 150;
  roundRectPath(ctx, 140, boxY, 800, boxH, 12);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 107, 107, 0.9)';
  ctx.fillRect(140, boxY, 6, boxH);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 34px ' + FONT;
  wrapText(ctx, data.persona.highlight, 176, boxY + 60, 720, 48);
}

function drawTags(ctx, data) {
  var bugY = 1190;
  var tagH = 90;
  roundRectPath(ctx, 140, bugY, 800, tagH, 16);
  ctx.fillStyle = 'rgba(255, 77, 77, 0.08)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 77, 77, 0.35)';
  roundRectPath(ctx, 140, bugY, 800, tagH, 16);
  ctx.stroke();
  ctx.fillStyle = '#FF8A8A';
  ctx.font = '32px ' + FONT;
  ctx.textBaseline = 'middle';
  ctx.fillText('🐛 Career Bug：' + data.careerBugLabel, 172, bugY + tagH / 2);

  var buffY = bugY + tagH + 20;
  roundRectPath(ctx, 140, buffY, 800, tagH, tagH / 2);
  ctx.fillStyle = 'rgba(139, 92, 246, 0.12)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
  roundRectPath(ctx, 140, buffY, 800, tagH, tagH / 2);
  ctx.stroke();
  ctx.fillStyle = '#C4B5FD';
  ctx.fillText('⚡ AI Buff：' + data.aiBuffLabel, 172, buffY + tagH / 2);
  ctx.textBaseline = 'alphabetic';
}

function drawGoal(ctx, data) {
  ctx.textAlign = 'center';
  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 32px ' + FONT;
  ctx.fillText('🏆 2027 想解鎖：' + data.goalLabel, 540, 1420);
}

function drawFooter(ctx) {
  ctx.textAlign = 'center';
  ctx.font = '26px ' + FONT;
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('多角人才 × 工程師真心話研究所', 540, 1550);
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
