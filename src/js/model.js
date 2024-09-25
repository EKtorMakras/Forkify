import { API_URL, RESULTS_PER_PAGE } from "./common/config";
import { getJSON, setItemLs, getItemLs } from "./libraries/utils";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
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
    bookmarked: state.bookmarks.some((bookmark) => bookmark.id === recipe.id),
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

  state.search.page = 1;
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

export function addBookmark(recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  // Update Ls
  persistBookmarks();
}

export function removeBookmark(id) {
  // Filter out the recipe from the bookmarks array
  state.bookmarks = state.bookmarks.filter((bookmark) => bookmark.id !== id);

  // UnMark current recipe as bookmark
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  // Update Ls
  persistBookmarks();
}

function persistBookmarks() {
  setItemLs("bookmarks", state.bookmarks);
}

function loadBookmarks() {
  const storedBookmarks = getItemLs("bookmarks");
  if (storedBookmarks) {
    state.bookmarks = storedBookmarks;
  }
}

// function clearBookmarks() {
//   state.bookmarks = [];
//   localStorage.clear("bookmarks");
// }

loadBookmarks();
