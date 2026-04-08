export const Toggle = ({ on, onChange }) => (
  <button className={`toggle-btn ${on ? "on" : "off"}`} onClick={() => onChange(!on)}>
    <div className="toggle-knob" />
  </button>
);
 
export const Notification = ({ msg, type }) => {
  if (!msg) return null;
  const colors = { success: "var(--accent2)", error: "var(--danger)", info: "var(--blue)", warning: "var(--accent)" };
  const icons = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };
  return (
    <div style={{
      position: "fixed", top: 80, right: 24, zIndex: 9999,
      background: "var(--primary-card)", border: `1px solid ${colors[type]}`,
      borderLeft: `4px solid ${colors[type]}`,
      borderRadius: "var(--radius-sm)", padding: "14px 20px",
      display: "flex", alignItems: "center", gap: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      animation: "slideInRight 0.3s ease",
      maxWidth: 360, minWidth: 280,
    }}>
      <span style={{ color: colors[type], fontWeight: 800, fontSize: 16 }}>{icons[type]}</span>
      <span style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>{msg}</span>
    </div>
  );
};
 
export const Avatar = ({ name, size = 38, style = {} }) => {
  const initials = name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";
  const colors = ["#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EF4444", "#F97316"];
  const color = colors[name ? name.charCodeAt(0) % colors.length : 0];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${color}, ${color}bb)`,
      color: "#0A0E1A", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.32, fontWeight: 800, flexShrink: 0, ...style
    }}>
      {initials}
    </div>
  );
};
 
export const Stars = ({ rating }) => (
  <div className="stars" style={{ display: "flex", alignItems: "center", gap: 2 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <span key={i} style={{ color: i <= Math.floor(rating) ? "var(--accent)" : "var(--surface3)", fontSize: 13 }}>★</span>
    ))}
    <span style={{ fontSize: 12, color: "var(--text2)", marginLeft: 4, fontWeight: 600 }}>{rating?.toFixed(1)}</span>
  </div>
);
 
export const LiveDot = () => <span className="live-dot" />;
 
export const ProgressBar = ({ value, max, color = "var(--accent)" }) => (
  <div className="progress-bar">
    <div className="progress-fill" style={{ width: `${Math.min((value / max) * 100, 100)}%`, background: color }} />
  </div>
);