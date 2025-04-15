const quoteDisplay = document.getElementById('quote');
const input = document.getElementById('input');
const result = document.getElementById('result');
const startBtn = document.getElementById('startBtn');
const timerDisplay = document.getElementById('timer');
const testsEl = document.getElementById('tests');
const bestWpmEl = document.getElementById('bestWpm');
const themeToggle = document.getElementById('themeToggle');
const langSelect = document.getElementById('langSelect');
const shareBtn = document.getElementById('shareBtn');
const typeSound = document.getElementById('typeSound');
const finishSound = document.getElementById('finishSound');

let timer, timeLeft = 30, quote = "", startTime;

const localQuotes = [
  "The quick brown fox jumps over the lazy dog.",
  "Practice makes perfect.",
  "Typing fast is a skill worth learning.",
  "Stay focused and keep improving.",
  "You miss 100% of the shots you don't take.",
  "Success is not final, failure is not fatal.",
  "Code is like humor. When you have to explain it, it’s bad.",
  "Strive not to be a success, but rather to be of value.",
  "Discipline is the bridge between goals and accomplishment.",
  "Typing is the dance of fingers on a digital stage."
];

async function fetchQuote(lang = "en") {
  try {
    const res = await fetch("https://api.quotable.io/random");
    const data = await res.json();
    quote = data.content;
  } catch (err) {
    console.warn("⚠️ Could not fetch quote from API, using local quote.");
    quote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
  }

  quoteDisplay.innerHTML = quote + ' <span class="cursor">|</span>';
  input.value = "";
  input.disabled = false;
  input.focus();
  result.textContent = "";
  shareBtn.style.display = "none";
  timerDisplay.textContent = `⏳ ${timeLeft}s`;
}

function startCountdown() {
  clearInterval(timer);
  timeLeft = 30;
  startTime = Date.now();
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `⏳ ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endTest();
    }
  }, 1000);
}

function endTest() {
  input.disabled = true;
  finishSound.play();
  const timeTaken = (Date.now() - startTime) / 1000;
  const wordsTyped = input.value.trim().split(/\s+/).length;
  const wpm = Math.round((wordsTyped / timeTaken) * 60);

  result.textContent = `⏰ Time's up! You typed ${wordsTyped} words in ${timeTaken.toFixed(2)}s — WPM: ${wpm}`;
  shareBtn.style.display = "inline-block";
  shareBtn.onclick = () => {
    navigator.clipboard.writeText(result.textContent);
    shareBtn.textContent = "✅ Copied!";
    setTimeout(() => (shareBtn.textContent = "📋 Copy Result"), 2000);
  };
  updateStats(wpm);
}

function updateStats(wpm) {
  let best = localStorage.getItem("bestWpm") || 0;
  let tests = localStorage.getItem("tests") || 0;

  tests = parseInt(tests) + 1;
  if (wpm > best) {
    best = wpm;
    localStorage.setItem("bestWpm", best);
  }

  localStorage.setItem("tests", tests);
  testsEl.textContent = tests;
  bestWpmEl.textContent = best;
}

function loadStats() {
  testsEl.textContent = localStorage.getItem("tests") || 0;
  bestWpmEl.textContent = localStorage.getItem("bestWpm") || 0;
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem("theme", document.body.classList.contains('dark') ? "dark" : "light");
}

function loadTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") document.body.classList.add("dark");
}

startBtn.onclick = () => {
  const lang = langSelect.value; // reserved for future multilingual support
  fetchQuote(lang);
  startCountdown();
};

input.addEventListener('input', () => {
  typeSound.currentTime = 0;
  typeSound.play();

  if (input.value.trim() === quote) {
    clearInterval(timer);
    const timeTaken = (Date.now() - startTime) / 1000;
    const wordCount = quote.split(/\s+/).length;
    const wpm = Math.round((wordCount / timeTaken) * 60);
    result.textContent = `🎉 Perfect! ${wordCount} words in ${timeTaken.toFixed(2)}s — WPM: ${wpm}`;
    input.disabled = true;
    finishSound.play();
    shareBtn.style.display = "inline-block";
    shareBtn.onclick = () => {
      navigator.clipboard.writeText(result.textContent);
      shareBtn.textContent = "✅ Copied!";
      setTimeout(() => (shareBtn.textContent = "📋 Copy Result"), 2000);
    };
    updateStats(wpm);
  }
});

themeToggle.onclick = toggleTheme;
langSelect.onchange = () => {
  if (!input.disabled) startBtn.click(); // refresh quote if mid-test
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
  }  
};

loadStats();
loadTheme();
