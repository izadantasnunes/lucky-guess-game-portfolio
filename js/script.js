const guessInput = document.getElementById('guessInput');
const guessBtn = document.getElementById('guessBtn');
const restartBtn = document.getElementById('restartBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const message = document.getElementById('message');
const attemptsLeftEl = document.getElementById('attemptsLeft');
const lastGuessEl = document.getElementById('lastGuess');
const statusText = document.getElementById('statusText');
const guessLog = document.getElementById('guessLog');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const livesContainer = document.getElementById('livesContainer');
const coreDisplay = document.getElementById('coreDisplay');
const gameCard = document.getElementById('gameCard');

const resultModal = document.getElementById('resultModal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const modalBadge = document.getElementById('modalBadge');
const confetti = document.getElementById('confetti');

const maxAttempts = 10;
let secretNumber;
let attempts;
let gameOver;
let guesses;

function generateSecretNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function startGame() {
  secretNumber = generateSecretNumber();
  attempts = maxAttempts;
  gameOver = false;
  guesses = [];

  attemptsLeftEl.textContent = attempts;
  lastGuessEl.textContent = '--';
  statusText.textContent = 'Em jogo';
  message.textContent = 'Digite um número entre 1 e 100 e tente encontrar o número secreto.';
  message.className = '';
  guessLog.innerHTML = '';
  guessInput.value = '';
  guessInput.disabled = false;
  guessBtn.disabled = false;
  updateLives();
  updateProgress();
  coreDisplay.textContent = '?';
  closeModal();
}

function updateLives() {
  const lives = [...livesContainer.children];
  lives.forEach((life, index) => {
    if (index < attempts) {
      life.classList.remove('lost');
    } else {
      life.classList.add('lost');
    }
  });
}

function updateProgress() {
  const percentage = Math.max((attempts / maxAttempts) * 100, 0);
  progressFill.style.width = percentage + '%';
  progressText.textContent = percentage + '%';
}

function addGuessChip(value) {
  const chip = document.createElement('div');
  chip.className = 'guess-chip';
  chip.textContent = value;
  guessLog.appendChild(chip);
}

function openModal(type, title, text) {
  resultModal.classList.add('show', type);
  modalTitle.textContent = title;
  modalText.textContent = text;
  modalBadge.textContent = type === 'win' ? 'Vitória desbloqueada' : 'Fim da rodada';

  if (type === 'win') {
    createGoldenConfetti();
  } else {
    confetti.innerHTML = '';
  }
}

function closeModal() {
  resultModal.classList.remove('show', 'win', 'lose');
  confetti.innerHTML = '';
}

function createGoldenConfetti() {
  confetti.innerHTML = '';
  for (let i = 0; i < 34; i++) {
    const spark = document.createElement('span');
    spark.className = 'spark';
    spark.style.left = Math.random() * 100 + '%';
    spark.style.animationDelay = (Math.random() * 0.7) + 's';
    spark.style.transform = `translateY(-40px) rotate(${Math.random() * 360}deg)`;
    spark.style.height = 12 + Math.random() * 20 + 'px';
    spark.style.width = 5 + Math.random() * 6 + 'px';
    confetti.appendChild(spark);
  }
}

function endGame(win) {
  gameOver = true;
  guessInput.disabled = true;
  guessBtn.disabled = true;
  statusText.textContent = win ? 'Vitória' : 'Derrota';
  coreDisplay.textContent = secretNumber;

  if (win) {
    openModal('win', 'Parabéns!', `Você acertou o número secreto ${secretNumber} e fechou a rodada com estilo.`);
  } else {
    openModal('lose', 'Não foi dessa vez', `O número secreto era ${secretNumber}. Respira, reinicia e tenta a próxima.`);
  }
}

function handleGuess() {
  if (gameOver) return;

  const value = Number(guessInput.value);

  if (!value || value < 1 || value > 100) {
    message.textContent = 'Digite um número válido entre 1 e 100.';
    message.className = 'hint-error';
    gameCard.classList.add('shake');
    setTimeout(() => gameCard.classList.remove('shake'), 350);
    return;
  }

  guesses.push(value);
  addGuessChip(value);
  lastGuessEl.textContent = value;

  if (value === secretNumber) {
    message.textContent = 'Acertou em cheio. Número encontrado.';
    message.className = 'hint-up';
    endGame(true);
    return;
  }

  attempts--;
  attemptsLeftEl.textContent = attempts;
  updateLives();
  updateProgress();

  if (value < secretNumber) {
    message.textContent = 'Seu palpite está baixo. Tenta um número maior.';
    message.className = 'hint-up';
  } else {
    message.textContent = 'Seu palpite está alto. Tenta um número menor.';
    message.className = 'hint-down';
  }

  if (attempts === 0) {
    endGame(false);
  }

  guessInput.value = '';
  guessInput.focus();
}

guessBtn.addEventListener('click', handleGuess);
restartBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', startGame);

guessInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleGuess();
  }
});

startGame();
