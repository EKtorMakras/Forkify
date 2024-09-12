import { API_URL, RESULTS_PER_PAGE } from "./common/config";
import { getJSON } from "./libraries/utils";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
};

export async function fetchRecipe(id) {
  const url = `${API_URL}${id}`;
  const { data, error } = await getJSON(url);

  if (error) {
    throw error;
  }

  const { recipe } = data.data;

  state.recipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
  };
}

export async function fetchSearchResults(query) {
  const url = `${API_URL}?search=${query}`;
  const { data, error } = await getJSON(url);

  if (error) {
    throw error;
  }

  const { recipes } = data.data;

  state.search.results = recipes.map((recipe) => {
    return {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
    };
  });
}

export function getSearchResultsPage(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  state.recipe?.ingredients?.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
}
