require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Create a connection pool (Use your actual DB credentials from .env)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'SCM_DB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Helper to handle queries safely
async function queryDB(sql) {
    try {
        const [rows] = await pool.query(sql);
        return rows;
    } catch (err) {
        console.error("Database query failed:", err);
        return null;
    }
}

// =======================
// API ENDPOINTS
// =======================

// 1. Inventory Status
app.get('/api/inventory', async (req, res) => {
    const data = await queryDB('SELECT Material_Name, Current_Stock, Unit FROM Raw_Materials ORDER BY Current_Stock ASC');
    if (data) res.json(data);
    else res.status(500).json({ error: 'Database error' });
});

// 2. Top Suppliers
app.get('/api/suppliers/top', async (req, res) => {
    const data = await queryDB(`
        SELECT S.Supplier_Name, COUNT(P.PO_ID) AS Total_Orders 
        FROM Suppliers S 
        JOIN Purchase_Orders P ON S.Supplier_ID = P.Supplier_ID 
        GROUP BY S.Supplier_Name 
        ORDER BY Total_Orders DESC
    `);
    if (data) res.json(data);
    else res.status(500).json({ error: 'Database error' });
});

// 3. Carbon Emissions by Transport Mode
app.get('/api/emissions', async (req, res) => {
    const data = await queryDB(`
        SELECT Transport_Mode, SUM(Estimated_CO2_kg) as Total_CO2 
        FROM Carbon_Emissions 
        GROUP BY Transport_Mode 
        ORDER BY Total_CO2 DESC
    `);
    if (data) res.json(data);
    else res.status(500).json({ error: 'Database error' });
});

// 4. Demand vs Forecasting 
app.get('/api/forecasting', async (req, res) => {
    const data = await queryDB(`
        SELECT p.Product_Name, df.Predicted_Demand, df.Forecast_Date 
        FROM Demand_Forecasting df 
        JOIN Products p ON df.Product_ID = p.Product_ID 
        ORDER BY df.Forecast_Date ASC
    `);
    if (data) res.json(data);
    else res.status(500).json({ error: 'Database error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`SCM Backend running on http://localhost:${PORT}`);
});
