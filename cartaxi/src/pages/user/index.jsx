import React from 'react';
// Import the PlaceOrder component you created in the previous step
import PlaceOrder from './PlaceOrder.jsx';

// 1. User Dashboard
export function UserDashboard() {
  return (
    <div className="page animate-in">
      <div style={{ fontFamily: "var(--font-head)", fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
        Dealer Dashboard
      </div>
      <div style={{ color: "var(--text2)", marginBottom: 24 }}>
        Overview of your account activity
      </div>

      <div className="grid2">
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 12, color: "var(--text2)", textTransform: "uppercase", marginBottom: 8 }}>Total Orders</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>12</div>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 12, color: "var(--text2)", textTransform: "uppercase", marginBottom: 8 }}>Total Spent</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "var(--accent)" }}>₹45,200</div>
        </div>
      </div>
    </div>
  );
}

// 2. My Orders Page (Replaces MyBookings)
export function MyOrders() {
  return (
    <div className="page animate-in">
      <div style={{ fontFamily: "var(--font-head)", fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
        My Orders
      </div>
      
      <div className="card" style={{ padding: 24 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#ORD-1001</td>
                <td>Brake Pad Set</td>
                <td>2024-03-30</td>
                <td><span className="tag tag-teal">Completed</span></td>
                <td>₹1,500</td>
              </tr>
              <tr>
                <td>#ORD-1005</td>
                <td>Engine Oil</td>
                <td>2024-04-02</td>
                <td><span className="tag tag-blue">Pending</span></td>
                <td>₹650</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 3. Re-export PlaceOrder so App.jsx can use it
export { PlaceOrder };