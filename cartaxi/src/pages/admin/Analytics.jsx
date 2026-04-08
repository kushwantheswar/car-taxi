// ─── ANALYTICS PAGE ────────────────────────────────────────────────────────────
export function AnalyticsPage() {
  // FIX: Updated context variables to match Dealer System
  const { orders, products, suppliers } = useApp(); 
  
  const totalRevenue = REVENUE_DATA.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = REVENUE_DATA.reduce((s, d) => s + (d.bookings || 0), 0); // Kept 'bookings' key for data compatibility, labeled as Orders
  const totalUnits = REVENUE_DATA.reduce((s, d) => s + (d.km || 0), 0); // Kept 'km' key for data compatibility, labeled as Units
 
  const BarChart = ({ data }) => {
    const max = Math.max(...data.map(d => d.revenue));
    return (
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 140, padding: "0 8px" }}>
        {data.map((d, i) => (
          <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700 }}>₹{(d.revenue / 1000).toFixed(0)}K</div>
            <div style={{ width: "100%", height: `${(d.revenue / max) * 100}%`, background: i === data.length - 1 ? "var(--accent)" : "var(--surface3)", borderRadius: "4px 4px 0 0", transition: "height 0.8s ease", minHeight: 8, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, transparent, rgba(255,255,255,0.08))" }} />
            </div>
            <div style={{ fontSize: 11, color: "var(--text2)" }}>{d.month}</div>
          </div>
        ))}
      </div>
    );
  };
 
  return (
    <div className="page">
      <div style={{ fontFamily: "var(--font-head)", fontSize: 26, fontWeight: 700, marginBottom: 8 }} className="animate-in">Analytics</div>
      <div style={{ color: "var(--text2)", fontSize: 14, marginBottom: 28 }} className="animate-in delay-1">Performance overview — last 6 months</div>
 
      <div className="grid3" style={{ marginBottom: 24 }}>
        {[
          { l: "Total Revenue", v: `₹${(totalRevenue / 1000).toFixed(0)}K`, sub: "+12% vs last period", c: "var(--accent)" },
          { l: "Total Orders", v: totalOrders, sub: "Avg 33/day", c: "var(--accent2)" }, // Updated Label
          { l: "Units Sold", v: totalUnits.toLocaleString(), sub: "Across all products", c: "#60A5FA" }, // Updated Label
        ].map((s, i) => (
          <div key={s.l} className={`card stat-card animate-in delay-${i + 1}`} style={{ padding: 24 }}>
            <div style={{ fontSize: 11, color: "var(--text2)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.l}</div>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 36, fontWeight: 700, color: s.c, margin: "8px 0", letterSpacing: "-1px" }}>{s.v}</div>
            <div style={{ fontSize: 12, color: "var(--accent2)" }}>↑ {s.sub}</div>
          </div>
        ))}
      </div>
 
      <div className="grid2" style={{ marginBottom: 24 }}>
        <div className="card animate-in delay-2" style={{ padding: 24 }}>
          <div className="section-title">Monthly Revenue</div>
          <BarChart data={REVENUE_DATA} />
        </div>
        <div className="card animate-in delay-3" style={{ padding: 24 }}>
          <div className="section-title">Order Status Distribution</div> {/* Updated Label */}
          {["completed", "active", "pending", "cancelled"].map(s => {
            const count = orders.filter(o => o.status === s).length; // Updated bookings -> orders
            const pct = orders.length ? Math.round((count / orders.length) * 100) : 0; // Updated bookings -> orders
            const colors = { completed: "var(--accent2)", active: "#60A5FA", pending: "var(--accent)", cancelled: "var(--danger)" };
            return (
              <div key={s} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span style={{ textTransform: "capitalize", fontWeight: 500 }}>{s}</span>
                  <span style={{ color: colors[s], fontWeight: 700 }}>{count} ({pct}%)</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "var(--surface3)", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: colors[s], borderRadius: 4, transition: "width 1s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
 
      <div className="card animate-in delay-3" style={{ padding: 24 }}>
        <div className="section-title">Top Performing Products</div> {/* Updated Label */}
        <div className="table-wrap">
          <table>
            <thead><tr><th>Product</th><th>Tier</th><th>Supplier</th><th>Price/Unit</th><th>Sold</th></tr></thead> {/* Updated Headers */}
            <tbody>
              {products.slice(0, 5).map((p, i) => ( // Updated cars -> products
                <tr key={p.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 44, height: 36, borderRadius: 6, overflow: "hidden", background: "var(--surface2)", flexShrink: 0 }}>
                        {p.image ? <img src={p.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 18 }}>{p.emoji}</div>}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                    </div>
                  </td>
                  <td>{p.tier}</td>
                  <td>{p.supplier}</td> {/* Updated driver -> supplier */}
                  <td style={{ fontWeight: 700, color: "var(--accent)" }}>₹{p.price}</td> {/* Updated pricePerKm -> price */}
                  <td>
                    <div style={{ height: 6, width: 80, borderRadius: 4, background: "var(--surface3)", overflow: "hidden" }}>
                      <div style={{ width: `${90 - i * 12}%`, height: "100%", background: "var(--accent)", borderRadius: 4 }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}