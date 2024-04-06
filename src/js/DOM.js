import { getDomElement } from "./libraries/utils";

export const dom = {
  root: document.documentElement,

  recipeContainer: getDomElement(".recipe"),
  searchForm: getDomElement(".search"),
  results: getDomElement(".results"),
};
