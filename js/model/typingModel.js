import { passagesData } from "../../data/data.js";

export const state = {
  currentDifficulty: localStorage.getItem("typing_difficulty") || "hard",
  currentMode: localStorage.getItem("typing_mode") || "timed60s",

  isTestActive: false,
  isTestComplete: false,
  currentTextString: "",
  characters: [],
  currentIndex: 0,
  timeLeft: 60,
  timerIntervalId: null,

  isFirstTestEver: !localStorage.getItem("typing_personal_best"),
  personalBest: parseInt(localStorage.getItem("typing_personal_best")) || 0,

  runOutcome: "normal", 

  metrics: {
    wpm: 0,
    accuracy: 100,
    correctCharsCount: 0,
    incorrectCharsCount: 0,
    totalTypedCount: 0,
  },
};




export function savePreferences() {
  localStorage.setItem("typing_difficulty", state.currentDifficulty);
  localStorage.setItem("typing_mode", state.currentMode);
}

export function checkForNewPersonalBest() {
  const currentWpm = state.metrics.wpm;

  if (state.isFirstTestEver) {
    state.personalBest = currentWpm;
    state.isFirstTestEver = false;
    state.runOutcome = "baseline";
    localStorage.setItem("typing_personal_best", state.personalBest);
  } else if (currentWpm > state.personalBest) {
    state.personalBest = currentWpm;
    state.runOutcome = "new-best";
    localStorage.setItem("typing_personal_best", state.personalBest);
  } else {
    state.runOutcome = "normal";
  }
}

function selectRandomPassage(difficulty) {
  const passages = passagesData[difficulty];
  const randomIndex = Math.floor(Math.random() * passages.length);
  return passages[randomIndex].text;
}

export function initializeTextData() {
  state.currentTextString = selectRandomPassage(state.currentDifficulty);
  state.currentIndex = 0;
  state.characters = state.currentTextString.split("").map((char) => ({
    char,
    status: "pending",
  }));
}

export function calculateLiveMetrics() {
  let correct = 0;
  let incorrect = 0;

  state.characters.forEach((charObj) => {
    if (charObj.status === "correct") correct++;
    if (charObj.status === "incorrect") incorrect++;
  });

  state.metrics.correctCharsCount = correct;
  state.metrics.incorrectCharsCount = incorrect;
  state.metrics.totalTypedCount = correct + incorrect;

  if (state.metrics.totalTypedCount > 0) {
    state.metrics.accuracy = Math.round(
      (correct / state.metrics.totalTypedCount) * 100,
    );
  } else {
    state.metrics.accuracy = 100;
  }

  const timeSpentSeconds = 60 - state.timeLeft;
  if (timeSpentSeconds > 0) {
    const timeSpentMinutes = timeSpentSeconds / 60;
    const standardWordsTyped = correct / 5;
    state.metrics.wpm = Math.round(standardWordsTyped / timeSpentMinutes);
  } else {
    state.metrics.wpm = 0;
  }
}

export function clearTimer() {
  if (state.timerIntervalId) {
    clearInterval(state.timerIntervalId);
    state.timerIntervalId = null;
  }
}

export function resetState() {
  clearTimer();
  state.isTestActive = false;
  state.isTestComplete = false;
  state.timeLeft = 60;
  state.currentIndex = 0;
  state.metrics = {
    wpm: 0,
    accuracy: 100,
    correctCharsCount: 0,
    incorrectCharsCount: 0,
    totalTypedCount: 0,
  };
  initializeTextData();
}
