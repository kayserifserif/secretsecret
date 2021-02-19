const secret = document.getElementById('secret');
const textarea = document.getElementById('secret__textarea');
const secret_btn = document.getElementById('secret__btn');
const secretsecret = document.getElementById('secretsecret');

const f = new FontFace('Flow Circular', 'url(/fonts/flow-circular.woff)');
f.load().then(() => secret_btn.addEventListener('click', makeSecret));

function makeSecret(event) {
  let text = textarea.value;
  secret.classList.add('hidden');

  let canvas = document.createElement('canvas');
  canvas.classList.add('canvas', 'animated', 'hidden');
  canvas.width = 350;
  canvas.height = 450;

  let ctx = canvas.getContext('2d');
  ctx.font = '24px "Flow Circular"';
  ctx.textBaseline = 'top';

  // https://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
  const lineHeight = 28;
  const x = 5;
  let y = 0;
  let lines = text.split('\n');
  let canvasLines = [];
  for (let line of lines) {
    // y += lineHeight;
    let currentLine = '';
    let words = line.split(' ');
    for (let word of words) {
      let testLine = currentLine + word + ' ';
      let metrics = ctx.measureText(testLine);
      if (x + metrics.width > canvas.width) {
        // ctx.fillText(currentLine, x, y);
        canvasLines.push(currentLine);
        currentLine = word + ' ';
        // y += lineHeight;
      } else {
        currentLine = testLine;
      }
    }
  }

  // canvas.height = y += lineHeight;
  // ctx = canvas.getContext('2d');
  // ctx.font = '24px "Flow Circular"';
  // ctx.textBaseline = 'top';
  for (let canvasLine of canvasLines) {
    // y += lineHeight;
    ctx.fillText(canvasLine, x, y);
    y += lineHeight;
  }

  secretsecret.append(canvas);
  setTimeout(() => canvas.classList.remove('hidden'), 100);
}

function submitSecret(event) {

}