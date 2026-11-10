
import {
  state,
  calculatePrice,
  addOrder,
  findOrdersByContact
} from './model.js';

import OrderFormView from './views/OrderFormView.js';
import OrderTrackingView from './views/OrderTrackingView.js';

// 1. PAGE NAVIGATION

const pages = {
  home: document.querySelector('#home-page'),
  services: document.querySelector('#services-page'),
  order: document.querySelector('#order-page'),
  tracking: document.querySelector('#tracking-page')
};

const showPage = function (pageName) {

  // Check if the requested page exists.
  if (!pages[pageName]) {
    pageName = 'home';
  }

  // Hide all pages.
  Object.values(pages).forEach(page => {
    page.classList.remove('active');
  });

  // Display the selected page.
  pages[pageName].classList.add('active');

  // Update active navigation link.
  document.querySelectorAll('[data-page]').forEach(link => {
    link.classList.toggle(
      'active',
      link.dataset.page === pageName
    );
  });

  // Update browser URL.
  if (window.location.hash !== `#${pageName}`) {
    history.pushState(null, '', `#${pageName}`);
  }

  // Scroll to the top.
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// 2. HANDLE NAVIGATION CLICKS

document.addEventListener('click', function (event) {

  const navigationLink = event.target.closest('[data-page]');

  if (!navigationLink) return;

  event.preventDefault();

  const pageName = navigationLink.dataset.page;

  showPage(pageName);

});

// 3. HANDLE BROWSER BACK AND FORWARD

window.addEventListener('popstate', function () {

  const pageName = window.location.hash.replace('#', '');

  showPage(pageName || 'home');

});

// 4. DISPLAY LAUNDRY SERVICES

const renderServices = function () {

  const servicesContainer = document.querySelector('#services-list');

  if (!servicesContainer) return;

  const serviceImages = {
    wash: 'images/wash.jpg',
    dry: 'images/dry.jpg',
    fold: 'images/fold.jpg',
    'wash-dry-fold': 'images/wash-dry-fold.jpg'
  };

  const serviceDescriptions = {
    wash: 'Give your clothes a refreshing and thorough wash.',
    dry: 'Get your clothes dry and ready for everyday use.',
    fold: 'Enjoy neatly folded clothes, ready to wear.',
    'wash-dry-fold': 'Complete laundry care from washing to folding.'
  };

  servicesContainer.innerHTML = state.services.map(service => `

    <div class="service-card">

      <div class="service-image">

        <img
          src="${serviceImages[service.id]}"
          alt="${service.name} laundry service"
          loading="lazy"
        >

      </div>

      <div class="service-content">

        <h3>${service.name}</h3>

        <p>${serviceDescriptions[service.id]}</p>

        <div class="service-price">
          ₱${service.price}<small>/ kg</small>
        </div>

      </div>

    </div>

  `).join('');

};

// 5. AUTOMATIC PRICE CALCULATION

const controlCalculatePrice = function (formData) {

  const price = calculatePrice(
    formData.weight,
    formData.serviceId
  );

  OrderFormView.updatePrice(price);

};

// 6. PLACE A LAUNDRY ORDER

const controlAddOrder = function (formData) {

  const result = addOrder(
    formData.customerName,
    formData.contactNumber,
    formData.serviceId,
    formData.weight
  );

  if (!result.success) {

    OrderFormView.renderFormMessage(
      result.message,
      'error'
    );

    return;

  }

  OrderFormView.resetForm();

  OrderFormView.renderFormMessage(
    `${result.message} Your order number is #${result.order.id}.`,
    'success'
  );

};

// 7. TRACK CUSTOMER ORDERS

const controlSearchOrders = function (contactNumber) {

  const orders = findOrdersByContact(contactNumber);

  OrderTrackingView.renderOrders(orders);

};

// 8. INITIALIZE APPLICATION

const init = function () {

  // Render laundry services.
  renderServices();

  // Render the order form.
  OrderFormView.render(state.services);

  // Render the tracking form.
  OrderTrackingView.render([]);

  // Activate order form functionality.
  OrderFormView.addHandlerCalculate(controlCalculatePrice);

  OrderFormView.addHandlerSubmit(controlAddOrder);

  // Activate tracking functionality.
  OrderTrackingView.addHandlerSearch(controlSearchOrders);

  // Display the correct initial page.
  const initialPage = window.location.hash.replace('#', '');

  showPage(initialPage || 'home');

};

init();
