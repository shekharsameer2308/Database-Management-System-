import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, AreaChart, Area
} from 'recharts';
import { 
  LayoutDashboard, Package, TrendingUp, AlertTriangle, Truck, 
  RefreshCw, CheckCircle2, Factory, Search, ChevronRight, MapPin, 
  ShieldAlert, Send, Award, Activity, Ship, Navigation, ClipboardCheck,
  Thermometer, ShieldX, Archive
} from 'lucide-react';
import './index.css';

// Cyber-glow Gradient Cells
const NEON_COLORS = ['#6366f1', '#06b6d4', '#d946ef', '#10b981', '#f59e0b', '#f43f5e'];

function App() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState('overview'); // overview, inventory, logistics

  // Live Database Datasets
  const [inventory, setInventory] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  const [topSuppliers, setTopSuppliers] = useState([]);
  const [emissions, setEmissions] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  
  // Expanded/Additional Modules Datasets
  const [shipments, setShipments] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  // Stored Procedure: Supplier Performance Scoring States
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [selectedSupplierPerformance, setSelectedSupplierPerformance] = useState([]);

  // UI Interactive States
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', isError: false });

  // Restock Form State
  const [replenishForm, setReplenishForm] = useState({
    materialId: '1',
    supplierId: '1',
    quantity: '',
    unitPrice: ''
  });

  // Pull all live data from local database
  const fetchSCMCommandData = async () => {
    setLoading(true);
    try {
      const [invRes, supTopRes, emRes, forRes, alertsRes, supsListRes, shipsRes, whsRes] = await Promise.all([
        fetch('http://localhost:5000/api/inventory').then(r => r.json()),
        fetch('http://localhost:5000/api/suppliers/top').then(r => r.json()),
        fetch('http://localhost:5000/api/emissions').then(r => r.json()),
        fetch('http://localhost:5000/api/forecasting').then(r => r.json()),
        fetch('http://localhost:5000/api/alerts/low-stock').then(r => r.json()),
        fetch('http://localhost:5000/api/suppliers').then(r => r.json()),
        fetch('http://localhost:5000/api/shipments').then(r => r.json()),
        fetch('http://localhost:5000/api/warehouses').then(r => r.json())
      ]);

      if (invRes.error || supTopRes.error || emRes.error || forRes.error) {
        throw new Error("Unable to fetch custom database. Invoking simulated sandbox data.");
      }

      setInventory(invRes);
      setTopSuppliers(supTopRes);
      setEmissions(emRes);
      setForecast(forRes);
      setLowStockAlerts(alertsRes || []);
      setSuppliersList(supsListRes || []);
      setShipments(shipsRes || []);
      setWarehouses(whsRes || []);

      // Auto-select first supplier for evaluation procedure
      if (supsListRes && supsListRes.length > 0 && !selectedSupplierId) {
        setSelectedSupplierId(supsListRes[0].Supplier_ID.toString());
      }
    } catch (err) {
      console.warn("Express backend offline. Emulating cyber-glow sandbox environment:", err);
      showToast("Backend Server Offline: Emulating Obsidian SCM Command Center", true);
      
      // Sandbox fallback data incorporating expanded chemical inputs
      setInventory([
        { Material_ID: 1, Material_Name: 'Ammonia', Current_Stock: 350, Unit: 'Tons', Cost_Per_Unit: 500.00 },
        { Material_ID: 2, Material_Name: 'Urea', Current_Stock: 300, Unit: 'Tons', Cost_Per_Unit: 300.00 },
        { Material_ID: 3, Material_Name: 'Sulfuric Acid', Current_Stock: 5000, Unit: 'Liters', Cost_Per_Unit: 1.50 },
        { Material_ID: 4, Material_Name: 'Potash', Current_Stock: 90, Unit: 'Tons', Cost_Per_Unit: 400.00 },
        { Material_ID: 5, Material_Name: 'Phosphate', Current_Stock: 310, Unit: 'Tons', Cost_Per_Unit: 350.00 },
        { Material_ID: 6, Material_Name: 'Ammonium Nitrate', Current_Stock: 75, Unit: 'Tons', Cost_Per_Unit: 600.00 }
      ]);
      setTopSuppliers([
        { Supplier_Name: 'AgroChem Global', Total_Orders: 45 },
        { Supplier_Name: 'Nitrogen Sources Ltd', Total_Orders: 32 },
        { Supplier_Name: 'BioFarm Organic Corp', Total_Orders: 18 },
        { Supplier_Name: 'PhosMinerals Inc', Total_Orders: 10 }
      ]);
      setEmissions([
        { Transport_Mode: 'Truck', Total_CO2: 1250 },
        { Transport_Mode: 'Train', Total_CO2: 450 },
        { Transport_Mode: 'Ship', Total_CO2: 2020 }
      ]);
      setForecast([
        { Product_Name: 'Fertilizer A (High Nitrogen)', Predicted_Demand: 500 },
        { Product_Name: 'Fertilizer B (Balanced NPK)', Predicted_Demand: 350 },
        { Product_Name: 'Fertilizer C (Organic Supergrow)', Predicted_Demand: 480 },
        { Product_Name: 'Fertilizer D (Phosphate Max)', Predicted_Demand: 290 }
      ]);
      setLowStockAlerts([
        { Material_ID: 4, Material_Name: 'Potash', Current_Stock: 90, Unit: 'Tons' },
        { Material_ID: 6, Material_Name: 'Ammonium Nitrate', Current_Stock: 75, Unit: 'Tons' }
      ]);
      setSuppliersList([
        { Supplier_ID: 1, Supplier_Name: 'AgroChem Global' },
        { Supplier_ID: 2, Supplier_Name: 'Nitrogen Sources Ltd' },
        { Supplier_ID: 3, Supplier_Name: 'BioFarm Organic Corp' },
        { Supplier_ID: 4, Supplier_Name: 'PhosMinerals Inc' }
      ]);
      setShipments([
        { Shipment_ID: 101, Status: 'In Transit', Shipment_Date: '2026-05-28', Transport_Mode: 'Ship', Distance_km: 2300, Estimated_CO2_kg: 1100 },
        { Shipment_ID: 102, Status: 'Pending', Shipment_Date: '2026-05-29', Transport_Mode: 'Truck', Distance_km: 450, Estimated_CO2_kg: 320 },
        { Shipment_ID: 103, Status: 'Delivered', Shipment_Date: '2026-05-26', Transport_Mode: 'Train', Distance_km: 1200, Estimated_CO2_kg: 450 }
      ]);
      setWarehouses([
        { Warehouse_ID: 1, Warehouse_Name: 'Main Hub TX', Location: 'Texas', Capacity: 10000, Inspection_Date: '2026-05-10', Inspector_Name: 'Inspector James', Passed_Inspection: 1, Notes: 'All safety measures fully met.' },
        { Warehouse_ID: 2, Warehouse_Name: 'East Coast Storage', Location: 'New Jersey', Capacity: 5000, Inspection_Date: '2026-05-12', Inspector_Name: 'Inspector Sarah', Passed_Inspection: 1, Notes: 'Ventilation upgrades completed.' },
        { Warehouse_ID: 3, Warehouse_Name: 'West Coast Depot', Location: 'California', Capacity: 8000, Inspection_Date: '2026-05-15', Inspector_Name: 'Inspector James', Passed_Inspection: 1, Notes: 'Safety standards fully approved.' },
        { Warehouse_ID: 4, Warehouse_Name: 'North Supply Hub', Location: 'Illinois', Capacity: 6000, Inspection_Date: '2026-05-18', Inspector_Name: 'Inspector Sarah', Passed_Inspection: 0, Notes: 'Leakage in ventilation line.' }
      ]);
      setSelectedSupplierId('1');
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  };

  // Run Stored Procedure GetSupplierPerformanceSummary when supplier dropdown select triggers
  useEffect(() => {
    if (!selectedSupplierId) return;

    const querySupplierPerformance = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/suppliers/performance/${selectedSupplierId}`);
        const data = await res.json();
        if (data.error) throw new Error();
        setSelectedSupplierPerformance(data || []);
      } catch (err) {
        // Mock fallback scores
        const mockMap = {
          '1': { Supplier_Name: 'AgroChem Global', Evaluation_Date: '2026-05-01', On_Time_Delivery_Rate: 98.5, Overall_Score: 96.75 },
          '2': { Supplier_Name: 'Nitrogen Sources Ltd', Evaluation_Date: '2026-05-01', On_Time_Delivery_Rate: 85.0, Overall_Score: 87.50 },
          '3': { Supplier_Name: 'BioFarm Organic Corp', Evaluation_Date: '2026-05-01', On_Time_Delivery_Rate: 99.0, Overall_Score: 98.00 },
          '4': { Supplier_Name: 'PhosMinerals Inc', Evaluation_Date: '2026-05-01', On_Time_Delivery_Rate: 92.5, Overall_Score: 90.25 }
        };
        setSelectedSupplierPerformance([mockMap[selectedSupplierId] || mockMap['1']]);
      }
    };

    querySupplierPerformance();
  }, [selectedSupplierId, inventory]);

  useEffect(() => {
    fetchSCMCommandData();
  }, []);

  // UI Toast banner trigger
  const showToast = (message, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast({ show: false, message: '', isError: false }), 4000);
  };

  // Restock PO dispatch
  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!replenishForm.quantity || !replenishForm.unitPrice) {
      showToast("Specify valid purchase quantity and unit pricing", true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/inventory/replenish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId: parseInt(replenishForm.supplierId),
          materialId: parseInt(replenishForm.materialId),
          quantity: parseInt(replenishForm.quantity),
          unitPrice: parseFloat(replenishForm.unitPrice)
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      showToast("Replenish order issued! MySQL UpdateStock trigger added values to inventory live.");
      setReplenishForm({ ...replenishForm, quantity: '', unitPrice: '' });
      fetchSCMCommandData();
    } catch (err) {
      // Sandbox fallback trigger simulation
      const qty = parseInt(replenishForm.quantity);
      const updatedInv = inventory.map(item => {
        if (item.Material_ID.toString() === replenishForm.materialId) {
          return { ...item, Current_Stock: item.Current_Stock + qty };
        }
        return item;
      });
      setInventory(updatedInv);
      setLowStockAlerts(updatedInv.filter(item => item.Current_Stock < 100));

      showToast("Sandbox: Restock order completed successfully & triggered custom trigger!");
      setReplenishForm({ ...replenishForm, quantity: '', unitPrice: '' });
      setTimeout(() => setLoading(false), 200);
    }
  };

  // Search filter
  const filteredInventory = inventory.filter(item => 
    item.Material_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.Unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Dynamic Cyber Toast */}
      <div className={`cyber-toast ${toast.show ? 'active' : ''} ${toast.isError ? 'error' : ''}`}>
        {toast.isError ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
        <span>{toast.message}</span>
      </div>

      {/* Sci-Fi Navigation Sidebar */}
      <aside className="sidebar">
        <div>
          <div className="logo-section">
            <Activity size={24} />
            <span className="logo-title">SCM COMMAND</span>
          </div>

          <nav className="nav-list">
            <div 
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard size={18} />
              Command Center
            </div>
            <div 
              className={`nav-link ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              <Package size={18} />
              Chemical Stock
            </div>
            <div 
              className={`nav-link ${activeTab === 'logistics' ? 'active' : ''}`}
              onClick={() => setActiveTab('logistics')}
            >
              <Truck size={18} />
              Hubs & Scoring
            </div>
          </nav>
        </div>

        {/* User Summary profile */}
        <div className="sidebar-profile">
          <div className="user-avatar">SS</div>
          <div className="user-details">
            <h4>Sameer Shekhar</h4>
            <p>Admin | DB Port 3307</p>
          </div>
        </div>
      </aside>

      {/* Main workspace area */}
      <main className="workspace-wrapper">
        <header className="workspace-header">
          <div className="header-text">
            <h1>
              {activeTab === 'overview' && 'Command Dashboard'}
              {activeTab === 'inventory' && 'Chemical Inventory Control'}
              {activeTab === 'logistics' && 'Facilities & Logistics Evaluation'}
            </h1>
            <p>
              {activeTab === 'overview' && 'Mesh-glowing analytical tracking panel'}
              {activeTab === 'inventory' && 'Monitor warehouse storage ingredients, triggers, and trigger replenishment order records'}
              {activeTab === 'logistics' && 'Analyze safety compliance metrics, depot capacity, and evaluate supplier ratings'}
            </p>
          </div>

          <div className="header-actions">
            <button 
              className="btn-cyber-secondary"
              onClick={fetchSCMCommandData}
              disabled={loading}
            >
              <RefreshCw size={15} className={loading ? 'spin' : ''} />
              Refresh Node
            </button>
          </div>
        </header>

        {/* Dashboard Content Workspace Body */}
        <div className="workspace-body">
          
          {/* Cyber Alert banner triggered by LowStockAlert stored procedure */}
          {lowStockAlerts.length > 0 && (
            <div className="cyber-warning-banner">
              <div className="banner-left">
                <ShieldAlert size={24} />
                <div className="banner-text">
                  <h4>Critical Warning alerts: Low Stock levels detected by Stored Procedure</h4>
                  <p>
                    Stored procedure `LowStockAlert` warns that {lowStockAlerts.map(i => `${i.Material_Name} (${i.Current_Stock} ${i.Unit})`).join(', ')} fall below optimal threshold limits!
                  </p>
                </div>
              </div>
              <button 
                className="btn-cyber-secondary"
                style={{ background: 'rgba(244,63,94,0.06)', borderColor: 'rgba(244, 63, 94, 0.3)', color: 'var(--accent-rose)' }}
                onClick={() => setActiveTab('inventory')}
              >
                Trigger replenishment
                <ChevronRight size={15} />
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* 1. OVERVIEW TAB PANEL */}
          {/* ======================================================== */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid panels */}
              <div className="stats-command-grid">
                <div className="obsidian-card rose">
                  <h3>
                    Critical Warnings
                    <AlertTriangle size={18} className="text-danger" />
                  </h3>
                  <div className="obsidian-stat-row">
                    <div className="obsidian-stat-value" style={{ color: 'var(--accent-rose)', textShadow: '0 0 15px rgba(244,63,94,0.3)' }}>{lowStockAlerts.length}</div>
                    <span className="cyber-badge cyber-badge-rose">Critical alerts</span>
                  </div>
                  <p className="obsidian-stat-desc">Inputs fall below standard levels</p>
                </div>

                <div className="obsidian-card primary">
                  <h3>
                    Top Suppliers
                    <Award size={18} style={{ color: 'var(--accent-magenta)' }} />
                  </h3>
                  <div className="obsidian-stat-row">
                    <div className="obsidian-stat-value" style={{ color: 'var(--accent-magenta)', textShadow: '0 0 15px rgba(217,70,239,0.3)' }}>{topSuppliers.length}</div>
                    <span className="cyber-badge cyber-badge-cyan">Active Vendors</span>
                  </div>
                  <p className="obsidian-stat-desc">Procurement networks tracked</p>
                </div>

                <div className="obsidian-card emerald">
                  <h3>
                    Avg Projected Demand
                    <TrendingUp size={18} style={{ color: 'var(--accent-emerald)' }} />
                  </h3>
                  <div className="obsidian-stat-row">
                    <div className="obsidian-stat-value" style={{ color: 'var(--accent-emerald)', textShadow: '0 0 15px rgba(16,185,129,0.3)' }}>
                      {forecast.length ? Math.round(forecast.reduce((acc, curr) => acc + curr.Predicted_Demand, 0) / forecast.length) : 0}
                    </div>
                    <span className="cyber-badge cyber-badge-emerald">Units/Month</span>
                  </div>
                  <p className="obsidian-stat-desc">Mean projected analytical quota</p>
                </div>
              </div>

              {/* Cargo Shipment tracker & charts grid */}
              <div className="replenish-split-grid">
                {/* Visual SCM charts grid */}
                <div className="charts-command-grid" style={{ gridTemplateColumns: '1fr' }}>
                  
                  {/* Glowing custom Bar chart for Raw Materials */}
                  <div className="obsidian-card chart-obsidian-card">
                    <div className="chart-card-header">
                      <h3>Total Storage Capacity levels</h3>
                      <span className="cyber-badge cyber-badge-cyan">Live Inventory</span>
                    </div>
                    <ResponsiveContainer width="100%" height="80%">
                      <BarChart data={inventory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="glowIndigo" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9}/>
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3}/>
                          </linearGradient>
                          <linearGradient id="glowRose" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.9}/>
                            <stop offset="100%" stopColor="#d946ef" stopOpacity={0.3}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                        <XAxis dataKey="Material_Name" stroke="#475569" fontSize={11} tickLine={false} />
                        <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                          labelStyle={{ color: '#fff', fontWeight: 700 }}
                        />
                        <Bar dataKey="Current_Stock" fill="url(#glowIndigo)" radius={[8, 8, 0, 0]} maxBarSize={40}>
                          {inventory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.Current_Stock < 100 ? 'url(#glowRose)' : 'url(#glowIndigo)'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Demand Forecasting Area Chart */}
                  <div className="obsidian-card chart-obsidian-card">
                    <div className="chart-card-header">
                      <h3>AI Projected Demand Forecast</h3>
                      <span className="cyber-badge cyber-badge-emerald">Predictive AI</span>
                    </div>
                    <ResponsiveContainer width="100%" height="80%">
                      <AreaChart data={forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                        <XAxis dataKey="Product_Name" stroke="#475569" fontSize={10} tickLine={false} />
                        <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px' }} />
                        <Area type="monotone" dataKey="Predicted_Demand" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorForecast)" dot={{ r: 5, fill: '#10b981', strokeWidth: 1.5 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                </div>

                {/* Right Side: Active Shipments Cargo Pipeline Feed */}
                <div className="obsidian-card" style={{ height: '780px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.15rem' }}>Active Cargo Pipeline</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      Estimated transportation details and real-time delivery tracking feed
                    </p>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
                    {shipments.map((s, index) => (
                      <div className="cargo-track-item" key={`${s.Shipment_ID}-${s.Transport_Mode}-${index}`}>
                        <div className="cargo-track-left">
                          <div className="cargo-track-icon">
                            {s.Transport_Mode === 'Ship' ? <Ship size={20} /> : <Truck size={20} />}
                          </div>
                          <div className="cargo-details">
                            <h5>Cargo ID-PO #{s.Order_ID}</h5>
                            <p>{s.Transport_Mode} | {parseFloat(s.Distance_km || 0).toLocaleString()} km route</p>
                          </div>
                        </div>

                        <div className="cargo-right">
                          <span className={`cyber-badge ${
                            s.Status === 'Delivered' ? 'cyber-badge-emerald' : 
                            s.Status === 'In Transit' ? 'cyber-badge-cyan' : 'cyber-badge-amber'
                          }`}>
                            {s.Status}
                          </span>
                          <span className="cargo-eta">
                            {s.Status === 'Delivered' ? 'Completed' : s.Status === 'In Transit' ? 'ETA 3 Days' : 'Loading'}
                          </span>
                        </div>
                      </div>
                    ))}
                    {shipments.length === 0 && (
                      <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', marginTop: '3rem' }}>
                        No ongoing cargo shipments tracked currently.
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* 2. CHEMICAL INVENTORY TAB PANEL */}
          {/* ======================================================== */}
          {activeTab === 'inventory' && (
            <div className="replenish-split-grid">
              
              {/* Materials Storage details */}
              <div className="obsidian-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h3>Material Storage Directory</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      Expanded chemical inputs database records including threshold warnings
                    </p>
                  </div>

                  {/* Search box panel */}
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                    <input 
                      type="text" 
                      placeholder="Filter material catalog..."
                      className="input-obsidian"
                      style={{ paddingLeft: '2.6rem', width: '220px', height: '38px' }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="obsidian-table-container">
                  <table className="obsidian-table">
                    <thead>
                      <tr>
                        <th>Ingredient</th>
                        <th>Seeded Stock</th>
                        <th>Unit</th>
                        <th>Price/Unit</th>
                        <th>Safety Threshold Warning</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInventory.map((item) => (
                        <tr key={item.Material_ID}>
                          <td style={{ fontWeight: 700, color: 'white' }}>{item.Material_Name}</td>
                          <td>{item.Current_Stock}</td>
                          <td>{item.Unit}</td>
                          <td>${parseFloat(item.Cost_Per_Unit || 0).toFixed(2)}</td>
                          <td>
                            {item.Current_Stock < 100 ? (
                              <span className="cyber-badge cyber-badge-rose">Low Stock Alerts (&lt;100)</span>
                            ) : item.Current_Stock < 250 ? (
                              <span className="cyber-badge cyber-badge-amber">Warning Check</span>
                            ) : (
                              <span className="cyber-badge cyber-badge-emerald">Secured</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Replenish Purchase order form */}
              <div className="obsidian-card obsidian-form-box">
                <div className="form-header">
                  <h3>Procure Chemical Storage</h3>
                  <p>Triggers SCM database UpdateStock trigger auto-incrementing stock live</p>
                </div>

                <form onSubmit={handleRestockSubmit}>
                  <div className="form-field">
                    <label>Ingredient Input Select</label>
                    <select 
                      className="input-obsidian"
                      value={replenishForm.materialId}
                      onChange={(e) => setReplenishForm({ ...replenishForm, materialId: e.target.value })}
                    >
                      {inventory.map((i, idx) => (
                        <option key={`${i.Material_ID}-${idx}`} value={i.Material_ID}>{i.Material_Name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Registered Supplier Vendor</label>
                    <select 
                      className="input-obsidian"
                      value={replenishForm.supplierId}
                      onChange={(e) => setReplenishForm({ ...replenishForm, supplierId: e.target.value })}
                    >
                      {suppliersList.map((s, idx) => (
                        <option key={`${s.Supplier_ID}-${idx}`} value={s.Supplier_ID}>{s.Supplier_Name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Replenish Weight (Quantity)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 150"
                      min="1"
                      className="input-obsidian"
                      value={replenishForm.quantity}
                      onChange={(e) => setReplenishForm({ ...replenishForm, quantity: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Chemical Unit Cost ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="e.g. 480.00"
                      min="0.01"
                      className="input-obsidian"
                      value={replenishForm.unitPrice}
                      onChange={(e) => setReplenishForm({ ...replenishForm, unitPrice: e.target.value })}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn-cyber-primary"
                    style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }}
                    disabled={loading}
                  >
                    <Send size={15} />
                    Issue Order & Update Stock
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* 3. LOGISTICS & HUBS TAB PANEL */}
          {/* ======================================================== */}
          {activeTab === 'logistics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Supplier performance evaluator procedure box */}
              <div className="supplier-scoring-layout">
                {/* Left controls */}
                <div className="obsidian-card" style={{ padding: '2rem', height: '100%' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem' }}>
                      <Award size={20} style={{ color: 'var(--accent-magenta)' }} />
                      Supplier Evaluation
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      Evaluates on-time ratios by calling procedure `GetSupplierPerformanceSummary`
                    </p>
                  </div>

                  <div className="form-field">
                    <label>Select Procurement Vendor</label>
                    <select 
                      className="input-obsidian"
                      value={selectedSupplierId}
                      onChange={(e) => setSelectedSupplierId(e.target.value)}
                    >
                      {suppliersList.map((s, index) => (
                        <option key={`${s.Supplier_ID}-${index}`} value={s.Supplier_ID}>{s.Supplier_Name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Right scores summary details */}
                <div className="obsidian-card" style={{ padding: '2rem' }}>
                  {selectedSupplierPerformance.length > 0 ? (
                    <div>
                      {selectedSupplierPerformance.map((perf, index) => (
                        <div key={index}>
                          <h4 style={{ fontSize: '1.05rem', color: '#fff' }}>
                            SCM System Evaluation Audit: {perf.Supplier_Name}
                          </h4>
                          
                          <div className="scoring-metrics-grid">
                            <div className="score-box">
                              <div className="score-label">On-Time delivery rate</div>
                              <div className="score-number" style={{ color: (perf.On_Time_Delivery_Rate || 0) >= 90 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                                {parseFloat(perf.On_Time_Delivery_Rate || 0).toFixed(1)}%
                              </div>
                            </div>

                            <div className="score-box">
                              <div className="score-label">Audit Evaluation Date</div>
                              <div className="score-number" style={{ fontSize: '1.25rem', padding: '0.35rem 0' }}>
                                {new Date(perf.Evaluation_Date).toLocaleDateString()}
                              </div>
                            </div>

                            <div className="score-box">
                              <div className="score-label">Overall Safety Score</div>
                              <div className="score-number" style={{ color: 'var(--accent-cyan)' }}>
                                {parseFloat(perf.Overall_Score || 0).toFixed(1)}/100
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
                      No evaluation safety history populated in database for this vendor yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Warehouse safety capacity visual panels */}
              <div className="obsidian-card" style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem' }}>
                    <Archive size={20} style={{ color: 'var(--accent-cyan)' }} />
                    Depot Capacities & Safety Inspections
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Warehouse storage levels and safety inspection logs
                  </p>
                </div>

                <div className="warehouses-grid">
                  {warehouses.map((wh, index) => (
                    <div className="obsidian-card" style={{ background: 'rgba(255,255,255,0.01)', borderColor: 'rgba(255,255,255,0.02)' }} key={`${wh.Warehouse_ID}-${index}`}>
                      <h4 style={{ color: 'white', fontSize: '1rem' }}>{wh.Warehouse_Name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                        <MapPin size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
                        {wh.Location}
                      </p>

                      <div className="wh-row" style={{ marginTop: '1.5rem' }}>
                        <span className="wh-label">Total Storage Capacity</span>
                        <span className="wh-value">{wh.Capacity.toLocaleString()} Space units</span>
                      </div>

                      {/* Visual fill indicator bar */}
                      <div className="wh-row" style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>
                        <span className="wh-label">Fill Status</span>
                        <span className="wh-value" style={{ color: 'var(--accent-cyan)' }}>
                          {wh.Warehouse_ID === 1 ? '75%' : wh.Warehouse_ID === 2 ? '60%' : wh.Warehouse_ID === 3 ? '85%' : '40%'}
                        </span>
                      </div>
                      <div className="fill-bar-wrapper">
                        <div 
                          className="fill-bar" 
                          style={{ 
                            width: wh.Warehouse_ID === 1 ? '75%' : wh.Warehouse_ID === 2 ? '60%' : wh.Warehouse_ID === 3 ? '85%' : '40%',
                            background: wh.Warehouse_ID === 3 ? 'var(--accent-amber)' : 'linear-gradient(90deg, var(--accent-cyan), var(--accent-primary))'
                          }} 
                        />
                      </div>

                      {/* Safety compliance record logs */}
                      {wh.Inspection_Date ? (
                        <div className="compliance-status-line">
                          <div className={`compliance-status-left ${wh.Passed_Inspection ? 'passed' : 'failed'}`}>
                            {wh.Passed_Inspection ? (
                              <>
                                <ClipboardCheck size={14} /> Passed Inspection
                              </>
                            ) : (
                              <>
                                <ShieldX size={14} /> Failed Compliance
                              </>
                            )}
                          </div>
                          <span className="compliance-date">Inspect: {new Date(wh.Inspection_Date).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem' }}>
                          No audit history logged.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;
