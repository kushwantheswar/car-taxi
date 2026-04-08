import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Avatar, TierBadge } from "../../components/ui"; // Reusing existing UI components

export default function InventoryManagement() {
  const { products, addProduct, removeProduct, updateProductStatus, showNotification } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "", sku: "", supplier: "", tier: "standard" });

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      showNotification("Please fill required fields", "error");
      return;
    }
    
    addProduct({
      name: newProduct.name,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock) || 0,
      sku: newProduct.sku,
      supplier: newProduct.supplier || "Unknown",
      tier: newProduct.tier,
      emoji: "📦", // Default emoji
      image: "", // Can add image upload later
      type: "Standard",
      year: 2024,
      status: "available"
    });

    showNotification("Product added successfully", "success");
    setShowAddModal(false);
    setNewProduct({ name: "", price: "", stock: "", sku: "", supplier: "", tier: "standard" });
  };

  return (
    <div className="page animate-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 26, fontWeight: 700 }}>Inventory Management</div>
          <div style={{ color: "var(--text2)", fontSize: 14 }}>Manage your product stock and suppliers</div>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          + Add New Product
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid3" style={{ marginBottom: 24 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 12, color: "var(--text2)", fontWeight: 700, textTransform: "uppercase" }}>Total Products</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "var(--text)", marginTop: 8 }}>{products.length}</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 12, color: "var(--text2)", fontWeight: 700, textTransform: "uppercase" }}>Total Value</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "var(--accent2)", marginTop: 8 }}>
            ₹{(products.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0) / 1000).toFixed(0)}K
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 12, color: "var(--text2)", fontWeight: 700, textTransform: "uppercase" }}>Low Stock Items</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "var(--danger)", marginTop: 8 }}>
            {products.filter(p => (p.stock || 0) < 10).length}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid-auto">
        {products.map((product) => (
          <div key={product.id} className="card car-card">
            <div className="car-img" style={{ height: 160 }}>
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="car-img-emoji">{product.emoji || "📦"}</div>
              )}
              <div className="car-tier"><TierBadge tier={product.tier} /></div>
              <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.7)", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                SKU: {product.sku}
              </div>
            </div>
            <div className="car-info">
              <div className="car-name">{product.name}</div>
              <div className="car-meta">Supplier: {product.supplier} • {product.year}</div>
              
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>Price</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--accent)" }}>₹{product.price}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>Stock</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: product.stock > 0 ? "var(--accent2)" : "var(--danger)" }}>
                    {product.stock}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button 
                  className="btn-secondary" 
                  style={{ flex: 1, fontSize: 12, padding: 8 }}
                  onClick={() => updateProductStatus(product.id, product.status === "available" ? "on_order" : "available")}
                >
                  {product.status === "available" ? "Mark Unavailable" : "Mark Available"}
                </button>
                <button 
                  className="btn-danger" 
                  style={{ padding: 8 }}
                  onClick={() => {
                    if(confirm("Are you sure you want to remove this product?")) {
                      removeProduct(product.id);
                      showNotification("Product removed", "success");
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

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div className="modal-title">Add New Product</div>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", color: "var(--text2)", fontSize: 20 }}>×</button>
            </div>
            
            <form onSubmit={handleAddProduct}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input 
                    placeholder="e.g. Brake Pad Set" 
                    value={newProduct.name} 
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>SKU Code</label>
                  <input 
                    placeholder="e.g. BP-001" 
                    value={newProduct.sku} 
                    onChange={e => setNewProduct({...newProduct, sku: e.target.value})} 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input 
                    type="number" 
                    placeholder="1500" 
                    value={newProduct.price} 
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>Initial Stock</label>
                  <input 
                    type="number" 
                    placeholder="50" 
                    value={newProduct.stock} 
                    onChange={e => setNewProduct({...newProduct, stock: e.target.value})} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Supplier Name</label>
                <input 
                  placeholder="e.g. Global Parts" 
                  value={newProduct.supplier} 
                  onChange={e => setNewProduct({...newProduct, supplier: e.target.value})} 
                />
              </div>

              <div className="form-group">
                <label>Tier</label>
                <select value={newProduct.tier} onChange={e => setNewProduct({...newProduct, tier: e.target.value})}>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}