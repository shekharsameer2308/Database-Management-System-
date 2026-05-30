import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid 
} from 'recharts';
import { LayoutDashboard, Package, TrendingUp, AlertTriangle, Truck } from 'lucide-react';
import './index.css';

// Using exact theme colors from CSS
const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

function App() {
  const [inventory, setInventory] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [emissions, setEmissions] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  // Fetch data from Node.js backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, supRes, emRes, forRes] = await Promise.all([
          fetch('http://localhost:5000/api/inventory').then(r => r.json()),
          fetch('http://localhost:5000/api/suppliers/top').then(r => r.json()),
          fetch('http://localhost:5000/api/emissions').then(r => r.json()),
          fetch('http://localhost:5000/api/forecasting').then(r => r.json())
        ]);
        
        // Check for backend errors (if DB is not connected, it returns {error: ...})
        if (invRes.error) throw new Error("Database not connected. Please start MySQL and run the schema scripts.");

        setInventory(invRes);
        setSuppliers(supRes);
        setEmissions(emRes);
        setForecast(forRes);
      } catch (err) {
        console.error(err);
        // Fallback to Mock Data if backend is unavailable (great for portfolio!)
        setError("Backend DB offline. Showing mock data.");
        setInventory([
          { Material_Name: 'Ammonia', Current_Stock: 150 },
          { Material_Name: 'Urea', Current_Stock: 200 },
          { Material_Name: 'Sulfuric Acid', Current_Stock: 5000 }
        ]);
        setSuppliers([
          { Supplier_Name: 'AgroChem', Total_Orders: 45 },
          { Supplier_Name: 'Nitro Ltd', Total_Orders: 32 },
          { Supplier_Name: 'BioFarm', Total_Orders: 15 }
        ]);
        setEmissions([
          { Transport_Mode: 'Truck', Total_CO2: 1500 },
          { Transport_Mode: 'Train', Total_CO2: 450 },
          { Transport_Mode: 'Ship', Total_CO2: 2300 }
        ]);
        setForecast([
          { Product_Name: 'Fertilizer A', Predicted_Demand: 500 },
          { Product_Name: 'Fertilizer B', Predicted_Demand: 350 }
        ]);
      }
    };

    fetchData();
  }, []);

  const lowStockCount = inventory.filter(i => i.Current_Stock < 250).length;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <TrendingUp className="text-accent" /> SCM AI
        </div>
        <nav>
          <div className="nav-item active"><LayoutDashboard size={20} /> Overview</div>
          <div className="nav-item"><Package size={20} /> Inventory</div>
          <div className="nav-item"><Truck size={20} /> Logistics</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header>
          <h1>Supply Chain Overview</h1>
          <p>AI-Assisted Fertilizer Production Dashboard</p>
          {error && <p style={{color: '#ef4444', marginTop: '10px'}}>{error}</p>}
        </header>

        {/* Top Stats */}
        <div className="stats-grid">
          <div className="glass-card">
            <h3><AlertTriangle size={18} className="text-danger" /> Low Stock Alerts</h3>
            <div className="stat-value text-danger">{lowStockCount}</div>
            <p style={{color: '#94a3b8', fontSize: '0.9rem'}}>Materials requiring reorder</p>
          </div>
          
          <div className="glass-card">
            <h3><Package size={18} className="text-accent" /> Active Suppliers</h3>
            <div className="stat-value text-accent">{suppliers.length}</div>
            <p style={{color: '#94a3b8', fontSize: '0.9rem'}}>Currently tracked vendors</p>
          </div>

          <div className="glass-card">
            <h3><TrendingUp size={18} className="text-success" /> Avg Forecast</h3>
            <div className="stat-value text-success">
              {forecast.length ? Math.round(forecast.reduce((acc, curr) => acc + curr.Predicted_Demand, 0) / forecast.length) : 0}
            </div>
            <p style={{color: '#94a3b8', fontSize: '0.9rem'}}>Units expected next month</p>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          {/* Inventory Bar Chart */}
          <div className="glass-card" style={{ height: '350px' }}>
            <h3>Current Inventory Levels</h3>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={inventory} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="Material_Name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                <Bar dataKey="Current_Stock" fill="var(--accent-color)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Supplier Performance Pie Chart */}
          <div className="glass-card" style={{ height: '350px' }}>
            <h3>Top Suppliers by Volume</h3>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={suppliers}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="Total_Orders"
                  nameKey="Supplier_Name"
                  label={({name}) => name}
                >
                  {suppliers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Demand Forecasting Line Chart */}
          <div className="glass-card" style={{ height: '350px' }}>
            <h3>AI Demand Forecast</h3>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={forecast} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="Product_Name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                <Line type="monotone" dataKey="Predicted_Demand" stroke="var(--success-color)" strokeWidth={3} dot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Emissions Bar Chart */}
          <div className="glass-card" style={{ height: '350px' }}>
            <h3>Carbon Emissions (CO2 kg)</h3>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={emissions} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="Transport_Mode" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                <Bar dataKey="Total_CO2" fill="var(--danger-color)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
