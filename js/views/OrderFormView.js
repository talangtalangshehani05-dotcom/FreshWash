
import View from './View.js';

class OrderFormView extends View {

  // Display the customer order form.
  _generateMarkup() {
    return `
      <form class="order-form">

        <div class="form-group">
          <label for="customerName">Full Name</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            placeholder="Enter your full name"
            required
          >
        </div>

        <div class="form-group">
          <label for="contactNumber">Contact Number</label>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            placeholder="e.g. 09XXXXXXXXX"
            pattern="09[0-9]{9}"
            maxlength="11"
            minlength="11"
            title="Enter an 11-digit Philippine mobile number starting with 09."
            required
          >
        </div>

        <div class="form-group">
          <label for="service">Laundry Service</label>

          <select id="service" name="serviceId" required>
            <option value="">Select a service</option>

            ${this._data.map(service => `
              <option value="${service.id}">
                ${service.name} - ₱${service.price}/kg
              </option>
            `).join('')}

          </select>
        </div>

        <div class="form-group">
          <label for="weight">Laundry Weight (kg)</label>

          <input
            type="number"
            id="weight"
            name="weight"
            placeholder="Enter weight in kilograms"
            min="0.1"
            step="0.1"
            required
          >
        </div>

        <div class="price-display">
          <span>Estimated Total</span>
          <strong class="total-price">₱0.00</strong>
        </div>

        <div class="form-message" aria-live="polite"></div>

        <button type="submit" class="submit-button">
          Place My Order →
        </button>

      </form>
    `;
  }

  // Get customer information from the form.
  _getFormData() {
    return {
      customerName: this._parentElement.querySelector('#customerName').value.trim(),

      contactNumber: this._parentElement.querySelector('#contactNumber').value.trim(),

      serviceId: this._parentElement.querySelector('#service').value,

      weight: Number(
        this._parentElement.querySelector('#weight').value
      )
    };
  }

  // Handle order submission.
  addHandlerSubmit(handler) {
    this._parentElement.addEventListener('submit', event => {
      const form = event.target.closest('.order-form');

      if (!form) return;

      event.preventDefault();

      if (!form.reportValidity()) return;

      handler(this._getFormData());
    });
  }

  // Calculate the estimated price when inputs change.
  addHandlerCalculate(handler) {
    this._parentElement.addEventListener('input', event => {
      if (event.target.matches('#weight')) {
        handler(this._getFormData());
      }
    });

    this._parentElement.addEventListener('change', event => {
      if (event.target.matches('#service')) {
        handler(this._getFormData());
      }
    });
  }

  // Display the calculated price.
  updatePrice(price) {
    const priceElement =
      this._parentElement.querySelector('.total-price');

    if (!priceElement) return;

    priceElement.textContent =
      `₱${Number(price).toFixed(2)}`;
  }

  // Display success or error messages.
  renderFormMessage(message, type = 'success') {
    const messageElement =
      this._parentElement.querySelector('.form-message');

    if (!messageElement) return;

    messageElement.textContent = message;

    messageElement.className =
      `form-message ${type}-message`;
  }

  // Reset the form after a successful order.
  resetForm() {
    const form =
      this._parentElement.querySelector('.order-form');

    if (form) form.reset();

    this.updatePrice(0);

    this.renderFormMessage('');
  }

}

export default new OrderFormView('#order-form');
