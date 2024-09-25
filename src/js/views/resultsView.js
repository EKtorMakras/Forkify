import { dom } from "../DOM";
import View from "./View.js";
import previewView from "./previewView.js";
class ResultsView extends View {
  _parentElement = dom.results;
  _errorMessage = "No recipes found for your search term. Please try another one.";

  _generateMarkup() {
    const markup = this._data.map((result) => previewView.render(result, false)).join("");

    return markup;
  }
}

export default new ResultsView();
