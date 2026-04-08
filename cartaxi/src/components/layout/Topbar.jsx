import React from "react";
import { useApp } from "../../context/AppContext";

export function Topbar() {
  const { role, page, setPage, orders } = useApp(); // Changed bookings to orders

  const TITLES = {
    admin: { 
      dashboard: "Dashboard", 
      inventory: "Inventory Management", // Was 'Fleet Management'
      suppliers: "Suppliers", // Was 'Drivers'
      orders: "Orders", // Was 'Bookings'
      analytics: "Analytics", 
      settings: "Settings" 
    },
    user: { 
      dashboard: "Home", 
      "place-order": "Place Order", // Was 'Book a Ride'
      "my-orders": "My Orders", // Was 'My Bookings'
      settings: "Settings" 
    },
  };

  const pendingCount = orders?.filter(b => b.status === "pending").length || 0;
  const activeRides = orders?.filter(b => b.status === "active").length || 0;

  return (
    <div className="topbar">
      <div className="topbar-title">
        {(TITLES[role] || {})[page] || page}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {role === "admin" && activeRides > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--accent2-glow)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "var(--accent2)", fontWeight: 600 }}>
            <LiveDot /> {activeRides} Active Order{activeRides > 1 ? "s" : ""} {/* Updated Text */}
          </div>
        )}

        {pendingCount > 0 && role === "admin" && (
          <button onClick={() => setPage("orders")} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--accent-glow)", border: "1px solid var(--border-accent)", borderRadius: 20, padding: "5px 14px", fontSize: 12, color: "var(--accent)", fontWeight: 600, cursor: "pointer" }}>
            ⏳ {pendingCount} Pending
          </button>
        )}

        <div className="notif-btn">
          <span style={{ fontSize: 18 }}>🔔</span>
          <div className="notif-dot" />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--glass)", border: "1px solid var(--glass-border)", borderRadius: "var(--radius-sm)", padding: "6px 12px", cursor: "pointer" }}>
          <Avatar name={role === "admin" ? "Admin User" : "Dealer User"} size={28} />
          <span className={`tag ${role === "admin" ? "tag-gold" : "tag-teal"}`} style={{ fontSize: 10 }}>
            {role === "admin" ? "Admin" : "Dealer"}
          </span>
        </div>
      </div>
    </div>
  );
}