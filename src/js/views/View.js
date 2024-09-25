import icons from "@/assets/img/icons.svg";

export default class View {
  _data;
  _parentElement;
  _errorMessage = "Something went wrong";
  _message = "";

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this.#clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll("*"));
    const currentElements = Array.from(this._parentElement.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      const currentElement = currentElements[i];

      // Updates Text
      if (!newEl.isEqualNode(currentElement) && newEl.firstChild?.nodeValue?.trim() !== "") {
        currentElement.textContent = newEl.textContent;
      }

      // Updates Attributes
      if (!newEl.isEqualNode(currentElement)) {
        Array.from(newEl.attributes).forEach((attr) => {
          currentElement.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
     `;

    this.#clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div class="flex-center">
          <svg>
            <use href=".${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;

    this.#clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div class="flex-center">
          <svg>
            <use href=".${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;

    this.#clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  #clear() {
    this._parentElement.innerHTML = "";
  }
}
