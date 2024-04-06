import { dom } from "../DOM";
import { getDomElement } from "../libraries/utils";

class SearchView {
  #parentEl = dom.searchForm;
  #searchEl = getDomElement(".search__field", false, this.#parentEl);

  getQuery() {
    const query = this.#searchEl.value;
    this.#clearInput();

    return query;
  }

  addHandlerSearch(handler) {
    this.#parentEl.addEventListener("submit", function (event) {
      event.preventDefault();
      handler();
    });
  }

  #clearInput() {
    this.#searchEl.value = "";
  }
}

export default new SearchView();
