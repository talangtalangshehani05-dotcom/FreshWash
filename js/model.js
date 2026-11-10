// Available laundry services.
const services = [
  {
    id: 'wash',
    name: 'Wash',
    price: 30
  },
  {
    id: 'dry',
    name: 'Dry',
    price: 25
  },
  {
    id: 'fold',
    name: 'Fold',
    price: 15
  },
  {
    id: 'wash-dry-fold',
    name: 'Wash, Dry & Fold',
    price: 50
  }
];

// Load saved orders from Local Storage.
const loadOrders = () => {
  try {
    const savedOrders = localStorage.getItem('freshwash_orders');

    return savedOrders ? JSON.parse(savedOrders) : [];
  } catch (error) {
    console.error('Unable to load laundry orders:', error);
    return [];
  }
};

// Save orders to Local Storage.
const saveOrders = () => {
  localStorage.setItem(
    'freshwash_orders',
    JSON.stringify(state.orders)
  );
};

// Application state.
const state = {
  orders: loadOrders(),
  services: services
};

// Calculate laundry price.
const calculatePrice = (weight, serviceId) => {
  const service = state.services.find(
    service => service.id === serviceId
  );

  const numericWeight = Number(weight);

  if (
    !service ||
    !Number.isFinite(numericWeight) ||
    numericWeight <= 0
  ) {
    return 0;
  }

  return numericWeight * service.price;
};

// Add a new customer laundry order.
const addOrder = (
  customerName,
  contactNumber,
  serviceId,
  weight
) => {

  const service = state.services.find(
    service => service.id === serviceId
  );

  const numericWeight = Number(weight);

  // Validate customer name.
  if (!customerName || !customerName.trim()) {
    return {
      success: false,
      message: 'Please enter your full name.'
    };
  }

  // Validate Philippine mobile number.
  if (!/^09\d{9}$/.test(contactNumber)) {
    return {
      success: false,
      message: 'Please enter a valid 11-digit mobile number starting with 09.'
    };
  }

  // Validate selected service.
  if (!service) {
    return {
      success: false,
      message: 'Please select a valid laundry service.'
    };
  }

  // Validate laundry weight.
  if (
    !Number.isFinite(numericWeight) ||
    numericWeight <= 0
  ) {
    return {
      success: false,
      message: 'Please enter a valid laundry weight.'
    };
  }

  // Create the new order.
  const newOrder = {
    id: Date.now(),

    customerName: customerName.trim(),

    contactNumber: contactNumber,

    service: service.name,

    serviceId: service.id,

    weight: numericWeight,

    pricePerKg: service.price,

    total: calculatePrice(numericWeight, serviceId),

    status: 'Pending',

    date: new Date().toLocaleDateString()
  };

  // Save the order.
  state.orders.push(newOrder);

  saveOrders();

  return {
    success: true,
    message: 'Your laundry order has been placed successfully!',
    order: newOrder
  };
};

// Find orders using the customer's contact number.
const findOrdersByContact = contactNumber => {

  if (!contactNumber) return [];

  return state.orders.filter(
    order => order.contactNumber === contactNumber.trim()
  );
};

// Export model functions and application state.
export {
  state,
  calculatePrice,
  addOrder,
  findOrdersByContact
};

