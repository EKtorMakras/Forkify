import { dom } from "../DOM";
import View from "./View.js";

class ResultsView extends View {
  _parentElement = dom.results;
  _errorMessage = "No recipes found for your search term. Please try another one.";

  _generateMarkup() {
    const markup = this._data.map(this._generateMarkupPreview).join("");
    return markup;
  }

  _generateMarkupPreview(result) {
    return `
      <li class="preview">
        <a class="preview__link" href="#${result.id}">
          <figure class="preview__fig">
            <img src="${result.image}" alt="${result.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${result.title}</h4>
            <p class="preview__publisher">${result.publisher}</p>
          </div>
        </a>
      </li>
    `;
  }
}

export default new ResultsView();
