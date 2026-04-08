import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Avatar } from "../../components/ui";

export function AdminAuth() {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login delay
    setTimeout(() => {
      login("admin");
      setLoading(false);
    }, 500);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-grid" />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div className="auth-brand">🚛 Dealer MS</div>
          <div className="auth-tagline">
            Manage your inventory, suppliers, and orders efficiently in one place.
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-title">Admin Login</div>
        <div className="auth-sub">Enter your credentials to access the dashboard</div>

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="admin@dealerms.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", marginBottom: 16 }} disabled={loading}>
            {loading ? "Signing In..." : "Sign In to Admin Console"}
          </button>
        </form>

        <div className="divider">Or continue with</div>

        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={() => login("admin")}>
            Demo Login
          </button>
        </div>
      </div>
    </div>
  );
}

export function UserAuth() {
  const { login } = useApp();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login("user");
      setLoading(false);
    }, 500);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-grid" />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div className="auth-brand">🚛 Dealer MS</div>
          <div className="auth-tagline">
            Browse products and place orders with your trusted suppliers.
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-title">Dealer Login</div>
        <div className="auth-sub">Access your account to manage orders</div>

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label>Phone Number</label>
            <input type="tel" placeholder="+91 98765 43210" />
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label>Password</label>
            <input type="password" placeholder="••••••••" />
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", marginBottom: 16 }} disabled={loading}>
            {loading ? "Signing In..." : "Sign In as Dealer"}
          </button>
        </form>

        <div className="divider">Or</div>

        <button className="btn-secondary" style={{ width: "100%" }} onClick={() => login("user")}>
          Demo Login
        </button>
      </div>
    </div>
  );
}