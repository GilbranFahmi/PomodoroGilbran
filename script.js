let timer;
let isRunning = false;
let totalSeconds;
let remainingSeconds = null;

const timerDisplay = document.getElementById('timer');
const minutesInput = document.getElementById('minutesInput');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const alarmSound = document.getElementById('alarmSound');

const musicTracks = [
  document.getElementById('song1'),
  document.getElementById('song2'),
  document.getElementById('song3')
];

let currentMusic = null;

function updateDisplay(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');
  timerDisplay.textContent = `${min}:${sec}`;
}

function playRandomMusic() {
  // Stop lagu lama jika ada
  if (currentMusic) {
    currentMusic.pause();
    currentMusic.currentTime = 0;
    currentMusic = null;
  }

  const randomIndex = Math.floor(Math.random() * musicTracks.length);
  currentMusic = musicTracks[randomIndex];
  currentMusic.loop = false;

  currentMusic.play().catch(e => {
    console.warn("Autoplay blocked:", e);
  });

  currentMusic.onended = () => {
    if (isRunning) {
      playRandomMusic();
    }
  };
}

function stopMusic() {
  if (currentMusic) {
    currentMusic.pause();
    currentMusic.currentTime = 0;
    currentMusic = null;
  }
}

function startTimer() {
  if (isRunning) return;

  // Kalau timer belum pernah jalan, ambil dari input
  if (remainingSeconds === null) {
    const inputMinutes = parseInt(minutesInput.value);
    if (isNaN(inputMinutes) || inputMinutes <= 0) return;

    totalSeconds = inputMinutes * 60;
    remainingSeconds = totalSeconds;
  }

  isRunning = true;
  startBtn.disabled = true;
  stopBtn.disabled = false;
  minutesInput.disabled = true;

  updateDisplay(remainingSeconds);

  if (!currentMusic) {
    playRandomMusic();
  }

  timer = setInterval(() => {
    if (remainingSeconds <= 0) {
      clearInterval(timer);
      isRunning = false;
      startBtn.disabled = false;
      stopBtn.disabled = true;
      minutesInput.disabled = false;

      stopMusic();

      setTimeout(() => {
        alarmSound.play();
      }, 300);

      remainingSeconds = null; // reset biar bisa ambil input baru
      return;
    }

    remainingSeconds--;
    updateDisplay(remainingSeconds);
  }, 1000);
}

function stopTimer() {
  if (!isRunning) return;
  clearInterval(timer);
  isRunning = false;
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

function resetTimer() {
  stopTimer();
  alarmSound.pause();
  alarmSound.currentTime = 0;

  stopMusic();

  remainingSeconds = null;

  const inputMinutes = parseInt(minutesInput.value) || 25;
  updateDisplay(inputMinutes * 60);
  minutesInput.disabled = false;
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

// Awal tampilan
updateDisplay(parseInt(minutesInput.value) * 60);
