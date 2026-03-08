const phrases = [
  'Tu fuerza inspira con una elegancia que deja huella.',
  'Tu forma de seguir adelante habla por ti.',
  'Hay mujeres que iluminan sin hacer ruido, y tú eres una de ellas.',
  'Tu presencia transmite valor, firmeza y mucha luz.',
  'Seguir con calma también es una forma de grandeza.',
  'Tu esencia tiene carácter, clase y autenticidad.',
  'Tu manera de avanzar inspira más de lo que imaginas.',
  'Donde estás, se nota tu fuerza y tu estilo.',
  'Tienes una energía serena que siempre resalta.',
  'Tu brillo nace de lo que eres y de todo lo que has superado.',
  'Hay belleza en tu fortaleza y verdad en tu forma de ser.',
  'Tu actitud demuestra que la fuerza también puede ser elegante.',
  'Tu presencia deja una impresión bonita y poderosa.',
  'En ti se nota la firmeza de una mujer admirable.',
  'Tienes una luz propia que inspira con naturalidad.',
  'Tu valor se nota incluso en los silencios.',
  'Tu seguridad y tu esencia hacen que todo se vea mejor.',
  'Lo que transmites es fuerza, autenticidad y mucha clase.'
];

const styles = [
  {
    cssStyle: 'style-1',
    font: 'font-1',
    theme: ['#20102B', '#7A325E', '#F1C98F', '#FFF7F0']
  },
  {
    cssStyle: 'style-2',
    font: 'font-2',
    theme: ['#132230', '#235D73', '#F4D3A1', '#F4FCFF']
  },
  {
    cssStyle: 'style-3',
    font: 'font-3',
    theme: ['#261722', '#8B3B60', '#F0C899', '#FFF8F3']
  },
  {
    cssStyle: 'style-4',
    font: 'font-4',
    theme: ['#1A1837', '#4C52AE', '#F4D69F', '#F5F6FF']
  },
  {
    cssStyle: 'style-5',
    font: 'font-5',
    theme: ['#142123', '#2B6663', '#ECCA91', '#F5FFFC']
  }
];

const introCard = document.getElementById('introCard');
const revealPanel = document.getElementById('revealPanel');
const cardStage = document.getElementById('cardStage');
const cardPreview = document.getElementById('cardPreview');
const cardMessage = document.getElementById('cardMessage');
const downloadBtn = document.getElementById('downloadBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const roseOverlay = document.getElementById('roseOverlay');

const INTRO_DURATION = 1350;
const WHATSAPP_NUMBER = '51927137867';
const WHATSAPP_TEXT = 'Hola, vi la tarjeta y quiero una versión especial ✨';

let lastPhraseIndex = -1;
let lastStyleIndex = -1;
let currentState = null;
let shuffleCount = 0;
let roseTriggered = false;

function randomIndex(length, previous) {
  if (length <= 1) return 0;
  let next = Math.floor(Math.random() * length);
  while (next === previous) next = Math.floor(Math.random() * length);
  return next;
}

function hexToRgba(hex, alpha) {
  const value = hex.replace('#', '');
  const bigint = parseInt(value, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildState() {
  const phraseIndex = randomIndex(phrases.length, lastPhraseIndex);
  const styleIndex = randomIndex(styles.length, lastStyleIndex);
  lastPhraseIndex = phraseIndex;
  lastStyleIndex = styleIndex;
  return {
    phrase: phrases[phraseIndex],
    style: styles[styleIndex]
  };
}

function applyState(state) {
  currentState = state;
  const { phrase, style } = state;
  const [dark, accent, soft, light] = style.theme;

  cardMessage.textContent = phrase;
  document.documentElement.style.setProperty('--bg-2', dark);
  document.documentElement.style.setProperty('--bg-3', accent);
  document.documentElement.style.setProperty('--bg-4', soft);
  document.documentElement.style.setProperty('--card-dark', dark);
  document.documentElement.style.setProperty('--card-accent', accent);
  document.documentElement.style.setProperty('--card-soft', soft);
  document.documentElement.style.setProperty('--card-light', light);

  cardPreview.className = `card-preview ${style.cssStyle} ${style.font}`;
  cardPreview.style.background = `
    radial-gradient(circle at 18% 14%, rgba(255,255,255,0.44), transparent 22%),
    radial-gradient(circle at 82% 18%, ${hexToRgba(soft, 0.24)}, transparent 20%),
    radial-gradient(circle at 26% 82%, rgba(255,255,255,0.10), transparent 22%),
    linear-gradient(155deg, ${hexToRgba(accent, 0.85)}, ${hexToRgba(dark, 0.97)})
  `;
  cardPreview.style.boxShadow = `0 42px 120px ${hexToRgba(dark, 0.38)}`;
}

function switchCard() {
  cardPreview.classList.add('switching');
  setTimeout(() => {
    applyState(buildState());
    requestAnimationFrame(() => cardPreview.classList.remove('switching'));
  }, 180);
}

function revealAfterIntro() {
  setTimeout(() => {
    introCard.classList.add('intro-exit');
    setTimeout(() => {
      introCard.classList.add('hidden');
      revealPanel.classList.remove('hidden');
    }, 320);
  }, INTRO_DURATION);
}

function attachTilt() {
  if (window.matchMedia('(max-width: 900px)').matches) return;

  cardStage.addEventListener('mousemove', (event) => {
    const rect = cardStage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 8;
    const rotateX = (0.5 - y) * 7;
    cardPreview.style.transform = `perspective(1600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  cardStage.addEventListener('mouseleave', () => {
    cardPreview.style.transform = 'perspective(1600px) rotateX(3deg) rotateY(-3deg)';
  });
}

async function downloadCurrentCard() {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  const target = cardStage;
  const canvas = await html2canvas(target, {
    backgroundColor: null,
    scale: 2,
    useCORS: true
  });

  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `tarjeta-yeny-dia-de-la-mujer-${Date.now()}.png`;
  link.click();
}

function showRoseAndOpenWhatsapp() {
  if (roseTriggered) return;
  roseTriggered = true;
  roseOverlay.classList.add('show');

  setTimeout(() => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;
    window.open(url, '_blank');
  }, 820);

  setTimeout(() => {
    roseOverlay.classList.remove('show');
    roseTriggered = false;
  }, 2000);
}

shuffleBtn.addEventListener('click', () => {
  shuffleCount += 1;
  switchCard();
  if (shuffleCount > 3) {
    showRoseAndOpenWhatsapp();
    shuffleCount = 0;
  }
});

downloadBtn.addEventListener('click', downloadCurrentCard);

applyState(buildState());
revealAfterIntro();
attachTilt();
