const write__btn = document.getElementById('write__btn');
const write = document.getElementById('write');
let textarea;

let secret__btn;
const secret = document.getElementById('secret');
let submit_btn;
let canvas;
let text;
let secretWordIndex;
let dataURL;

const secrets = document.getElementById('secrets');
let secret_imgs = localStorage.getItem('secret_imgs');
if (secret_imgs) {
  try {
    secret_imgs = JSON.parse(secret_imgs);
    for (let secret_img of secret_imgs) {
      let image = new Image();
      image.src = secret_img.src;
      image.style = secret_img.style;
      image.classList.add('secret_img');
      secrets.appendChild(image);
    }
  } catch {
    secret_imgs = [];
  }
} else {
  secret_imgs = [];
}

let clear__btn = document.getElementById('clear__btn');;
clear__btn.addEventListener('click', () => {
  secrets.innerHTML = '';
  secret_imgs = [];
  localStorage.clear();
});

const f = new FontFace('Flow Circular', 'url(/fonts/flow-circular.woff)');
f.load().then(() => write__btn.addEventListener('click', startWriting));

function startWriting() {
  if (write.children.length === 0) {
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
}

function makeSecret() {
  if (secret.children.length === 0) {
    text = textarea.value;

    $(textarea).fadeOut(500, () => textarea.remove());
    $(secret__btn).fadeOut(500, () => secret__btn.remove());

    canvas = document.createElement('canvas');
    canvas.classList.add('canvas');
    canvas.width = 350;
    canvas.height = 500;
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

    secretWordIndex = 0;
    requestAnimationFrame(draw);
  }
}

function draw() {
  let ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const lineHeight = 28;
  const padding = 5;

  let now = new Date();
  let now_str = now.getDate().toString().padStart(2, '0') + '/' +
    now.getMonth().toString().padStart(2, '0') + ' ' +
    now.getHours().toString().padStart(2, '0') + ':' +
    now.getMinutes().toString().padStart(2, '0');
  ctx.font = '16px serif';
  ctx.fillText(now_str, padding, 0);

  ctx.font = '24px "Flow Circular"';
  let spaceWidth = ctx.measureText(' ').width;

  let x = padding;
  let y = lineHeight;
  let wordIndex = 0;
  let lines = text.split('\n');
  for (let line of lines) {
    let words = line.split(' ');
    for (let word of words) {
      if (wordIndex <= secretWordIndex) {
        ctx.font = '24px "Flow Circular"';
      } else {
        ctx.font = '24px serif';
      }
      let wordWidth = ctx.measureText(word).width;
      if (x + wordWidth + spaceWidth > canvas.width - padding) {
        y += lineHeight;
        x = padding;
      }
      ctx.fillText(word, x, y);
      x += wordWidth + spaceWidth;
      wordIndex += 1;
    }
  }

  if (secretWordIndex < wordIndex) {
    secretWordIndex += 1;
    requestAnimationFrame(draw);
  } else {
    let cropCanvas = document.createElement('canvas');
    cropCanvas.width = canvas.width;
    cropCanvas.height = y + lineHeight;
    let cropCtx = cropCanvas.getContext('2d');
    cropCtx.drawImage(canvas, 0, 0);
    dataURL = cropCanvas.toDataURL();
  }
}

function submitSecret() {
  $(canvas).fadeOut(500, () => canvas.remove());
  $(submit_btn).fadeOut(500, () => submit_btn.remove());

  let image = new Image();
  image.src = dataURL;
  image.classList.add('secret_img');
  let scale = Math.random() * 0.5 + 0.25;
  let scaledWidth = Math.floor(canvas.width * scale);
  let scaledHeight = Math.floor(canvas.height * scale);
  let style = `width: ${scaledWidth}px; ` +
    `top: ${Math.floor(Math.random() * (window.innerHeight - scaledHeight) + scaledHeight)}px; ` +
    `left: ${Math.floor(Math.random() * (window.innerWidth - scaledWidth) + scaledWidth)}px;`;
  image.style = style;
  secrets.appendChild(image);
  secret_imgs.push({
    src: image.src,
    style: style
  });
  localStorage.setItem('secret_imgs', JSON.stringify(secret_imgs));
  
  $(image).hide();
  $(image).fadeIn(500);
}