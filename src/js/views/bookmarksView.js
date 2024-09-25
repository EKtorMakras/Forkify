import { dom } from "../DOM";
import View from "./View.js";
import previewView from "./previewView.js";

class BookmarksView extends View {
  _parentElement = dom.bookmarks;
  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)";

  _generateMarkup() {
    const markup = this._data.map((bookmark) => previewView.render(bookmark, false)).join("");

    return markup;
  }
}

export default new BookmarksView();
