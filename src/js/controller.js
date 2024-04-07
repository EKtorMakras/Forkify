import "@/scss/style.scss";
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // 1)Loading recipe
    await model.fetchRecipe(id);

    // 2)Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
}

async function controlSearchResults() {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.fetchSearchResults(query);

    // 3) Render Results
    const currentPageResults = model.getSearchResultsPage();
    resultsView.render(currentPageResults);

    // 4) Render the initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
}

function controlPagination(goToPage) {
  // Render New Results
  const currentPageResults = model.getSearchResultsPage(goToPage);
  resultsView.render(currentPageResults);

  // Render new pagination
  paginationView.render(model.state.search);
}

function init() {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
}

init();
