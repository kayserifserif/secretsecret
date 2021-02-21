// variables

const FADE_MS = 500;
const TRANSITION_MS = 20;

const write = document.getElementById('write');
let textarea;

let secret_btn;
const secret = document.getElementById('secret');
let submit_btn;
let canvas;
let text;
let secretWordIndex;
let dataURL;

const secrets = document.getElementById('secrets');
let secret_imgs = localStorage.getItem('secret_imgs');


// setup

document.addEventListener('DOMContentLoaded', () => {
  // load existing secret images
  try {
    secret_imgs = JSON.parse(secret_imgs);
    secret_imgs.forEach(secret_img => addSecretImg(secret_img));
  } catch {
    secret_imgs = [];
  }

  // clear button
  document.getElementById('clear_btn').addEventListener('click', clearSecrets);

  // font
  const f = new FontFace('Flow Circular', 'url(/fonts/flow-circular.woff)');
  f.load().then(() => document.getElementById('write_btn').addEventListener('click', startWriting));
});


// helpers

/**
 * Fade to opacity 1.
 * @param {HTMLElement} el Element to fade in.
 * @param {Function} fn Callback to execute when faded in.
 */
function fadeIn(el, fn) {
  fade(el, fn, 1);
}

/**
 * Fade to opacity 0.
 * @param {HTMLElement} el Element to fade out.
 * @param {Function} fn Callback to execute when faded out.
 */
function fadeOut(el, fn) {
  fade(el, fn, 0);
}

/**
 * Helper function for fading in or out.
 * @param {HTMLElement} el Element to fade in or out.
 * @param {Function} fn Callback to execute when faded in or out.
 * @param {number} target Opacity to fade to.
 */
function fade(el, fn, target) {
  if (target === 1) {
    el.style.opacity = 0;
  }
  el.style.transition = `${FADE_MS / 1000.0}s opacity`;
  setTimeout(() => {
    el.style.opacity = target;
    if (fn) {
      setTimeout(fn, FADE_MS);
    }
  }, TRANSITION_MS);
}


// functions

/**
 * Add image of secret to background of page.
 * @param {Object} secret_img Object containing image source and style.
 */
function addSecretImg(secret_img) {
  let image = new Image();
  image.src = secret_img.src;
  image.style = secret_img.style;
  image.classList.add('secret_img');
  image.setAttribute('role', 'presentation');
  secrets.appendChild(image);
  fadeIn(image);
}

/**
 * Create textarea and button to write secret.
 */
function startWriting() {
  if (write.children.length === 0) {
    textarea = document.createElement('textarea');
    textarea.cols = '50';
    textarea.rows = '20';

    secret_btn = document.createElement('button');
    secret_btn.type = 'button';
    secret_btn.classList.add('button');
    secret_btn.appendChild(document.createTextNode('shhh'));
    secret_btn.addEventListener('click', makeSecret);

    write.appendChild(textarea);
    write.appendChild(secret_btn);
    
    fadeIn(textarea, () => textarea.focus());
    fadeIn(secret_btn);
  }
}

/**
 * Convert secret text to image.
 */
function makeSecret() {
  if (secret.children.length === 0) {
    text = textarea.value;

    fadeOut(textarea, () => textarea.remove());
    fadeOut(secret_btn, () => secret_btn.remove());

    canvas = document.createElement('canvas');
    canvas.classList.add('canvas');
    canvas.width = 350;
    canvas.height = FADE_MS;
    secret.append(canvas);

    submit_btn = document.createElement('button');
    submit_btn.type = 'button';
    submit_btn.classList.add('button');
    submit_btn.appendChild(document.createTextNode('secretttt'));
    submit_btn.addEventListener('click', submitSecret);
    secret.appendChild(submit_btn);

    fadeIn(canvas);
    fadeIn(submit_btn);

    secretWordIndex = 0;
    requestAnimationFrame(draw);
  }
}

/**
 * Canvas animation of redacting secret text.
 */
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
  ctx.fillText(now_str, 0, 0);

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

/**
 * Adds canvas image to the background of the page.
 */
function submitSecret() {
  fadeOut(canvas, () => canvas.remove());
  fadeOut(submit_btn, () => submit_btn.remove());

  let scale = Math.random() * 0.5 + 0.25;
  let scaledWidth = Math.floor(canvas.width * scale);
  let scaledHeight = Math.floor(canvas.height * scale);
  let secret_img = {
    src: dataURL,
    style: `width: ${scaledWidth}px; ` +
      `top: ${Math.floor(Math.random() * (window.innerHeight - scaledHeight))}px; ` +
      `left: ${Math.floor(Math.random() * (window.innerWidth - scaledWidth))}px;`
  };
  secret_imgs.push(secret_img);
  addSecretImg(secret_img);
  localStorage.setItem('secret_imgs', JSON.stringify(secret_imgs));
}

function clearSecrets() {
  if (secrets.children.length > 0) {
    for (let i = 0; i < secrets.children.length; i++) {
      setTimeout(() => {
        fadeOut(secrets.children[i]);
      }, FADE_MS * i * 0.5);
    }
  }
  setTimeout(() => {
    secrets.innerHTML = '';
    secret_imgs = [];
    localStorage.clear();
  }, FADE_MS * 3 * secrets.children.length);
}