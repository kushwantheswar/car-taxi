import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";

const AuthLeft = () => (
  <div className="auth-left">
    <div className="auth-brand">🚖 CarTaxi</div>
    <div className="auth-tagline">
      Vijayawada's most trusted taxi management platform.<br/>
      Book rides, manage fleets, track in real-time.
    </div>
    <div style={{marginTop:48,display:"flex",flexDirection:"column",gap:16}}>
      {["Fleet Management","Real-Time Tracking","Instant Booking","PDF Billing"].map(f=>(
        <div key={f} style={{display:"flex",alignItems:"center",gap:12,color:"rgba(255,255,255,.7)",fontSize:14}}>
          <span style={{color:"#F5A623",fontSize:16}}>✓</span>{f}
        </div>
      ))}
    </div>
  </div>
);

export function UserAuth() {
  const { setScreen, login, register, showNotification } = useApp();
  const [view, setView] = useState("login");
  const [form, setForm] = useState({ username: "", password: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
 
  const handleLogin = async () => {
    if (!form.username || !form.password) { showNotification("Please enter username and password", "error"); return; }
    setLoading(true);
    try {
      await login("user", { username: form.username, password: form.password });
      showNotification("Welcome back to CarTaxi! 🚖", "success");
    } catch(e) {}
    setLoading(false);
  };
 
  const handleSignup = async () => {
    if (!form.username || !form.password) { showNotification("Username and Password are required", "error"); return; }
    setLoading(true);
    try {
      await register({ ...form, role: "user" });
      setView("login");
    } catch(e) {}
    setLoading(false);
  };
 
  if (view === "signup") return (
    <div className="auth-page">
      <AuthLeft />
      <div className="auth-right">
        <div className="auth-title animate-in">Create Account</div>
        <div className="auth-sub animate-in delay-1">Join thousands of riders in Vijayawada</div>
        <div className="form-group animate-in delay-1"><label>Username</label><input placeholder="johndoe123" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></div>
        <div className="form-group animate-in delay-1"><label>Password</label><input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
        <div className="form-group animate-in delay-1"><label>Mobile Number</label><input placeholder="9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
        <div className="form-group animate-in delay-2"><label>Email (Optional)</label><input placeholder="john@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
        
        <button className="btn-primary animate-in delay-3" style={{ width: "100%", marginTop: 4 }} onClick={handleSignup} disabled={loading}>
          {loading ? "Creating Account..." : "Create Account & Continue →"}
        </button>
        <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 20, textAlign: "center", cursor: "pointer" }} onClick={() => setView("login")}>
          ← Already have an account? <span style={{ color: "var(--accent)", fontWeight: 700 }}>Sign in</span>
        </p>
      </div>
    </div>
  );
 
  return (
    <div className="auth-page">
      <AuthLeft />
      <div className="auth-right">
        <div style={{ marginBottom: 12 }}><span className="tag tag-teal">Passenger Login</span></div>
        <div className="auth-title animate-in">Book Your Ride</div>
        <div className="auth-sub animate-in delay-1">Sign in with your standard credentials</div>
 
        <div className="animate-in">
          <div className="form-group">
            <label>Username</label>
            <input placeholder="Enter Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          <button className="btn-primary" style={{ width: "100%", padding: "14px 24px", fontSize: 15 }} onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </div>
 
        <div className="divider">or</div>
        <button className="btn-secondary" style={{ width: "100%" }} onClick={() => setScreen("admin-login")}>Admin Portal Login</button>
 
        <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 24, textAlign: "center" }}>
          New user?{" "}
          <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 700 }} onClick={() => setView("signup")}>Create an account</span>
        </p>
      </div>
    </div>
  );
}