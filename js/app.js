import { loadPassages } from "../data/data.js";
import { initApp } from "./controllers/typingController.js";

async function init() {
  await loadPassages();

  initApp();
}

init();
