import React from "react";
 
export const StatusBadge = ({ s }) => {
  const map = {
    pending: "status-pending", active: "status-active",
    completed: "status-completed", cancelled: "status-cancelled",
    available: "status-active", on_trip: "status-pending",
  };
  const label = {
    pending: "Pending", active: "Active", completed: "Completed",
    cancelled: "Cancelled", available: "Available", on_trip: "On Trip",
  };
  const icons = { pending: "⏳", active: "🔄", completed: "✅", cancelled: "❌", available: "✅", on_trip: "🔄" };
  return (
    <span className={`booking-status ${map[s] || "status-gray"}`}>
      {icons[s]} {label[s] || s}
    </span>
  );
};
 
export const TierBadge = ({ tier }) => {
  if (tier === "luxury") return <span className="tag tag-gold">✦ Luxury</span>;
  if (tier === "premium") return <span className="tag tag-teal">★ Premium</span>;
  return <span className="tag tag-gray">Standard</span>;
};
 
