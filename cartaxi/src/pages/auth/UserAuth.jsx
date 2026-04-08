import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";

// --- Helper Component (Embedded to avoid import errors) ---
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

// --- Main Component ---
export function UserAuth() {
  const { setScreen, login, showNotification } = useApp();
  const [view, setView] = useState("login");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", otp: "", email: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
 
  const sendOTP = async () => {
    if (!form.phone || form.phone.length < 10) { showNotification("Enter a valid 10-digit mobile number", "error"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setOtpSent(true);
    setStep(2);
    showNotification("OTP sent to +91 " + form.phone, "success");
  };
 
  const verifyOTP = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    login("user");
    showNotification("Welcome to CarTaxi! 🚖", "success");
  };
 
  const handleSignup = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setView("login");
    showNotification("Account created! Please login.", "success");
  };
 
  if (view === "signup") return (
    <div className="auth-page">
      <AuthLeft />
      <div className="auth-right">
        <div className="auth-title animate-in">Create Account</div>
        <div className="auth-sub animate-in delay-1">Join thousands of riders in Vijayawada</div>
        <div className="form-group animate-in delay-1"><label>Full Name</label><input placeholder="Priya Nair" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
        <div className="form-group animate-in delay-1">
          <label>Mobile Number</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ width: 70, flexShrink: 0 }} value="+91" readOnly />
            <input placeholder="9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>
        <div className="form-group animate-in delay-2"><label>Email (Optional)</label><input placeholder="priya@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
        <div className="form-group animate-in delay-2"><label>Home Address</label><textarea rows={2} placeholder="MG Road, Vijayawada - 520010" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
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
        <div className="auth-sub animate-in delay-1">Enter your mobile number to get started</div>
 
        {/* Step indicator */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {[1, 2].map(s => (
            <div key={s} style={{ height: 4, flex: 1, borderRadius: 2, background: step >= s ? "var(--accent)" : "var(--surface3)", transition: "background 0.3s" }} />
          ))}
        </div>
 
        {step === 1 ? (
          <div className="animate-in">
            <div className="form-group">
              <label>Mobile Number</label>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0 14px", fontSize: 14, color: "var(--text2)", fontWeight: 600, whiteSpace: "nowrap" }}>🇮🇳 +91</div>
                <input placeholder="9876543210" maxLength={10} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })} onKeyDown={e => e.key === "Enter" && sendOTP()} />
              </div>
            </div>
            <button className="btn-primary" style={{ width: "100%", padding: "14px 24px", fontSize: 15 }} onClick={sendOTP} disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP →"}
            </button>
          </div>
        ) : (
          <div className="animate-in">
            <div style={{ textAlign: "center", marginBottom: 20, padding: 16, background: "var(--accent2-glow)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: 13, color: "var(--accent2)", fontWeight: 600 }}>✓ OTP sent to +91 {form.phone}</div>
              <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>Use 123456 for demo</div>
            </div>
            <div className="form-group">
              <label>Enter 6-digit OTP</label>
              <input
                placeholder="• • • • • •"
                maxLength={6}
                style={{ letterSpacing: 12, textAlign: "center", fontSize: 24, fontWeight: 700 }}
                value={form.otp}
                onChange={e => setForm({ ...form, otp: e.target.value.replace(/\D/g, "") })}
                onKeyDown={e => e.key === "Enter" && verifyOTP()}
              />
            </div>
            <button className="btn-primary" style={{ width: "100%", padding: "14px 24px", fontSize: 15 }} onClick={verifyOTP} disabled={loading}>
              {loading ? "Verifying..." : "Verify & Login ✓"}
            </button>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 13 }}>
              <span style={{ color: "var(--text2)", cursor: "pointer" }} onClick={() => setStep(1)}>← Change Number</span>
              <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }} onClick={sendOTP}>Resend OTP</span>
            </div>
          </div>
        )}
 
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