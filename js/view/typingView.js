export const DOM = {
  appWrapper: document.querySelector(".main-container"),
  wpmDisplay: document.querySelector(".wpm-val"),
  accuracyDisplay: document.querySelector(".accuracy-val"),
  timeDisplay: document.querySelector(".time-val"),
  contentContainer: document.querySelector(".content"),
  typingContainer: document.querySelector(".typing-container"),
  startButton: document.querySelector(".typing-button button"),
  resetButton: document.querySelector(".reset-button"),
  mobileDifficulty: document.getElementById("difficulty-select"),
  mobileMode: document.getElementById("mode-select"),
  desktopDifficultyGroup: document.querySelector(
    '.desktop-control[data-type="difficulty"]',
  ),
  desktopModeGroup: document.querySelector(
    '.desktop-control[data-type="mode"]',
  ),
  resultsWpm: document.querySelector(".result-card:nth-child(1) .card-value"),
  resultsAccuracy: document.querySelector(
    ".result-card:nth-child(2) .card-value",
  ),
  resultsCorrectChars: document.querySelector(".chars-correct"),
  resultsIncorrectChars: document.querySelector(".chars-incorrect"),
  goAgainButton: document.querySelector(".action-button"),

  personalBestDisplay: document.querySelector(".score h3 span"),

  resultsHeaderTitle: document.querySelector(".results-container h1"),
  resultsHeaderSubtitle: document.querySelector(".results-container p"),
};

export function renderMetrics(state) {
  DOM.wpmDisplay.textContent = state.metrics.wpm;
  DOM.accuracyDisplay.textContent = `${state.metrics.accuracy}%`;

  const minutes = Math.floor(state.timeLeft / 60);
  const seconds = state.timeLeft % 60;
  DOM.timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function renderTypingContent(state) {
  DOM.contentContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();

  state.characters.forEach((charObj, index) => {
    const span = document.createElement("span");
    span.textContent = charObj.char;

    const classList = [];
    if (charObj.status !== "pending") classList.push(charObj.status);
    if (index === state.currentIndex) classList.push("active-cursor");

    if (classList.length > 0) span.className = classList.join(" ");
    fragment.appendChild(span);
  });

  DOM.contentContainer.appendChild(fragment);

  const activeSpan = DOM.contentContainer.querySelector(".active-cursor");
  if (activeSpan) {
    activeSpan.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }
}

export function renderContainerState(state) {
  if (state.isTestActive) {
    DOM.typingContainer.classList.remove("not-started");
  } else {
    DOM.typingContainer.classList.add("not-started");
  }
}

export function renderResults(state) {
  DOM.resultsWpm.textContent = state.metrics.wpm;
  DOM.resultsAccuracy.textContent = `${state.metrics.accuracy}%`;
  DOM.resultsCorrectChars.textContent = state.metrics.correctCharsCount;
  DOM.resultsIncorrectChars.textContent = state.metrics.incorrectCharsCount;

  if (state.runOutcome === "baseline") {
    DOM.resultsHeaderTitle.textContent = "Baseline Established!";
    DOM.resultsHeaderSubtitle.textContent =
      "Great start! You've set your initial score milestone.";
  } else if (state.runOutcome === "new-best") {
    DOM.resultsHeaderTitle.textContent = "High Score Smashed!";
    DOM.resultsHeaderSubtitle.textContent = `Amazing work! You raised your personal best to ${state.personalBest} WPM.`;
  } else {
    DOM.resultsHeaderTitle.textContent = "Test Complete!";
    DOM.resultsHeaderSubtitle.textContent =
      "Solid run. Keep pushing to beat your high score.";
  }
}

export function syncControlsUI(state) {
  DOM.mobileDifficulty.value =
    state.currentDifficulty.charAt(0).toUpperCase() +
    state.currentDifficulty.slice(1);
  DOM.mobileMode.value = state.currentMode;

  Array.from(DOM.desktopDifficultyGroup.children).forEach((btn) => {
    if (btn.textContent.trim().toLowerCase() === state.currentDifficulty) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  Array.from(DOM.desktopModeGroup.children).forEach((btn) => {
    const text = btn.textContent.trim();
    const cleanValue = text.includes("Timed") ? "timed60s" : "passage";
    if (cleanValue === state.currentMode) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

export function renderApp(state) {
  renderMetrics(state);
  renderTypingContent(state);
  renderContainerState(state);
  syncControlsUI(state);

  DOM.personalBestDisplay.textContent = `${state.personalBest} WPM`;

  if (state.isTestComplete) {
    renderResults(state);
    DOM.appWrapper.classList.add("results-visible");
  } else {
    DOM.appWrapper.classList.remove("results-visible");
  }
}
