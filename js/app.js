import { passagesData } from "./data.js";

const state = {
  currentDifficulty: "hard",
  currentMode: "timed60s",
  isTestActive: false,
  isTestComplete: false,
  currentTextString: "",
  characters: [],
  currentIndex: 0,
  timeLeft: 60,
  timerIntervalId: null,
  metrics: {
    wpm: 0,
    accuracy: 100,
    correctCharsCount: 0,
    incorrectCharsCount: 0,
    totalTypedCount: 0,
  },
};

const DOM = {
  wpmDisplay: document.querySelector(".wpm-val"),
  accuracyDisplay: document.querySelector(".accuracy-val"),
  timeDisplay: document.querySelector(".time-val"),
  contentContainer: document.querySelector(".content"),
  typingContainer: document.querySelector(".typing-container"),
  startButton: document.querySelector(".typing-button button"),
};

function selectRandomPassage(difficulty) {
  const passages = passagesData[difficulty];
  const randomIndex = Math.floor(Math.random() * passages.length);

  return passages[randomIndex].text;
}

function initializeTextData() {
  state.currentTextString = selectRandomPassage(state.currentDifficulty);
  state.currentIndex = 0;

  state.characters = state.currentTextString.split("").map((char) => ({
    char,
    status: "pending",
  }));
}

function renderMetrics() {
  DOM.wpmDisplay.textContent = state.metrics.wpm;
  DOM.accuracyDisplay.textContent = `${state.metrics.accuracy}%`;

  const minutes = Math.floor(state.timeLeft / 60);
  const seconds = state.timeLeft % 60;

  DOM.timeDisplay.textContent = `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function renderTypingContent() {
  DOM.contentContainer.innerHTML = "";

  const fragment = document.createDocumentFragment();

  state.characters.forEach((charObj, index) => {
    const span = document.createElement("span");

    span.textContent = charObj.char;

    const classList = [];

    if (charObj.status !== "pending") {
      classList.push(charObj.status);
    }

    // Highlight the current typing position.
    if (index === state.currentIndex) {
      classList.push("active-cursor");
    }

    if (classList.length > 0) {
      span.className = classList.join(" ");
    }

    fragment.appendChild(span);
  });

  DOM.contentContainer.appendChild(fragment);
}

function renderContainerState() {
  if (state.isTestActive) {
    DOM.typingContainer.classList.remove("not-started");
  } else {
    DOM.typingContainer.classList.add("not-started");
  }
}

function startTest() {
  if (state.isTestActive) {
    return;
  }

  state.isTestActive = true;
  startTimer();

  renderApp();
}

function calculateLiveMetrics() {
  let correct = 0;
  let incorrect = 0;

  state.characters.forEach((charObj) => {
    if (charObj.status === "correct") correct++;
    if (charObj.status === "incorrect") incorrect++;
  });

  state.metrics.correctCharsCount = correct;
  state.metrics.incorrectCharsCount = incorrect;
  state.metrics.totalTypedCount = correct + incorrect;

  // Accuracy = Correct characters / Total typed characters.
  if (state.metrics.totalTypedCount > 0) {
    state.metrics.accuracy = Math.round(
      (correct / state.metrics.totalTypedCount) * 100,
    );
  } else {
    state.metrics.accuracy = 100;
  }

  // Standard WPM = (Correct characters / 5) / Minutes elapsed.
  const timeSpentSeconds = 60 - state.timeLeft;

  if (timeSpentSeconds > 0) {
    const timeSpentMinutes = timeSpentSeconds / 60;
    const standardWordsTyped = correct / 5;

    state.metrics.wpm = Math.round(standardWordsTyped / timeSpentMinutes);
  } else {
    state.metrics.wpm = 0;
  }
}

function startTimer() {
  // Prevent multiple timer intervals.
  if (state.timerIntervalId) return;

  state.timerIntervalId = setInterval(() => {
    if (state.timeLeft > 0) {
      state.timeLeft--;

      calculateLiveMetrics();
      renderApp();
    } else {
      clearInterval(state.timerIntervalId);

      state.timerIntervalId = null;
      state.isTestActive = false;
      state.isTestComplete = true;

      alert("Time is up! Test complete.");
      renderApp();
    }
  }, 1000);
}

function handleTyping(pressedKey) {
  if (!state.isTestActive || state.isTestComplete) return;

  if (pressedKey === "Backspace") {
    if (state.currentIndex > 0) {
      state.currentIndex--;
      state.characters[state.currentIndex].status = "pending";
    }

    calculateLiveMetrics();
    renderApp();

    return;
  }

  if (pressedKey.length !== 1) return;

  const currentExpectedChar = state.characters[state.currentIndex].char;

  if (pressedKey === currentExpectedChar) {
    state.characters[state.currentIndex].status = "correct";
  } else {
    state.characters[state.currentIndex].status = "incorrect";
  }

  if (state.currentIndex < state.characters.length - 1) {
    state.currentIndex++;
  } else {
    // End the test once the entire passage has been typed.
    clearInterval(state.timerIntervalId);

    state.timerIntervalId = null;
    state.isTestActive = false;
    state.isTestComplete = true;
  }

  calculateLiveMetrics();
  renderApp();
}

function setupEventListeners() {
  DOM.startButton.addEventListener("click", startTest);

  window.addEventListener("keydown", (event) => {
    console.log(event.key);

    // Ignore modifier and control keys.
    if (event.key.length > 1 && event.key !== "Backspace") {
      return;
    }

    // Automatically start the test on the first valid keystroke.
    if (!state.isTestActive && !state.isTestComplete) {
      startTest();
    }

    handleTyping(event.key);
  });
}

function renderApp() {
  renderMetrics();
  renderTypingContent();
  renderContainerState();
}

function init() {
  initializeTextData();
  setupEventListeners();
  renderApp();
}

init();