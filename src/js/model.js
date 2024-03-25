import { API_URL } from "./common/config";
import { getJSON } from "./libraries/utils";

export const state = {
  recipe: {},
};

export async function fetchRecipe(id) {
  const url = `${API_URL}/recipes/${id}`;
  const { data, error } = await getJSON(url);

  if (error) {
    console.log("errored");
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
