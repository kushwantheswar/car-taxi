import React from "react";
import { useApp } from "../../context/AppContext";
import { Avatar, LiveDot } from "../ui";

const ADMIN_NAV = [
  { section: "Overview" },
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { section: "Inventory" },
  { id: "inventory", icon: "📦", label: "Inventory Management" }, // Was 'cars', 'Fleet'
  { id: "suppliers", icon: "🚛", label: "Suppliers" }, // Was 'drivers'
  { section: "Operations" },
  { id: "orders", icon: "📋", label: "Orders", badge: true }, // Was 'bookings'
  { id: "analytics", icon: "📈", label: "Analytics" },
  { section: "System" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

const USER_NAV = [
  { section: "Navigation" },
  { id: "dashboard", icon: "🏠", label: "Home" },
  { id: "place-order", icon: "🛒", label: "Place Order" }, // Was 'Book a Ride'
  { section: "History" },
  { id: "my-orders", icon: "📋", label: "My Orders" }, // Was 'My Bookings'
  { section: "Account" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

export function Sidebar() {
  const { role, page, setPage, logout, orders } = useApp(); // Changed bookings to orders
  const nav = role === "admin" ? ADMIN_NAV : USER_NAV;
  const pendingCount = orders?.filter(b => b.status === "pending").length || 0;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>🚛 Dealer MS</h1> {/* Updated Logo */}
        <span>
          <span className="logo-dot" />
          {role === "admin" ? "Admin Console" : "Dealer Portal"}
        </span>
      </div>

      <div className="sidebar-nav">
        {nav.map((n, i) => {
          if (n.section) {
            return <div key={i} className="sidebar-section">{n.section}</div>;
          }
          return (
            <div
              key={n.id}
              className={`nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => setPage(n.id)}
            >
              <span className="icon">{n.icon}</span>
              {n.label}
              {n.badge && pendingCount > 0 && (
                <span className="nav-badge">{pendingCount}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <Avatar name={role === "admin" ? "Admin User" : "Dealer User"} size={34} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {role === "admin" ? "Admin User" : "Dealer User"}
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 1 }}>
              {role === "admin" ? "Administrator" : "+91 9876543210"}
            </div>
          </div>
        </div>
        <div
          className="nav-item"
          onClick={logout}
          style={{ color: "var(--danger)", marginTop: 4, borderRadius: "var(--radius-sm)", border: "1px solid rgba(239,68,68,0.15)" }}
        >
          <span className="icon">🚪</span> Logout
        </div>
      </div>
    </div>
  );
}