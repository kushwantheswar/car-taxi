import React, { useState, useEffect, useRef } from "react";
import { TierBadge, Avatar, Stars } from "../../components/ui/index.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix leaflet icon paths (common issue in React with Leaflet)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapRouting({ fromCoord, toCoord, onDistance }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!fromCoord || !toCoord) return;
    
    if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
    }
    
    routingControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(fromCoord.lat, fromCoord.lon),
        L.latLng(toCoord.lat, toCoord.lon)
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: { styles: [{ color: '#F5A623', weight: 5 }] }
    }).on('routesfound', function(e) {
      const summary = e.routes[0].summary;
      // summary.totalDistance is in meters
      onDistance(Number((summary.totalDistance / 1000).toFixed(1)));
    }).addTo(map);

    return () => {
        if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
        }
    };
  }, [fromCoord, toCoord, map, onDistance]);

  return null;
}

export default function PlaceOrder() {
  const { cars, addBooking, setBill, showNotification, fetchData, role } = useApp(); 
  
  const [step, setStep] = useState(1);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [ordered, setOrdered] = useState(null);
  
  const [form, setForm] = useState({
    from: "Vijayawada Station", 
    to: "PVP Mall", 
    date: new Date().toISOString().slice(0, 10), 
    time: "10:00", 
    notes: ""
  });

  const [fromCoord, setFromCoord] = useState({lat: 16.5062, lon: 80.6480}); // Vijayawada default
  const [toCoord, setToCoord] = useState({lat: 16.5126, lon: 80.6276}); 
  const [distanceKm, setDistanceKm] = useState(0);
  const [calculating, setCalculating] = useState(false);

  // Calculation Logic
  const dist = distanceKm || 5; 
  const amount = selected ? dist * (selected.price_per_km || 15) : 0; 
  const tax = Math.round(amount * 0.05);

  const geocodeAndRoute = async () => {
    if (!form.from || !form.to) return showNotification("Enter both addresses", "error");
    setCalculating(true);
    try {
        const fetchCoord = async (q) => {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + ', Andhra Pradesh')}`);
            const data = await res.json();
            if (data.length > 0) return { lat: data[0].lat, lon: data[0].lon };
            return null;
        };
        const cFrom = await fetchCoord(form.from);
        const cTo = await fetchCoord(form.to);
        
        if (!cFrom || !cTo) {
            setCalculating(false);
            return showNotification("Address not found. Please be specific.", "error");
        }
        setFromCoord(cFrom);
        setToCoord(cTo);
        setStep(2);
    } catch(e) {
        showNotification("Routing failed", "error");
    }
    setCalculating(false);
  };
  
  const availCars = (cars || []).filter(p => p.status === "available");
  const filtered = filter === "all" ? availCars
    : filter === "premium" ? availCars.filter(p => p.tier === "premium")
    : availCars.filter(p => p.tier === "standard");
 
  const confirmOrder = async () => {
    if (!selected) return;
    
    // User is logged in as the authenticated role
    // For our API, the Django Booking Model expects:
    // car (id), pickup_location, dropoff_location, distance_km, total_price, user (1)
    const booking = {
      user: 1, // Will be bound to req.user authentically, but sending 1 for admin tests if needed.
      car: selected.id,
      pickup_location: form.from, 
      dropoff_location: form.to,
      distance_km: dist,
      total_price: amount + tax + 30, // inclusive of tax and base fee
      status: "pending",
    };
    
    try {
      await addBooking(booking); 
      setOrdered({...booking, car_details: selected});
      fetchData(); // Propagate to Admin
      showNotification("Booking confirmed! A driver will be assigned soon.", "success");
    } catch(e) {}
  };
 
  // Ordered State View
  if (ordered) return (
    <div className="page">
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div className="card animate-in" style={{ padding: 36, textAlign: "center" }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 28, fontWeight: 700, color: "var(--accent2)", marginBottom: 8 }}>Ride Booked!</div>
          <div style={{ color: "var(--text2)", marginBottom: 28, fontSize: 14 }}>
            Pending driver acceptance.
          </div>
 
          <div className="driver-card" style={{ marginBottom: 20, textAlign: "left" }}>
            <Avatar name={ordered.car_details?.driver_name || "Driver"} size={50} /> 
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{ordered.car_details?.driver_name || "Unassigned"}</div>
              <div style={{ color: "var(--accent)", fontSize: 14, fontWeight: 600 }}>📞 +91 9999999999</div>
              <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>{ordered.car_details?.name}</div> 
            </div>
          </div>
 
          <div style={{ background: "var(--surface2)", borderRadius: 12, padding: 18, marginBottom: 20, textAlign: "left" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { l: "Pickup", v: form.from },
                { l: "Dropoff", v: form.to },
                { l: "Distance", v: `${dist} km` },
                { l: "Timestamp", v: `${form.date} · ${form.time}` },
                { l: "Total Est.", v: `₹${ordered.total_price}` },
              ].map(i => (
                <div key={i.l}>
                  <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{i.l}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{i.v}</div>
                </div>
              ))}
            </div>
          </div>
 
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setOrdered(null); setSelected(null); setStep(1); }}>Book Another</button>
            <button className="btn-success" style={{ flex: 1 }} onClick={() => setBill(ordered)}>📄 View Invoice</button>
          </div>
        </div>
      </div>
    </div>
  );
 
  return (
    <div className="page">
      <div style={{ marginBottom: 28 }} className="animate-in">
        <div style={{ fontFamily: "var(--font-head)", fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Book a Ride</div> 
        <div style={{ display: "flex", gap: 4 }}>
          {["Location & Map", "Choose Car", "Confirm"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, background: step === i + 1 ? "var(--accent-glow)" : step > i + 1 ? "rgba(16,185,129,0.1)" : "var(--surface2)", color: step === i + 1 ? "var(--accent)" : step > i + 1 ? "var(--accent2)" : "var(--text3)", border: `1px solid ${step === i + 1 ? "var(--accent)" : step > i + 1 ? "rgba(16,185,129,0.3)" : "var(--border)"}` }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: step > i + 1 ? "var(--accent2)" : step === i + 1 ? "var(--accent)" : "var(--surface3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: step >= i + 1 ? "#0A0E1A" : "var(--text3)" }}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                {s}
              </div>
              {i < 2 && <div style={{ width: 20, height: 1, background: step > i + 1 ? "var(--accent2)" : "var(--border)" }} />}
            </div>
          ))}
        </div>
      </div>
 
      {/* STEP 1 */}
      {step === 1 && (
        <div className="animate-in">
          <div className="card" style={{ padding: 28, marginBottom: 20 }}>
            <div className="section-title">📍 Ride Locations</div> 
            <div style={{ background: "var(--surface2)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--accent2)", flexShrink: 0, boxShadow: "0 0 0 3px rgba(16,185,129,0.2)" }} />
                  <div style={{ flex: 1 }}>
                    <input placeholder="Pickup: Vijayawada Station" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} />
                  </div>
                </div>
                <div style={{ width: 2, height: 20, background: "var(--border)", marginLeft: 5 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: "var(--danger)", flexShrink: 0, boxShadow: "0 0 0 3px rgba(239,68,68,0.2)" }} />
                  <div style={{ flex: 1 }}>
                    <input placeholder="Dropoff: PVP Mall" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* LEAFLET MAP ELEMENT */}
            <div style={{ height: 350, width: "100%", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", position: 'relative', zIndex: 1 }}>
                <MapContainer center={[16.5062, 80.6480]} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapRouting fromCoord={fromCoord} toCoord={toCoord} onDistance={setDistanceKm} />
                </MapContainer>
                {distanceKm > 0 && <div style={{position: 'absolute', top: 12, right: 12, background: 'var(--primary-card)', zIndex: 1000, padding: '8px 16px', borderRadius: 8, fontWeight: 700, border: '1px solid var(--accent)'}}>
                    📏 Route Distance: {distanceKm} km
                </div>}
            </div>
          </div>
          <button className="btn-primary" style={{ width: "100%", padding: "16px 24px", fontSize: 16 }} onClick={geocodeAndRoute} disabled={calculating}>
            {calculating ? "Locating on Map..." : "Calculate Route & Continue →"}
          </button>
        </div>
      )}
 
      {/* STEP 2 */}
      {step === 2 && (
        <div className="animate-in">
          <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer", marginBottom: 20, fontSize: 14, display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>← Back to Map</button>
 
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {[{ k: "all", l: "All Cars" }, { k: "standard", l: "Standard 4-Seater" }, { k: "premium", l: "★ Premium SUV" }].map(f => (
              <button key={f.k} onClick={() => setFilter(f.k)} style={{ padding: "8px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600, border: filter === f.k ? "1px solid var(--accent)" : "1px solid var(--border)", background: filter === f.k ? "var(--accent-glow)" : "var(--glass)", color: filter === f.k ? "var(--accent)" : "var(--text2)", cursor: "pointer", transition: "all 0.2s" }}>
                {f.l}
              </button>
            ))}
          </div>
 
          <div className="grid-auto" style={{ marginBottom: 100 }}>
            {filtered.map(car => (
              <div key={car.id} className="card car-card" style={{ border: selected?.id === car.id ? "2px solid var(--accent)" : "1px solid var(--border)" }} onClick={() => setSelected(car)}>
                <div className="car-img">
                  {car.image ? <img src={car.image} alt={car.name} /> : <div className="car-img-emoji">🚗</div>}
                  <div className="car-tier"><TierBadge tier={car.tier} /></div>
                  <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.7)", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700, color: "#fff" }}>{car.seats} Seats</div>
                </div>
                <div className="car-info">
                  <div className="car-name">{car.name}</div>
                  <div className="car-meta">Driver: {car.driver_name || "Standard Pool"}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                    <div className="car-price">₹{car.price_per_km}/km</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
 
          {selected && (
            <div style={{ position: "fixed", bottom: 24, left: "calc(var(--sidebar-w) + 32px)", right: 32, zIndex: 50 }}>
              <div className="card" style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--accent)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 28 }}>🚖</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{selected.name} selected</div>
                    <div style={{ fontSize: 13, color: "var(--text2)" }}>
                      {dist} km × ₹{selected.price_per_km} = ₹{amount}
                    </div>
                  </div>
                </div>
                <button className="btn-primary" style={{ fontSize: 15, padding: "12px 32px", whiteSpace: "nowrap" }} onClick={() => setStep(3)}>
                  Review & Confirm →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
 
      {/* STEP 3 */}
      {step === 3 && selected && (
        <div className="animate-in">
          <button onClick={() => setStep(2)} style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer", marginBottom: 20, fontSize: 14, fontWeight: 600 }}>← Back to Car Selection</button>
          <div style={{ maxWidth: 560 }}>
            <div className="card" style={{ padding: 28, marginBottom: 16 }}>
              <div className="section-title">📋 Ride Summary</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[{ l: "Pickup", v: form.from }, { l: "Dropoff", v: form.to }, { l: "Distance", v: `${dist} km` }, { l: "Estimated Time", v: "45 mins" }, { l: "Car", v: selected.name }].map(i => (
                  <div key={i.l} style={{ background: "var(--surface2)", borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{i.l}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{i.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                {[{ l: "Subtotal", v: `₹${amount}` }, { l: "GST (5%)", v: `₹${tax}` }, { l: "Base Fare", v: "₹30" }].map(r => (
                  <div key={r.l} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
                    <span style={{ color: "var(--text2)" }}>{r.l}</span>
                    <span style={{ fontWeight: 600 }}>{r.v}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800, borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 4 }}>
                  <span>Total</span>
                  <span style={{ color: "var(--accent)" }}>₹{amount + tax + 30}</span>
                </div>
              </div>
            </div>
            <button className="btn-primary" style={{ width: "100%", padding: "16px 24px", fontSize: 16 }} onClick={confirmOrder}>
              ✓ Submit Booking — ₹{amount + tax + 30}
            </button>
            <div style={{ fontSize: 12, color: "var(--text3)", textAlign: "center", marginTop: 10 }}>Driver will confirm shortly · Credit/UPI/Cash accepted</div>
          </div>
        </div>
      )}
    </div>
  );
}