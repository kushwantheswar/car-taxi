import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Avatar, TierBadge } from "../../components/ui";

export default function FleetManagement() {
  const { cars, addCar, removeCar, updateCarStatus, showNotification } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCar, setNewCar] = useState({ name: "", pricePerKm: "", type: "standard", driver: "", driverPhone: "", tier: "standard" });

  const handleAddCar = (e) => {
    e.preventDefault();
    if (!newCar.name || !newCar.pricePerKm) {
      showNotification("Please fill required fields", "error");
      return;
    }
    
    addCar({
      name: newCar.name,
      pricePerKm: Number(newCar.pricePerKm),
      type: newCar.type,
      tier: newCar.tier,
      driver: newCar.driver || "TBD",
      driverPhone: newCar.driverPhone,
      driverRating: 5.0,
      emoji: "🚗",
      image: "",
      year: 2024,
      status: "available"
    });

    showNotification("Car added successfully", "success");
    setShowAddModal(false);
    setNewCar({ name: "", pricePerKm: "", type: "standard", driver: "", driverPhone: "", tier: "standard" });
  };

  return (
    <div className="page animate-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 26, fontWeight: 700 }}>Fleet Management</div>
          <div style={{ color: "var(--text2)", fontSize: 14 }}>Manage your taxi fleet and drivers</div>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          + Add New Car
        </button>
      </div>

      <div className="grid-auto">
        {cars.map((car) => (
          <div key={car.id} className="card car-card">
            <div className="car-img" style={{ height: 160 }}>
              {car.image ? <img src={car.image} alt={car.name} /> : <div className="car-img-emoji">{car.emoji}</div>}
              <div className="car-tier"><TierBadge tier={car.tier} /></div>
              <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.7)", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                {car.plate}
              </div>
            </div>
            <div className="car-info">
              <div className="car-name">{car.name}</div>
              <div className="car-meta">{car.type} • {car.fuel} • {car.year}</div>
              
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>Rate</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--accent)" }}>₹{car.pricePerKm}/km</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>Status</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: car.status === "available" ? "var(--accent2)" : "var(--danger)" }}>
                    {car.status}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button 
                  className="btn-secondary" 
                  style={{ flex: 1, fontSize: 12, padding: 8 }}
                  onClick={() => updateCarStatus(car.id, car.status === "available" ? "on_trip" : "available")}
                >
                  {car.status === "available" ? "Set Unavailable" : "Set Available"}
                </button>
                <button 
                  className="btn-danger" 
                  style={{ padding: 8 }}
                  onClick={() => {
                    if(confirm("Are you sure?")) {
                      removeCar(car.id);
                      showNotification("Car removed", "success");
                    }
                  }}
                >
                  🗑
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div className="modal-title">Add New Car</div>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", color: "var(--text2)", fontSize: 20 }}>×</button>
            </div>
            <form onSubmit={handleAddCar}>
               <div className="form-group">
                <label>Car Name</label>
                <input placeholder="e.g. Maruti Swift" value={newCar.name} onChange={e => setNewCar({...newCar, name: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price Per Km (₹)</label>
                  <input type="number" placeholder="12" value={newCar.pricePerKm} onChange={e => setNewCar({...newCar, pricePerKm: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select value={newCar.type} onChange={e => setNewCar({...newCar, type: e.target.value})}>
                    <option value="4-seater">4 Seater</option>
                    <option value="6-seater">6 Seater</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: 20 }}>Add Car</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}