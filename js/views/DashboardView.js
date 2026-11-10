
import View from './View.js';

class DashboardView extends View {

  _generateMarkup() {

    const totalOrders = this._data.length;

    const pendingOrders = this._data.filter(
      order => order.status === 'Pending'
    ).length;

    const processingOrders = this._data.filter(
      order => order.status === 'Processing'
    ).length;

    const completedOrders = this._data.filter(
      order => order.status === 'Completed'
    ).length;

    const totalRevenue = this._data.reduce(
      (total, order) => total + Number(order.total || 0),
      0
    );

    return `
      <h2>Dashboard Overview</h2>

      <div class="dashboard-cards">

        <div class="dashboard-card">
          <h3>Total Orders</h3>
          <p>${totalOrders}</p>
        </div>

        <div class="dashboard-card">
          <h3>Pending Orders</h3>
          <p>${pendingOrders}</p>
        </div>

        <div class="dashboard-card">
          <h3>Processing Orders</h3>
          <p>${processingOrders}</p>
        </div>

        <div class="dashboard-card">
          <h3>Completed Orders</h3>
          <p>${completedOrders}</p>
        </div>

        <div class="dashboard-card">
          <h3>Total Revenue</h3>
          <p>₱${totalRevenue.toFixed(2)}</p>
        </div>

      </div>
    `;
  }

}

export default new DashboardView('#dashboard');
