import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, AreaChart, Area
} from 'recharts';
import { 
  LayoutDashboard, Package, TrendingUp, AlertTriangle, Truck, 
  RefreshCw, CheckCircle2, Factory, Search, ChevronRight, MapPin, 
  ShieldAlert, Send, Award, Activity
} from 'lucide-react';
import './index.css';

// Premium Slate HSL Colors for Recharts
const CHART_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'];

function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('overview'); // overview, inventory, logistics

  // Raw Database Data States
  const [inventory, setInventory] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  const [topSuppliers, setTopSuppliers] = useState([]);
  const [emissions, setEmissions] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);

  // Selected Supplier for Performance stored procedure query
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [selectedSupplierPerformance, setSelectedSupplierPerformance] = useState([]);

  // UI Interactive States
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', isError: false });

  // Replenish Form State
  const [replenishForm, setReplenishForm] = useState({
    materialId: '1',
    supplierId: '1',
    quantity: '',
    unitPrice: ''
  });

  // Load and refresh all live data from local backend server
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [invRes, supTopRes, emRes, forRes, alertsRes, supsListRes] = await Promise.all([
        fetch('http://localhost:5000/api/inventory').then(r => r.json()),
        fetch('http://localhost:5000/api/suppliers/top').then(r => r.json()),
        fetch('http://localhost:5000/api/emissions').then(r => r.json()),
        fetch('http://localhost:5000/api/forecasting').then(r => r.json()),
        fetch('http://localhost:5000/api/alerts/low-stock').then(r => r.json()),
        fetch('http://localhost:5000/api/suppliers').then(r => r.json())
      ]);

      if (invRes.error || supTopRes.error || emRes.error || forRes.error) {
        throw new Error("Unable to query SCM database. Reverting to mock environment.");
      }

      setInventory(invRes);
      setTopSuppliers(supTopRes);
      setEmissions(emRes);
      setForecast(forRes);
      setLowStockAlerts(alertsRes || []);
      setSuppliersList(supsListRes || []);

      // Auto-select first supplier for performance review if listing is populated
      if (supsListRes && supsListRes.length > 0 && !selectedSupplierId) {
        setSelectedSupplierId(supsListRes[0].Supplier_ID.toString());
      }
    } catch (err) {
      console.warn("Failed fetching from real backend database. Displaying mock portfolio environment:", err);
      showToast("Backend offline: Showing simulated sandbox SCM environment", true);
      
      // Fallback robust simulated data for standard chemical pipeline
      setInventory([
        { Material_ID: 1, Material_Name: 'Ammonia', Current_Stock: 150, Unit: 'Tons', Cost_Per_Unit: 500.00 },
        { Material_ID: 2, Material_Name: 'Urea', Current_Stock: 80, Unit: 'Tons', Cost_Per_Unit: 300.00 },
        { Material_ID: 3, Material_Name: 'Sulfuric Acid', Current_Stock: 5000, Unit: 'Liters', Cost_Per_Unit: 1.50 }
      ]);
      setTopSuppliers([
        { Supplier_Name: 'AgroChem Global', Total_Orders: 42 },
        { Supplier_Name: 'Nitrogen Sources Ltd', Total_Orders: 28 },
        { Supplier_Name: 'BioFarm Chemicals', Total_Orders: 14 }
      ]);
      setEmissions([
        { Transport_Mode: 'Truck', Total_CO2: 1250 },
        { Transport_Mode: 'Train', Total_CO2: 450 },
        { Transport_Mode: 'Ship', Total_CO2: 2100 }
      ]);
      setForecast([
        { Product_Name: 'Fertilizer A (High Nitrogen)', Predicted_Demand: 500 },
        { Product_Name: 'Fertilizer B (Balanced NPK)', Predicted_Demand: 350 }
      ]);
      setLowStockAlerts([
        { Material_ID: 2, Material_Name: 'Urea', Current_Stock: 80, Unit: 'Tons' }
      ]);
      setSuppliersList([
        { Supplier_ID: 1, Supplier_Name: 'AgroChem Global' },
        { Supplier_ID: 2, Supplier_Name: 'Nitrogen Sources Ltd' }
      ]);
      setSelectedSupplierId('1');
    } finally {
      // Add a slight micro-delay for realistic UI swift response transition
      setTimeout(() => setLoading(false), 250);
    }
  };

  // Fetch supplier performance details when supplier ID changes
  useEffect(() => {
    if (!selectedSupplierId) return;
    
    const fetchSupplierPerformance = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/suppliers/performance/${selectedSupplierId}`);
        const data = await res.json();
        if (data.error) throw new Error();
        setSelectedSupplierPerformance(data || []);
      } catch (err) {
        // Fallback simulated performance values
        if (selectedSupplierId === '1') {
          setSelectedSupplierPerformance([{
            Supplier_Name: 'AgroChem Global',
            Evaluation_Date: '2026-05-01',
            On_Time_Delivery_Rate: 98.5,
            Overall_Score: 96.75
          }]);
        } else {
          setSelectedSupplierPerformance([{
            Supplier_Name: 'Nitrogen Sources Ltd',
            Evaluation_Date: '2026-05-01',
            On_Time_Delivery_Rate: 85.0,
            Overall_Score: 87.50
          }]);
        }
      }
    };

    fetchSupplierPerformance();
  }, [selectedSupplierId, inventory]); // Trigger when selected supplier ID or inventory shifts

  // Load initial dataset on load
  useEffect(() => {
    fetchAllData();
  }, []);

  // UI Toast helper
  const showToast = (message, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => {
      setToast({ show: false, message: '', isError: false });
    }, 4000);
  };

  // Replenishment form submit handler
  const handleReplenishSubmit = async (e) => {
    e.preventDefault();
    if (!replenishForm.quantity || !replenishForm.unitPrice) {
      showToast("Please specify quantity and unit price", true);
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

      showToast("Purchase order details generated successfully! Stock automatically updated by DB trigger.");
      setReplenishForm({ ...replenishForm, quantity: '', unitPrice: '' });
      fetchAllData();
    } catch (err) {
      console.error(err);
      // Fallback sandbox simulation: Add stock locally
      const qty = parseInt(replenishForm.quantity);
      const updatedInv = inventory.map(item => {
        if (item.Material_ID.toString() === replenishForm.materialId) {
          return { ...item, Current_Stock: item.Current_Stock + qty };
        }
        return item;
      });
      setInventory(updatedInv);
      
      // Re-evaluate low stock warning states locally
      const updatedAlerts = updatedInv.filter(item => item.Current_Stock < 100);
      setLowStockAlerts(updatedAlerts);

      showToast("Local sandbox environment: Replenished inventory & adjusted trigger logic successfully!");
      setReplenishForm({ ...replenishForm, quantity: '', unitPrice: '' });
      setTimeout(() => setLoading(false), 200);
    }
  };

  // Filter raw material inventory table via Search term
  const filteredInventory = inventory.filter(item => 
    item.Material_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.Unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Toast Notice */}
      <div className={`toast-notif ${toast.show ? 'active' : ''} ${toast.isError ? 'error' : ''}`}>
        {toast.isError ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
        <span>{toast.message}</span>
      </div>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <div className="logo">
            <Factory size={24} />
            <span>SCM AI</span>
          </div>
          
          <nav className="nav-links">
            <div 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard size={18} />
              Overview
            </div>
            <div 
              className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              <Package size={18} />
              Inventory
            </div>
            <div 
              className={`nav-item ${activeTab === 'logistics' ? 'active' : ''}`}
              onClick={() => setActiveTab('logistics')}
            >
              <Truck size={18} />
              Logistics
            </div>
          </nav>
        </div>

        {/* Profile/Environment Info */}
        <div className="sidebar-footer">
          <div className="avatar">SS</div>
          <div className="profile-info">
            <h4>Sameer Shekhar</h4>
            <p>Admin • Local DB 3307</p>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="main-content">
        <header className="main-header">
          <div className="header-title">
            <h1>
              {activeTab === 'overview' && 'Supply Chain Overview'}
              {activeTab === 'inventory' && 'Raw Material Inventory'}
              {activeTab === 'logistics' && 'Logistics & Sustainability'}
            </h1>
            <p>
              {activeTab === 'overview' && 'AI-Assisted Fertilizer Production Analytics'}
              {activeTab === 'inventory' && 'Manage raw materials, execute RESTful replenishments, & view triggers'}
              {activeTab === 'logistics' && 'Evaluate supplier performance scoring & track estimated carbon footprint'}
            </p>
          </div>

          <div className="header-actions">
            <button 
              className="btn-secondary"
              onClick={fetchAllData}
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
              Refresh
            </button>
          </div>
        </header>

        {/* View Body */}
        <div className="view-body">
          
          {/* Stored Procedure Warning Banner (renders if low stock procedure returns warnings) */}
          {lowStockAlerts.length > 0 && (
            <div className="alert-banner">
              <div className="alert-banner-content">
                <ShieldAlert size={22} />
                <div className="alert-banner-text">
                  <h4>Low Stock Alerts Triggered by Stored Procedure</h4>
                  <p>
                    The database procedure `LowStockAlert` has detected that {lowStockAlerts.map(i => `${i.Material_Name} (${i.Current_Stock} ${i.Unit})`).join(', ')} fall below safe minimum thresholds!
                  </p>
                </div>
              </div>
              <button 
                className="btn-secondary" 
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(245, 158, 11, 0.3)' }}
                onClick={() => setActiveTab('inventory')}
              >
                Replenish Stock
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* 1. OVERVIEW TAB SCREEN */}
          {/* ======================================================== */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Health Cards */}
              <div className="stats-grid">
                <div className="glass-card danger">
                  <h3>
                    Low Stock Warnings
                    <AlertTriangle size={18} className="text-danger" />
                  </h3>
                  <div className="stat-value-container">
                    <div className="stat-value text-danger">{lowStockAlerts.length}</div>
                    <div className="badge badge-danger">Needs Reorder</div>
                  </div>
                  <p className="stat-desc">Materials require replenishment</p>
                </div>

                <div className="glass-card primary">
                  <h3>
                    Registered Vendors
                    <Award size={18} className="text-accent" />
                  </h3>
                  <div className="stat-value-container">
                    <div className="stat-value text-accent">{suppliersList.length}</div>
                    <div className="badge badge-primary">Active</div>
                  </div>
                  <p className="stat-desc">Active SCM chemical suppliers</p>
                </div>

                <div className="glass-card success">
                  <h3>
                    Forecast Demand
                    <TrendingUp size={18} className="text-success" />
                  </h3>
                  <div className="stat-value-container">
                    <div className="stat-value text-success">
                      {forecast.length ? Math.round(forecast.reduce((acc, curr) => acc + curr.Predicted_Demand, 0) / forecast.length) : 0}
                    </div>
                    <div className="badge badge-success">Units/Mo</div>
                  </div>
                  <p className="stat-desc">Average expected production demand</p>
                </div>
              </div>

              {/* Analytical Charts */}
              <div className="charts-grid">
                {/* 1. Inventory Levels bar chart */}
                <div className="glass-card chart-card">
                  <div className="chart-header">
                    <h3>Current Stock Levels</h3>
                    <span className="badge badge-primary">Database Live</span>
                  </div>
                  <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={inventory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="Material_Name" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }}
                        labelStyle={{ color: '#94a3b8', fontWeight: 600 }}
                      />
                      <Bar dataKey="Current_Stock" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={45}>
                        {inventory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.Current_Stock < 100 ? '#f43f5e' : '#6366f1'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* 2. Top Suppliers Pie Chart */}
                <div className="glass-card chart-card">
                  <div className="chart-header">
                    <h3>Supplier Volume Share</h3>
                    <span className="badge badge-success">Order Volume</span>
                  </div>
                  <ResponsiveContainer width="100%" height="80%">
                    <PieChart>
                      <Pie
                        data={topSuppliers}
                        innerRadius={70}
                        outerRadius={95}
                        paddingAngle={4}
                        dataKey="Total_Orders"
                        nameKey="Supplier_Name"
                        label={({name}) => name}
                      >
                        {topSuppliers.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* 3. Demand Forecasting Area Chart */}
                <div className="glass-card chart-card">
                  <div className="chart-header">
                    <h3>AI Demand Forecasting</h3>
                    <span className="badge badge-primary">Model Predictive</span>
                  </div>
                  <ResponsiveContainer width="100%" height="80%">
                    <AreaChart data={forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="Product_Name" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }} />
                      <Area type="monotone" dataKey="Predicted_Demand" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorForecast)" dot={{ r: 4 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* 4. Carbon Footprint Emissions Bar Chart */}
                <div className="glass-card chart-card">
                  <div className="chart-header">
                    <h3>Eco-Freight Emissions (CO2 kg)</h3>
                    <span className="badge badge-danger">Sustainability</span>
                  </div>
                  <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={emissions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="Transport_Mode" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }} />
                      <Bar dataKey="Total_CO2" fill="#06b6d4" radius={[6, 6, 0, 0]} maxBarSize={45} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* 2. INVENTORY TAB SCREEN */}
          {/* ======================================================== */}
          {activeTab === 'inventory' && (
            <div className="inventory-layout">
              {/* Left Side: Materials List & Table */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3>Material Stock Directory</h3>
                  
                  {/* Search box */}
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                    <input 
                      type="text" 
                      placeholder="Search material..."
                      className="input-premium"
                      style={{ paddingLeft: '2.5rem', width: '220px', height: '36px' }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="card-table-wrapper">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>Material</th>
                        <th>Current Stock</th>
                        <th>Unit</th>
                        <th>Price/Unit</th>
                        <th>Threshold Warning</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInventory.map((item) => (
                        <tr key={item.Material_ID}>
                          <td style={{ fontWeight: 600, color: 'white' }}>{item.Material_Name}</td>
                          <td>{item.Current_Stock}</td>
                          <td>{item.Unit}</td>
                          <td>${parseFloat(item.Cost_Per_Unit).toFixed(2)}</td>
                          <td>
                            {item.Current_Stock < 100 ? (
                              <span className="badge badge-danger">Critical (&lt;100)</span>
                            ) : item.Current_Stock < 250 ? (
                              <span className="badge badge-warning">Moderate</span>
                            ) : (
                              <span className="badge badge-success">Optimized</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {filteredInventory.length === 0 && (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                            No raw materials matched search term.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Side: Quick Restock / Purchase Form */}
              <div className="glass-card replenish-form-card">
                <div className="form-title">
                  <h3>Restock Raw Materials</h3>
                  <p>Fires database UpdateStock SQL Trigger automatically on insert</p>
                </div>

                <form onSubmit={handleReplenishSubmit}>
                  <div className="form-group">
                    <label>Raw Material Selection</label>
                    <select 
                      className="input-premium"
                      value={replenishForm.materialId}
                      onChange={(e) => setReplenishForm({ ...replenishForm, materialId: e.target.value })}
                    >
                      {inventory.map(i => (
                        <option key={i.Material_ID} value={i.Material_ID}>{i.Material_Name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Supplier Vendor</label>
                    <select 
                      className="input-premium"
                      value={replenishForm.supplierId}
                      onChange={(e) => setReplenishForm({ ...replenishForm, supplierId: e.target.value })}
                    >
                      {suppliersList.map(s => (
                        <option key={s.Supplier_ID} value={s.Supplier_ID}>{s.Supplier_Name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Purchase Quantity</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 150"
                      min="1"
                      className="input-premium"
                      value={replenishForm.quantity}
                      onChange={(e) => setReplenishForm({ ...replenishForm, quantity: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Unit Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="e.g. 480.00"
                      min="0.01"
                      className="input-premium"
                      value={replenishForm.unitPrice}
                      onChange={(e) => setReplenishForm({ ...replenishForm, unitPrice: e.target.value })}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
                    disabled={loading}
                  >
                    <Send size={16} />
                    Issue Order & Restock
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. LOGISTICS TAB SCREEN */}
          {/* ======================================================== */}
          {activeTab === 'logistics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Supplier Performance Evaluation procedure box */}
              <div className="glass-card">
                <div className="perf-header">
                  <Award size={24} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <h3>Supplier Performance Scoring</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      Invokes the `GetSupplierPerformanceSummary` Stored Procedure directly in the database
                    </p>
                  </div>
                </div>

                <div className="form-group perf-dropdown">
                  <label>Select Vendor to Evaluate</label>
                  <select 
                    className="input-premium"
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                  >
                    {suppliersList.map(s => (
                      <option key={s.Supplier_ID} value={s.Supplier_ID}>{s.Supplier_Name}</option>
                    ))}
                  </select>
                </div>

                {/* Score Summary Box Details */}
                {selectedSupplierPerformance.length > 0 ? (
                  <div>
                    {selectedSupplierPerformance.map((perf, index) => (
                      <div key={index}>
                        <h4 style={{ fontSize: '1rem', marginTop: '1.5rem', color: 'white' }}>
                          Performance Report for {perf.Supplier_Name}
                        </h4>
                        
                        <div className="performance-details-grid">
                          <div className="perf-stat-box">
                            <div className="perf-stat-label">On-Time Delivery Rate</div>
                            <div className="perf-stat-value" style={{ color: perf.On_Time_Delivery_Rate >= 90 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                              {parseFloat(perf.On_Time_Delivery_Rate).toFixed(1)}%
                            </div>
                          </div>

                          <div className="perf-stat-box">
                            <div className="perf-stat-label">Evaluation Date</div>
                            <div className="perf-stat-value" style={{ fontSize: '1.25rem', padding: '0.35rem 0' }}>
                              {new Date(perf.Evaluation_Date).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="perf-stat-box">
                            <div className="perf-stat-label">Overall Performance Score</div>
                            <div className="perf-stat-value" style={{ color: 'var(--color-cyan)' }}>
                              {parseFloat(perf.Overall_Score).toFixed(2)}/100
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '1.5rem' }}>
                    No safety performance metrics recorded in the database for this vendor yet.
                  </p>
                )}
              </div>

              {/* Emissions & Shipping Analytics summary */}
              <div className="glass-card">
                <div className="perf-header">
                  <Truck size={24} style={{ color: 'var(--color-cyan)' }} />
                  <div>
                    <h3>Freight & Ecological Sustainability Analytics</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      Calculated shipping distances and carbon footprint values per shipment mode
                    </p>
                  </div>
                </div>

                <div className="card-table-wrapper" style={{ marginTop: '1.5rem' }}>
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>Transport Mode</th>
                        <th>Total Estimated Emissions</th>
                        <th>Visual Benchmark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emissions.map((e, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600, color: 'white' }}>{e.Transport_Mode}</td>
                          <td>
                            <strong style={{ color: 'var(--color-danger)' }}>{parseFloat(e.Total_CO2).toLocaleString()}</strong> kg CO2
                          </td>
                          <td style={{ width: '45%' }}>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div 
                                style={{ 
                                  width: `${Math.min((e.Total_CO2 / 2500) * 100, 100)}%`, 
                                  height: '100%', 
                                  background: e.Transport_Mode === 'Truck' ? 'var(--color-danger)' : 'var(--color-cyan)',
                                  borderRadius: '4px'
                                }} 
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
