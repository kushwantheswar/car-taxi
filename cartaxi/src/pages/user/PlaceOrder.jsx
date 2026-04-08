import React, { useState, useEffect, useRef, useCallback } from "react";
import { TierBadge, Avatar } from "../../components/ui/index.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Address Autocomplete Input ────────────────────────────────────────────────
function AddressInput({ label, value, onChange, onSelect, icon, color }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  const search = useCallback(async (q) => {
    if (q.length < 3) { setSuggestions([]); setOpen(false); return; }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=6&addressdetails=1`);
      const data = await res.json();
      setSuggestions(data);
      setOpen(data.length > 0);
    } catch { setSuggestions([]); }
  }, []);

  const handleChange = (e) => {
    onChange(e.target.value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(e.target.value), 400);
  };

  const handleSelect = (item) => {
    onChange(item.display_name);
    onSelect({ lat: parseFloat(item.lat), lon: parseFloat(item.lon), name: item.display_name });
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface2)', borderRadius: 10, padding: '0 14px', border: '1.5px solid var(--border)' }}>
        <div style={{ width: 10, height: 10, borderRadius: color === 'green' ? '50%' : 3, background: color === 'green' ? 'var(--accent2)' : 'var(--danger)', flexShrink: 0 }} />
        <input
          placeholder={label}
          value={value}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          style={{ border: 'none', background: 'transparent', padding: '13px 0', flex: 1, fontSize: 14 }}
        />
        {value && <span style={{ cursor: 'pointer', color: 'var(--text3)', fontSize: 18 }} onClick={() => { onChange(''); setSuggestions([]); }}>×</span>}
      </div>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--primary-card)', border: '1px solid var(--border)', borderRadius: 10, zIndex: 9999, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', overflow: 'hidden', marginTop: 4 }}>
          {suggestions.map((s, i) => (
            <div key={i} onMouseDown={() => handleSelect(s)}
              style={{ padding: '11px 16px', cursor: 'pointer', fontSize: 13, borderBottom: i < suggestions.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ fontWeight: 600, color: 'var(--text)' }}>{s.display_name.split(',')[0]}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{s.display_name.split(',').slice(1, 3).join(',')}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Routing Component ─────────────────────────────────────────────────────────
function MapRouting({ fromCoord, toCoord, onResult }) {
  const map = useMap();
  const routingRef = useRef(null);

  useEffect(() => {
    if (!fromCoord || !toCoord) return;
    if (routingRef.current) { try { map.removeControl(routingRef.current); } catch {} }

    routingRef.current = L.Routing.control({
      waypoints: [L.latLng(fromCoord.lat, fromCoord.lon), L.latLng(toCoord.lat, toCoord.lon)],
      routeWhileDragging: false, addWaypoints: false, fitSelectedRoutes: true, showAlternatives: false,
      lineOptions: { styles: [{ color: '#F5A623', weight: 5, opacity: 0.9 }] },
      createMarker: () => null, // hide default markers, we use our own
    }).on('routesfound', (e) => {
      const r = e.routes[0].summary;
      onResult({
        distanceKm: parseFloat((r.totalDistance / 1000).toFixed(1)),
        timeMin: Math.round(r.totalTime / 60),
      });
    }).addTo(map);

    return () => { if (routingRef.current) { try { map.removeControl(routingRef.current); } catch {} } };
  }, [fromCoord, toCoord]);

  return (
    <>
      {fromCoord && <Marker position={[fromCoord.lat, fromCoord.lon]}><Popup>Pickup</Popup></Marker>}
      {toCoord && <Marker position={[toCoord.lat, toCoord.lon]}><Popup>Drop-off</Popup></Marker>}
    </>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PlaceOrder() {
  const { cars, addBooking, setBill, showNotification, fetchData } = useApp();

  const [step, setStep] = useState(1);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [ordered, setOrdered] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [fromText, setFromText] = useState("");
  const [toText, setToText]   = useState("");
  const [fromCoord, setFromCoord] = useState(null);
  const [toCoord,   setToCoord]   = useState(null);
  const [routeInfo, setRouteInfo] = useState(null); // { distanceKm, timeMin }

  const dist   = routeInfo?.distanceKm || 0;
  const timeMin = routeInfo?.timeMin   || 0;
  const amount = selected ? Math.round(dist * (selected.price_per_km || 15)) : 0;
  const tax    = Math.round(amount * 0.05);
  const total  = amount + tax + 30;

  const availCars = (cars || []).filter(c => c.status === "available");
  const filtered  = filter === "all" ? availCars
    : filter === "premium" ? availCars.filter(c => c.tier === "premium")
    : filter === "luxury"  ? availCars.filter(c => c.tier === "luxury")
    : availCars.filter(c => c.tier === "standard");

  const goToCarSelect = () => {
    if (!fromCoord || !toCoord) { showNotification("Please choose pickup & dropoff from suggestions", "error"); return; }
    if (dist === 0) { showNotification("Waiting for route calculation...", "warning"); return; }
    setStep(2);
  };

  const confirmOrder = async () => {
    if (!selected || !currentUser) return;
    setSubmitting(true);
    const booking = {
      user: currentUser.id,
      car: selected.id,
      pickup_location: fromText,
      dropoff_location: toText,
      distance_km: dist,
      total_price: total,
      status: "pending",
    };
    const result = await addBooking(booking);
    if (result) {
      setOrdered({ ...booking, car_details: selected, timeMin });
      fetchData();
    }
    setSubmitting(false);
  };

  const mapCenter = fromCoord ? [fromCoord.lat, fromCoord.lon] : [16.5062, 80.6480];

  // ── Success Screen ────────────────────────────────────────────────────────
  if (ordered) return (
    <div className="page">
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div className="card animate-in" style={{ padding: 36, textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 26, fontWeight: 700, color: "var(--accent2)", marginBottom: 6 }}>Ride Booked!</div>
          <div style={{ color: "var(--text2)", marginBottom: 28, fontSize: 14 }}>A driver will be assigned shortly.</div>

          <div style={{ background: "var(--surface2)", borderRadius: 12, padding: 20, marginBottom: 20, textAlign: "left" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { l: "Pickup", v: fromText.split(',')[0] },
                { l: "Dropoff", v: toText.split(',')[0] },
                { l: "Distance", v: `${dist} km` },
                { l: "Est. Time", v: `${timeMin} min` },
                { l: "Car", v: ordered.car_details?.name },
                { l: "Total Fare", v: `₹${total}` },
              ].map(i => (
                <div key={i.l}>
                  <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>{i.l}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 3 }}>{i.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setOrdered(null); setSelected(null); setStep(1); setRouteInfo(null); setFromText(''); setToText(''); setFromCoord(null); setToCoord(null); }}>
              Book Another
            </button>
            <button className="btn-success" style={{ flex: 1 }} onClick={() => setBill(ordered)}>📄 Invoice</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page">
      {/* ── Step Indicator ── */}
      <div style={{ marginBottom: 24 }} className="animate-in">
        <div style={{ fontFamily: "var(--font-head)", fontSize: 24, fontWeight: 700, marginBottom: 14 }}>Book a Ride</div>
        <div style={{ display: "flex", gap: 4 }}>
          {["Location & Route", "Choose Car", "Confirm & Pay"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: step === i+1 ? "var(--accent-glow)" : step > i+1 ? "rgba(16,185,129,0.1)" : "var(--surface2)", color: step === i+1 ? "var(--accent)" : step > i+1 ? "var(--accent2)" : "var(--text3)", border: `1px solid ${step === i+1 ? "var(--accent)" : step > i+1 ? "rgba(16,185,129,0.3)" : "var(--border)"}` }}>
                <div style={{ width: 17, height: 17, borderRadius: "50%", background: step > i+1 ? "var(--accent2)" : step === i+1 ? "var(--accent)" : "var(--surface3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: step >= i+1 ? "#0A0E1A" : "var(--text3)" }}>
                  {step > i+1 ? "✓" : i+1}
                </div>
                {s}
              </div>
              {i < 2 && <div style={{ width: 16, height: 1, background: step > i+1 ? "var(--accent2)" : "var(--border)" }} />}
            </div>
          ))}
        </div>
      </div>

      {/* ── STEP 1: Location & Map ── */}
      {step === 1 && (
        <div className="animate-in">
          <div className="grid2" style={{ gap: 20 }}>
            {/* Left: inputs + info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="card" style={{ padding: 20 }}>
                <div className="section-title" style={{ marginBottom: 14 }}>📍 Where are you going?</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <AddressInput label="Pickup location..." value={fromText} onChange={setFromText} onSelect={setFromCoord} color="green" />
                  <div style={{ width: 2, height: 12, background: 'var(--border)', marginLeft: 19 }} />
                  <AddressInput label="Drop-off location..." value={toText} onChange={setToText} onSelect={setToCoord} color="red" />
                </div>
              </div>

              {routeInfo && (
                <div className="card animate-in" style={{ padding: 20, border: '1px solid var(--accent)', display: 'flex', gap: 20 }}>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Distance</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-head)' }}>{dist} km</div>
                  </div>
                  <div style={{ width: 1, background: 'var(--border)' }} />
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Est. Time</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent2)', fontFamily: 'var(--font-head)' }}>{timeMin} min</div>
                  </div>
                </div>
              )}

              {!routeInfo && fromCoord && toCoord && (
                <div style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 13, padding: 12 }}>⏳ Calculating route...</div>
              )}

              <button className="btn-primary" style={{ padding: "14px 24px", fontSize: 15 }} onClick={goToCarSelect}>
                {routeInfo ? `Continue — ${dist} km →` : "Find Route & Continue →"}
              </button>
            </div>

            {/* Right: map */}
            <div style={{ height: 420, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
              <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={true}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                />
                <MapRouting fromCoord={fromCoord} toCoord={toCoord} onResult={setRouteInfo} />
              </MapContainer>
              {!fromCoord && !toCoord && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '10px 20px', borderRadius: 8, fontSize: 13, pointerEvents: 'none', zIndex: 500, textAlign: 'center' }}>
                  Type an address above to see the route
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Car Selection ── */}
      {step === 2 && (
        <div className="animate-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>← Back</button>
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="card" style={{ padding: '8px 16px', fontSize: 13, fontWeight: 700 }}>📏 {dist} km</div>
              <div className="card" style={{ padding: '8px 16px', fontSize: 13, fontWeight: 700 }}>⏱ {timeMin} min</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {[{ k: "all", l: "All Cars" }, { k: "standard", l: "🚗 Standard" }, { k: "premium", l: "⭐ Premium" }, { k: "luxury", l: "💎 Luxury" }].map(f => (
              <button key={f.k} onClick={() => setFilter(f.k)} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: filter === f.k ? "1px solid var(--accent)" : "1px solid var(--border)", background: filter === f.k ? "var(--accent-glow)" : "var(--glass)", color: filter === f.k ? "var(--accent)" : "var(--text2)", cursor: "pointer" }}>
                {f.l}
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🚗</div>
              <div>No cars available in this category.</div>
              <div style={{ fontSize: 12, marginTop: 6 }}>Try a different filter or check back later.</div>
            </div>
          )}

          <div className="grid-auto" style={{ marginBottom: 100 }}>
            {filtered.map(car => {
              const carDist = dist || 5;
              const carAmt = Math.round(carDist * (car.price_per_km || 15));
              return (
                <div key={car.id} className="card car-card" onClick={() => setSelected(car)}
                  style={{ border: selected?.id === car.id ? "2px solid var(--accent)" : "1px solid var(--border)", cursor: 'pointer', transition: 'border 0.2s, box-shadow 0.2s', boxShadow: selected?.id === car.id ? '0 0 0 3px var(--accent-glow)' : '' }}>
                  <div className="car-img">
                    {car.image
                      ? <><img src={car.image} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /><div className="car-img-overlay" /></>
                      : <div className="car-img-emoji">🚗</div>}
                    <div className="car-tier"><TierBadge tier={car.tier} /></div>
                    <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.7)", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700, color: "#fff" }}>
                      {car.seats} Seats
                    </div>
                  </div>
                  <div className="car-info">
                    <div className="car-name">{car.name}</div>
                    <div className="car-meta">{car.driver_name ? `Driver: ${car.driver_name}` : "Pool Driver"}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                      <div style={{ fontSize: 12, color: 'var(--text2)' }}>₹{car.price_per_km}/km</div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--accent)' }}>₹{carAmt}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selected && (
            <div style={{ position: "fixed", bottom: 24, left: "calc(var(--sidebar-w) + 32px)", right: 32, zIndex: 50 }}>
              <div className="card" style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--accent)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 26 }}>🚖</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{selected.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text2)" }}>{dist} km · {timeMin} min · ₹{amount} + 5% tax</div>
                  </div>
                </div>
                <button className="btn-primary" style={{ fontSize: 14, padding: "11px 28px" }} onClick={() => setStep(3)}>
                  Review & Pay →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 3: Confirm ── */}
      {step === 3 && selected && (
        <div className="animate-in">
          <button onClick={() => setStep(2)} style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer", marginBottom: 20, fontSize: 14, fontWeight: 600 }}>← Back to Car Selection</button>
          <div style={{ maxWidth: 560 }}>
            <div className="card" style={{ padding: 28, marginBottom: 16 }}>
              <div className="section-title">📋 Trip Summary</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { l: "Pickup", v: fromText.split(',')[0] },
                  { l: "Dropoff", v: toText.split(',')[0] },
                  { l: "Distance", v: `${dist} km` },
                  { l: "Est. Travel Time", v: `${timeMin} minutes` },
                  { l: "Car", v: selected.name },
                  { l: "Tier", v: selected.tier?.charAt(0).toUpperCase() + selected.tier?.slice(1) },
                ].map(i => (
                  <div key={i.l} style={{ background: "var(--surface2)", borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{i.l}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{i.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                {[{ l: "Ride Fare", v: `₹${amount}` }, { l: "GST (5%)", v: `₹${tax}` }, { l: "Base Fee", v: "₹30" }].map(r => (
                  <div key={r.l} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
                    <span style={{ color: "var(--text2)" }}>{r.l}</span>
                    <span style={{ fontWeight: 600 }}>{r.v}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 800, borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 4 }}>
                  <span>Total</span>
                  <span style={{ color: "var(--accent)" }}>₹{total}</span>
                </div>
              </div>
            </div>
            <button className="btn-primary" style={{ width: "100%", padding: "16px 24px", fontSize: 16 }} onClick={confirmOrder} disabled={submitting}>
              {submitting ? "Submitting booking..." : `✓ Confirm Booking — ₹${total}`}
            </button>
            <div style={{ fontSize: 12, color: "var(--text3)", textAlign: "center", marginTop: 10 }}>Driver confirms shortly · Pay by Cash, UPI, or Card</div>
          </div>
        </div>
      )}
    </div>
  );
}