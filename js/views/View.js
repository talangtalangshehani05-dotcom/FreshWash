
// js/views/View.js

class View {
  _data;
  _parentElement;

  // Initialize the parent element.
  constructor(parentElement) {
    this._parentElement = document.querySelector(parentElement);

    if (!this._parentElement) {
      throw new Error(`Element ${parentElement} was not found.`);
    }
  }

  // Render data on the page.
  render(data) {
    if (data === undefined || data === null) return;

    this._data = data;

    const markup = this._generateMarkup();

    this._clear();

    this._parentElement.insertAdjacentHTML(
      'afterbegin',
      markup
    );
  }

  // Remove existing content.
  _clear() {
    this._parentElement.innerHTML = '';
  }

  // Generate HTML markup.
  _generateMarkup() {
    throw new Error(
      'The _generateMarkup() method must be implemented by the child class.'
    );
  }

  // Display an error message.
  renderError(message) {
    this._parentElement.innerHTML = `
      <p class="error-message">${message}</p>
    `;
  }

  // Display a success message.
  renderMessage(message) {
    this._parentElement.innerHTML = `
      <p class="success-message">${message}</p>
    `;
  }
}

export default View;
