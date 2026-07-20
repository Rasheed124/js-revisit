import * as Model from "../model/typingModel.js";
import * as View from "../view/typingView.js";

function startTimer() {
  if (Model.state.timerIntervalId) return;

  Model.state.timerIntervalId = setInterval(() => {
    if (Model.state.timeLeft > 0) {
      Model.state.timeLeft--;
      Model.calculateLiveMetrics();
      View.renderApp(Model.state);
    } else {
      completeTest();
    }
  }, 1000);
}

function startTest() {
  if (Model.state.isTestActive) return;
  Model.state.isTestActive = true;
  startTimer();
  View.renderApp(Model.state);
}

function resetTest() {
  Model.resetState();
  View.renderApp(Model.state);
}

function completeTest() {
  Model.clearTimer();
  Model.state.isTestActive = false;
  Model.state.isTestComplete = true;

  
  Model.checkForNewPersonalBest();

  View.renderApp(Model.state);
}

function updateDifficulty(newDifficulty) {
  Model.state.currentDifficulty = newDifficulty.toLowerCase();
  Model.savePreferences();
  resetTest();
}

function updateMode(newMode) {
  Model.state.currentMode = newMode;
  Model.savePreferences();
  resetTest();
}

function handleTyping(pressedKey) {
  if (!Model.state.isTestActive || Model.state.isTestComplete) return;

  if (pressedKey === "Backspace") {
    if (Model.state.currentIndex > 0) {
      Model.state.currentIndex--;
      Model.state.characters[Model.state.currentIndex].status = "pending";
    }
    Model.calculateLiveMetrics();
    View.renderApp(Model.state);
    return;
  }

  if (pressedKey.length !== 1) return;

  const currentExpectedChar =
    Model.state.characters[Model.state.currentIndex].char;
  if (pressedKey === currentExpectedChar) {
    Model.state.characters[Model.state.currentIndex].status = "correct";
  } else {
    Model.state.characters[Model.state.currentIndex].status = "incorrect";
  }

  if (Model.state.currentIndex < Model.state.characters.length - 1) {
    Model.state.currentIndex++;
    Model.calculateLiveMetrics();
    View.renderApp(Model.state);
  } else {
    Model.calculateLiveMetrics();
    completeTest();
  }
}

export function setupEventListeners() {
  View.DOM.startButton.addEventListener("click", startTest);

  window.addEventListener("keydown", (event) => {
    if (event.key.length > 1 && event.key !== "Backspace") return;
    if (!Model.state.isTestActive && !Model.state.isTestComplete) {
      startTest();
    }
    handleTyping(event.key);
  });

  View.DOM.resetButton.addEventListener("click", resetTest);
  View.DOM.goAgainButton.addEventListener("click", resetTest);

  View.DOM.mobileDifficulty.addEventListener("change", (e) =>
    updateDifficulty(e.target.value),
  );
  View.DOM.mobileMode.addEventListener("change", (e) =>
    updateMode(e.target.value),
  );

  View.DOM.desktopDifficultyGroup.addEventListener("click", (e) => {
    const btn = e.target.closest(".control-btn");
    if (btn) updateDifficulty(btn.textContent.trim());
  });

  View.DOM.desktopModeGroup.addEventListener("click", (e) => {
    const btn = e.target.closest(".control-btn");
    if (!btn) return;
    const modeValue = btn.textContent.trim().includes("Timed")
      ? "timed60s"
      : "passage";
    updateMode(modeValue);
  });
}

export function initApp() {
  Model.initializeTextData();
  setupEventListeners();
  View.renderApp(Model.state);
}
