import "@/scss/style.scss";
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // 1)Loading recipe
    await model.fetchRecipe(id);

    // 2)Rendering recipe
    recipeView.renderRecipe(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
}

function init() {
  recipeView.addHandlerRender(controlRecipes);
}

init();
