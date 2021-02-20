const write__btn = document.getElementById('write__btn');

const write = document.getElementById('write');
let textarea;
let secret__btn;

const secret = document.getElementById('secret');
let canvas;
let submit_btn;

const secrets = document.getElementById('secrets');

const f = new FontFace('Flow Circular', 'url(/fonts/flow-circular.woff)');
f.load().then(() => write__btn.addEventListener('click', startWriting));

function startWriting() {
  textarea = document.createElement('textarea');
  textarea.cols = '50';
  textarea.rows = '20';

  secret__btn = document.createElement('button');
  secret__btn.type = 'button';
  secret__btn.classList.add('button');
  secret__btn.appendChild(document.createTextNode('secretttt'));
  secret__btn.addEventListener('click', makeSecret);

  write.appendChild(textarea);
  write.appendChild(secret__btn);
  
  $(textarea).hide();
  $(secret__btn).hide();
  $(textarea).fadeIn(500, () => textarea.focus());
  $(secret__btn).fadeIn(500);
}

function makeSecret() {
  let text = textarea.value;

  $(textarea).fadeOut(500, () => textarea.remove());
  $(secret__btn).fadeOut(500, () => secret__btn.remove());

  canvas = document.createElement('canvas');
  canvas.classList.add('canvas');
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
    canvasLines.push(currentLine);
  }

  for (let canvasLine of canvasLines) {
    ctx.fillText(canvasLine, x, y);
    y += lineHeight;
  }

  secret.append(canvas);

  submit_btn = document.createElement('button');
  submit_btn.type = 'button';
  submit_btn.classList.add('button');
  submit_btn.appendChild(document.createTextNode('submit'));
  submit_btn.addEventListener('click', submitSecret);
  secret.appendChild(submit_btn);

  $(canvas).hide();
  $(submit_btn).hide();
  $(canvas).fadeIn(500);
  $(submit_btn).fadeIn(500);
}

function submitSecret() {
  $(canvas).fadeOut(500, () => canvas.remove());
  $(submit_btn).fadeOut(500, () => submit_btn.remove());

  let image = new Image();
  image.src = canvas.toDataURL();
  image.classList.add('secret_img', 'animated', 'hidden');
  $(image).css({
    width: canvas.width * (Math.random() * 0.5 + 0.25),
    top: Math.random() * window.innerHeight + 'px',
    left: Math.random() * window.innerWidth + 'px'
  });
  secrets.appendChild(image);
  
  $(image).hide();
  $(image).fadeIn(500);
}