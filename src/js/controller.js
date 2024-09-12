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

    // 0) Update results view to mark selected search result
    console.log(model.getSearchResultsPage());
    resultsView.update(model.getSearchResultsPage());

    // 1)Loading recipe
    await model.fetchRecipe(id);

    // 2)Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
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
    console.log(err);
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

function controlServings(newServings) {
  // Update recipe servings
  model.updateServings(newServings);

  // Update the view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

function init() {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
}

init();
