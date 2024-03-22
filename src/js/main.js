// Import Css
import "@/scss/style.scss";

// Module Imports
import { initStartingData } from "./fillStartingData.js";

// Init App
document.addEventListener("DOMContentLoaded", initApp);

// Functions
function initApp() {
  initStartingData();
}
