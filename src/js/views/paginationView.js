import { dom } from "../DOM";
import View from "./View.js";
import icons from "@/assets/img/icons.svg";

class PaginationView extends View {
  _parentElement = dom.pagination;

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;

      const goToPage = Number(btn.dataset.goto);

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    let markup = "";

    // Page 1 and there are other pages
    if (curPage === 1 && numPages > 1) {
      markup += this.generateMarkupButton("next", curPage);
    }
    // Last Page
    else if (curPage === numPages && numPages > 1) {
      markup += this.generateMarkupButton("prev", curPage);
    }
    // Other Page
    else if (curPage < numPages) {
      markup += this.generateMarkupButton("next", curPage);
      markup += this.generateMarkupButton("prev", curPage);
    }
    // Page 1 and there are NO other pages
    else if (curPage === 1 && !numPages) {
      markup = "";
    }

    return markup;
  }

  generateMarkupButton(type, page) {
    const icon = type === "next" ? "icon-arrow-right" : "icon-arrow-left";
    const goTo = type === "next" ? page + 1 : page - 1;

    return `
      <button data-goto="${goTo}" class="btn--inline pagination__btn--${type}">
        <span>Page ${goTo}</span>
        <svg class="search__icon">
          <use href="${icons}#${icon}"></use>
        </svg>
      </button>
    `;
  }
}

export default new PaginationView();
