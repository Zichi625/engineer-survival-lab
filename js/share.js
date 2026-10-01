var CARD_X = 60;
var CARD_RIGHT = 1020;
var CARD_TOP = 90;
var CANVAS_WIDTH = 1080;
var FONT = '"Inter", "PingFang TC", "Noto Sans TC", sans-serif';

var HIGHLIGHT_Y = 990;
var HIGHLIGHT_H = 100;
var DEEP_DIVE_SECTIONS = [
  { type: 'target', label: '核心動機', color: '#7DD3FC', key: 'motivation' },
  { type: 'warning', label: '潛在風險', color: '#F87171', key: 'risk' },
  { type: 'compass', label: '建議行動', color: '#34D399', key: 'action' }
];
var DEEP_DIVE_BLOCK_GAP = 48;
var DEEP_DIVE_LABEL_HEIGHT = 36;
var DEEP_DIVE_LINE_HEIGHT = 34;
var DEEP_DIVE_TITLE_HEIGHT = 48;
var TAG_H = 58;

function loadImage(src) {
  return new Promise(function (resolve) {
    var img = new Image();
    img.onload = function () { resolve(img); };
    img.onerror = function () { resolve(null); };
    img.src = src;
  });
}

export async function exportResultCardImage(data) {
  var accent = data.persona.accent || '#FF6B6B';
  var accentStrong = data.persona.accentStrong || '#7DD3FC';
  var mascotImg = data.persona.mascotImage ? await loadImage(data.persona.mascotImage) : null;

  var measureCtx = document.createElement('canvas').getContext('2d');
  var deepDiveHeight = measureDeepDiveHeight(measureCtx, data.persona.deepDive);

  var deepDiveY = HIGHLIGHT_Y + HIGHLIGHT_H + 60;
  var tagsY = deepDiveY + deepDiveHeight + 36;
  var missionLabelY = tagsY + TAG_H + 55;
  var missionContentY = missionLabelY + 34;
  var cardBottom = missionContentY + 46;
  var footerY = cardBottom + 55;
  var canvasHeight = footerY + 40;

  var canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = canvasHeight;
  var ctx = canvas.getContext('2d');

  drawBackground(ctx, canvas, accent, accentStrong);
  drawCardPanel(ctx, accent, accentStrong, cardBottom);
  drawMascot(ctx, mascotImg);
  drawBadgeAndHeading(ctx, data, accent, accentStrong);
  drawStats(ctx, data, accent, accentStrong);
  drawHighlight(ctx, data, accent);
  drawDeepDive(ctx, data.persona.deepDive, accent, deepDiveY);
  drawTags(ctx, data, tagsY);
  drawMission(ctx, data, missionLabelY, missionContentY);
  drawFooter(ctx, footerY);

  return canvas;
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

function drawCardPanel(ctx, accent, accentStrong, cardBottom) {
  var r = 36;
  roundRectPath(ctx, CARD_X, CARD_TOP, CARD_RIGHT - CARD_X, cardBottom - CARD_TOP, r);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.045)';
  ctx.fill();

  var borderGradient = ctx.createLinearGradient(CARD_X, CARD_TOP, CARD_RIGHT, cardBottom);
  borderGradient.addColorStop(0, hexToRgba(accent, 0.8));
  borderGradient.addColorStop(1, hexToRgba(accentStrong, 0.7));
  ctx.lineWidth = 3;
  ctx.strokeStyle = borderGradient;
  roundRectPath(ctx, CARD_X, CARD_TOP, CARD_RIGHT - CARD_X, cardBottom - CARD_TOP, r);
  ctx.stroke();
}

function drawMascot(ctx, img) {
  if (!img) return;
  var targetH = 150;
  var targetW = (img.width / img.height) * targetH;
  var x = 540 - targetW / 2;
  var y = 98;
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 24;
  ctx.drawImage(img, x, y, targetW, targetH);
  ctx.restore();
}

function drawBadgeAndHeading(ctx, data, accent, accentStrong) {
  ctx.font = 'bold 22px ' + FONT;
  var badgeText = 'SURVIVAL TYPE';
  var badgeWidth = ctx.measureText(badgeText).width + 56;
  var badgeX = 540 - badgeWidth / 2;
  var badgeY = 258;
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
  ctx.font = 'bold 52px ' + FONT;
  ctx.fillText(data.persona.emoji + ' ' + data.persona.name, 540, 362);

  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 20px ' + FONT;
  ctx.fillText(data.persona.englishName || '', 540, 396);

  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 18px ' + FONT;
  ctx.fillText('SURVIVAL SCORE', 540, 446);

  ctx.fillStyle = accent;
  ctx.font = 'bold 56px ' + FONT;
  ctx.fillText(String(data.survivalIndex), 540, 510);
  var scoreWidth = ctx.measureText(String(data.survivalIndex)).width;
  ctx.font = 'bold 24px ' + FONT;
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('/100', 540 + scoreWidth / 2 + 30, 510);

  roundRectPath(ctx, 140, 532, 800, 14, 7);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fill();
  var indexGradient = ctx.createLinearGradient(140, 0, 940, 0);
  indexGradient.addColorStop(0, accent);
  indexGradient.addColorStop(1, accentStrong);
  roundRectPath(ctx, 140, 532, 800 * (data.survivalIndex / 100), 14, 7);
  ctx.fillStyle = indexGradient;
  ctx.fill();
}

function drawStats(ctx, data, accent, accentStrong) {
  var rows = [
    ['工作穩定度', data.dimensions.stability],
    ['AI 適應度', data.dimensions.aiAdapt],
    ['轉職雷達', data.dimensions.radar],
    ['職涯卡點指數', data.dimensions.careerBugIndex]
  ];
  var startY = 610;
  var rowHeight = 96;

  rows.forEach(function (row, i) {
    var labelY = startY + i * rowHeight;
    var percent = Math.round((row[1] / 5) * 100);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '28px ' + FONT;
    ctx.fillText(row[0], 140, labelY);
    ctx.textAlign = 'right';
    ctx.fillStyle = accent;
    ctx.font = 'bold 28px ' + FONT;
    ctx.fillText(percent + '%', 940, labelY);

    var barY = labelY + 20;
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
  roundRectPath(ctx, 140, HIGHLIGHT_Y, 800, HIGHLIGHT_H, 12);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.fill();
  ctx.fillStyle = hexToRgba(accent, 0.9);
  ctx.fillRect(140, HIGHLIGHT_Y, 6, HIGHLIGHT_H);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 28px ' + FONT;
  wrapText(ctx, data.persona.highlight, 176, HIGHLIGHT_Y + 42, 720, 38);
}

function measureDeepDiveHeight(ctx, deepDive) {
  var total = DEEP_DIVE_TITLE_HEIGHT;
  DEEP_DIVE_SECTIONS.forEach(function (section, i) {
    ctx.font = '23px ' + FONT;
    var lines = measureWrappedLines(ctx, deepDive[section.key], 800);
    total += DEEP_DIVE_LABEL_HEIGHT + lines * DEEP_DIVE_LINE_HEIGHT;
    if (i < DEEP_DIVE_SECTIONS.length - 1) total += DEEP_DIVE_BLOCK_GAP;
  });
  return total;
}

function drawDeepDive(ctx, deepDive, accent, startY) {
  ctx.textAlign = 'left';
  var titleIconSize = 24;
  drawInlineIcon(ctx, 'search', 140, startY - titleIconSize * 0.78, titleIconSize, accent);
  ctx.fillStyle = accent;
  ctx.font = 'bold 26px ' + FONT;
  ctx.fillText('深入解讀', 140 + titleIconSize + 12, startY);

  var cursorY = startY + DEEP_DIVE_TITLE_HEIGHT;
  DEEP_DIVE_SECTIONS.forEach(function (section, i) {
    var iconSize = 22;
    drawInlineIcon(ctx, section.type, 140, cursorY - iconSize * 0.78, iconSize, section.color);
    ctx.fillStyle = section.color;
    ctx.font = 'bold 24px ' + FONT;
    ctx.fillText(section.label, 140 + iconSize + 10, cursorY);
    cursorY += DEEP_DIVE_LABEL_HEIGHT;

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '23px ' + FONT;
    cursorY = wrapText(ctx, deepDive[section.key], 140, cursorY, 800, DEEP_DIVE_LINE_HEIGHT);
    if (i < DEEP_DIVE_SECTIONS.length - 1) cursorY += DEEP_DIVE_BLOCK_GAP;
  });
}

function drawTags(ctx, data, bugY) {
  roundRectPath(ctx, 140, bugY, 390, TAG_H, 14);
  ctx.fillStyle = 'rgba(255, 77, 77, 0.08)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 77, 77, 0.35)';
  roundRectPath(ctx, 140, bugY, 390, TAG_H, 14);
  ctx.stroke();
  var bugIconSize = 22;
  drawInlineIcon(ctx, 'bug', 160, bugY + TAG_H / 2 - bugIconSize / 2, bugIconSize, '#FF8A8A');
  ctx.fillStyle = '#FF8A8A';
  ctx.font = '22px ' + FONT;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  wrapText(ctx, '職涯卡點：' + data.careerBugLabel, 160 + bugIconSize + 10, bugY + TAG_H / 2 - 4, 350 - bugIconSize - 10, 24);
  ctx.textBaseline = 'alphabetic';

  var buffX = 550;
  roundRectPath(ctx, buffX, bugY, 390, TAG_H, TAG_H / 2);
  ctx.fillStyle = 'rgba(139, 92, 246, 0.12)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
  roundRectPath(ctx, buffX, bugY, 390, TAG_H, TAG_H / 2);
  ctx.stroke();
  var zapIconSize = 22;
  drawInlineIcon(ctx, 'zap', buffX + 20, bugY + TAG_H / 2 - zapIconSize / 2, zapIconSize, '#C4B5FD');
  ctx.fillStyle = '#C4B5FD';
  ctx.textBaseline = 'middle';
  wrapText(ctx, data.aiBuffLabel, buffX + 20 + zapIconSize + 8, bugY + TAG_H / 2 - 4, 350 - zapIconSize - 8, 24);
  ctx.textBaseline = 'alphabetic';
}

function drawMission(ctx, data, labelY, contentY) {
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 16px ' + FONT;
  ctx.fillText('NEXT MISSION · 2027', 540, labelY);

  ctx.font = 'bold 28px ' + FONT;
  var textWidth = ctx.measureText(data.goalLabel).width;
  var iconSize = 26;
  var gap = 10;
  var startX = 540 - (iconSize + gap + textWidth) / 2;
  drawInlineIcon(ctx, 'trophy', startX, contentY - iconSize * 0.78, iconSize, '#FBBF24');
  ctx.textAlign = 'left';
  ctx.fillStyle = '#F8FAFC';
  ctx.fillText(data.goalLabel, startX + iconSize + gap, contentY);
  ctx.textAlign = 'center';
}

function drawInlineIcon(ctx, type, x, y, size, color) {
  var cx = x + size / 2;
  var cy = y + size / 2;
  var r = size / 2;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(1.5, size * 0.1);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (type === 'search') {
    ctx.beginPath();
    ctx.arc(cx - r * 0.12, cy - r * 0.12, r * 0.52, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.28, cy + r * 0.28);
    ctx.lineTo(cx + r * 0.78, cy + r * 0.78);
    ctx.stroke();
  } else if (type === 'target') {
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.82, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.42, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.1, 0, Math.PI * 2); ctx.fill();
  } else if (type === 'warning') {
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.85);
    ctx.lineTo(cx + r * 0.85, cy + r * 0.65);
    ctx.lineTo(cx - r * 0.85, cy + r * 0.65);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.18);
    ctx.lineTo(cx, cy + r * 0.14);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.42, r * 0.06, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'compass') {
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.82, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.34, cy + r * 0.4);
    ctx.lineTo(cx + r * 0.14, cy - r * 0.14);
    ctx.lineTo(cx + r * 0.34, cy - r * 0.4);
    ctx.lineTo(cx - r * 0.14, cy + r * 0.14);
    ctx.closePath();
    ctx.fill();
  } else if (type === 'bug') {
    ctx.beginPath();
    ctx.ellipse(cx, cy + r * 0.05, r * 0.42, r * 0.58, 0, 0, Math.PI * 2);
    ctx.stroke();
    [-1, 0, 1].forEach(function (t) {
      ctx.beginPath(); ctx.moveTo(cx - r * 0.4, cy + t * r * 0.45); ctx.lineTo(cx - r * 0.85, cy + t * r * 0.6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + r * 0.4, cy + t * r * 0.45); ctx.lineTo(cx + r * 0.85, cy + t * r * 0.6); ctx.stroke();
    });
    ctx.beginPath(); ctx.moveTo(cx, cy - r * 0.58); ctx.lineTo(cx, cy - r * 0.9); ctx.stroke();
  } else if (type === 'zap') {
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.12, cy - r * 0.85);
    ctx.lineTo(cx - r * 0.5, cy + r * 0.1);
    ctx.lineTo(cx - r * 0.05, cy + r * 0.1);
    ctx.lineTo(cx - r * 0.12, cy + r * 0.85);
    ctx.lineTo(cx + r * 0.5, cy - r * 0.1);
    ctx.lineTo(cx + r * 0.05, cy - r * 0.1);
    ctx.closePath();
    ctx.fill();
  } else if (type === 'trophy') {
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.45, cy - r * 0.8);
    ctx.lineTo(cx - r * 0.45, cy - r * 0.05);
    ctx.quadraticCurveTo(cx - r * 0.45, cy + r * 0.35, cx, cy + r * 0.35);
    ctx.quadraticCurveTo(cx + r * 0.45, cy + r * 0.35, cx + r * 0.45, cy - r * 0.05);
    ctx.lineTo(cx + r * 0.45, cy - r * 0.8);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath(); ctx.arc(cx - r * 0.6, cy - r * 0.45, r * 0.22, Math.PI * 0.25, Math.PI * 1.4); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + r * 0.6, cy - r * 0.45, r * 0.22, Math.PI * 1.6, Math.PI * 0.75); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy + r * 0.35); ctx.lineTo(cx, cy + r * 0.55); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - r * 0.28, cy + r * 0.8); ctx.lineTo(cx + r * 0.28, cy + r * 0.8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy + r * 0.55); ctx.lineTo(cx, cy + r * 0.8); ctx.stroke();
  }
  ctx.restore();
}

function drawFooter(ctx, footerY) {
  ctx.textAlign = 'center';
  ctx.font = '22px ' + FONT;
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('多角人才 × 工程師真心話研究所', 540, footerY);
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

function measureWrappedLines(ctx, text, maxWidth) {
  var chars = text.split('');
  var lines = 1;
  var line = '';
  chars.forEach(function (char) {
    var testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
      lines += 1;
      line = char;
    } else {
      line = testLine;
    }
  });
  return lines;
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
