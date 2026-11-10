
import View from './View.js';

class OrderTrackingView extends View {

  // Display the order tracking form.
  _generateMarkup() {
    return `
      <form class="tracking-form">

        <div class="form-group">
          <label for="trackingNumber">
            Contact Number
          </label>

          <input
            type="tel"
            id="trackingNumber"
            name="contactNumber"
            placeholder="Enter your 09XXXXXXXXX number"
            pattern="09[0-9]{9}"
            maxlength="11"
            minlength="11"
            title="Enter an 11-digit Philippine mobile number starting with 09."
            required
          >
        </div>

        <button type="submit" class="tracking-button">
          Find My Orders →
        </button>

      </form>

      <div class="tracking-results" aria-live="polite"></div>
    `;
  }

  // Listen for tracking form submission.
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', event => {

      const form = event.target.closest('.tracking-form');

      if (!form) return;

      event.preventDefault();

      if (!form.reportValidity()) return;

      const contactNumber =
        form.querySelector('#trackingNumber').value.trim();

      handler(contactNumber);
    });
  }

  // Display the customer's matching orders.
  renderOrders(orders) {

    const results =
      this._parentElement.querySelector('.tracking-results');

    if (!results) return;

    if (orders.length === 0) {
      results.innerHTML = `
        <p class="error-message">
          No orders found for this contact number.
          Please check your number and try again.
        </p>
      `;

      return;
    }

    results.innerHTML = `
      <h3>Your Laundry Orders (${orders.length})</h3>

      ${orders.map(order => {

        let statusClass = '';

        if (order.status === 'Processing') {
          statusClass = 'processing';
        }

        if (order.status === 'Completed') {
          statusClass = 'completed';
        }

        return `
          <div class="tracking-order">

            <h4>Order #${order.id}</h4>

            <p>
              <strong>Customer:</strong>
              ${this._escapeHTML(order.customerName)}
            </p>

            <p>
              <strong>Service:</strong>
              ${this._escapeHTML(order.service)}
            </p>

            <p>
              <strong>Weight:</strong>
              ${Number(order.weight)} kg
            </p>

            <p>
              <strong>Total:</strong>
              ₱${Number(order.total).toFixed(2)}
            </p>

            <p>
              <strong>Order Date:</strong>
              ${this._escapeHTML(order.date || '')}
            </p>

            <span class="status-badge ${statusClass}">
              ${this._escapeHTML(order.status)}
            </span>

          </div>
        `;

      }).join('')}
    `;
  }

  // Safely display customer information.
  _escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

}

export default new OrderTrackingView('#order-tracking');
