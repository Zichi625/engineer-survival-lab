export function exportResultCardImage(data) {
  var canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1600;
  var ctx = canvas.getContext('2d');

  drawBackground(ctx, canvas);
  drawHeading(ctx, data);
  drawStats(ctx, data);
  drawFooter(ctx);

  return Promise.resolve(canvas);
}

export function shareOrDownloadImage(canvas) {
  canvas.toBlob(function (blob) {
    if (!blob) return;
    var file = new File([blob], 'engineer-survival-card.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: '我的工程師生存卡' }).catch(function () {
        downloadBlob(blob);
      });
    } else {
      downloadBlob(blob);
    }
  }, 'image/png');
}

function drawBackground(ctx, canvas) {
  var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#FFF8F0');
  gradient.addColorStop(1, '#FFE9A8');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawHeading(ctx, data) {
  ctx.fillStyle = '#4A3F35';
  ctx.textAlign = 'center';
  ctx.font = '48px "PingFang TC", "Noto Sans TC", sans-serif';
  ctx.fillText('你的工程師生存類型', 540, 220);
  ctx.font = 'bold 72px "PingFang TC", "Noto Sans TC", sans-serif';
  ctx.fillText(data.persona.emoji + ' ' + data.persona.name, 540, 340);
  ctx.font = '44px "PingFang TC", "Noto Sans TC", sans-serif';
  ctx.fillText('生存指數 ' + data.survivalIndex + '%', 540, 420);
}

function drawStats(ctx, data) {
  var rows = [
    ['💰 薪資滿意度', data.dimensions.salary],
    ['❤️ 工作穩定度', data.dimensions.stability],
    ['🤖 AI 適應度', data.dimensions.aiAdapt],
    ['🚀 轉職雷達', data.dimensions.radar]
  ];
  var startY = 560;

  ctx.font = '36px "PingFang TC", "Noto Sans TC", sans-serif';
  rows.forEach(function (row, index) {
    var y = startY + index * 80;
    ctx.textAlign = 'left';
    ctx.fillText(row[0], 140, y);
    ctx.textAlign = 'right';
    ctx.fillText('★'.repeat(row[1]) + '☆'.repeat(5 - row[1]), 940, y);
  });

  ctx.textAlign = 'left';
  ctx.font = '32px "PingFang TC", "Noto Sans TC", sans-serif';
  var textY = startY + rows.length * 80 + 60;
  textY = wrapText(ctx, data.persona.statusText, 140, textY, 800, 46);
  ctx.fillText('你的 Career Bug：' + data.careerBugLabel, 140, textY + 60);
  ctx.fillText('AI Buff：' + data.aiBuffLabel, 140, textY + 120);
  ctx.fillText('🏆 2027 想解鎖：' + data.goalLabel, 140, textY + 180);
}

function drawFooter(ctx) {
  ctx.textAlign = 'center';
  ctx.font = '28px "PingFang TC", "Noto Sans TC", sans-serif';
  ctx.fillStyle = '#8A7B6C';
  ctx.fillText('多角人才 × 工程師真心話研究所', 540, 1520);
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
