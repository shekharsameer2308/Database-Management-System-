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
    port: process.env.DB_PORT || 3307,
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
    const data = await queryDB('SELECT Material_ID, Material_Name, Unit, Cost_Per_Unit, Current_Stock FROM Raw_Materials ORDER BY Current_Stock ASC');
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

// 5. Low-Stock Alerts (Stored Procedure CALL LowStockAlert())
app.get('/api/alerts/low-stock', async (req, res) => {
    try {
        const [rows] = await pool.query('CALL LowStockAlert()');
        if (rows && rows[0]) {
            res.json(rows[0]);
        } else {
            res.json([]);
        }
    } catch (err) {
        console.error("Procedure LowStockAlert failed:", err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 6. Get All Suppliers
app.get('/api/suppliers', async (req, res) => {
    const data = await queryDB('SELECT Supplier_ID, Supplier_Name FROM Suppliers ORDER BY Supplier_Name ASC');
    if (data) res.json(data);
    else res.status(500).json({ error: 'Database error' });
});

// 7. Restock Inventory (POST payload triggers automatic Stock update via Trigger)
app.post('/api/inventory/replenish', async (req, res) => {
    const { supplierId, materialId, quantity, unitPrice } = req.body;
    if (!supplierId || !materialId || !quantity || !unitPrice) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Strict input type validation & parsing
    const sId = parseInt(supplierId);
    const mId = parseInt(materialId);
    const qty = parseInt(quantity);
    const price = parseFloat(unitPrice);

    if (isNaN(sId) || isNaN(mId) || isNaN(qty) || isNaN(price) || qty <= 0 || price <= 0) {
        return res.status(400).json({ error: 'Invalid parameters: ID, quantity, and unit price must be positive numbers' });
    }
    
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Insert into Purchase_Orders
        const orderDate = new Date().toISOString().split('T')[0];
        const expectedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const [poResult] = await connection.query(
            'INSERT INTO Purchase_Orders (Supplier_ID, Order_Date, Expected_Delivery, Status) VALUES (?, ?, ?, ?)',
            [sId, orderDate, expectedDelivery, 'Pending']
        );
        const poId = poResult.insertId;

        // 2. Insert into Purchase_Order_Details (This will fire the UpdateStock database trigger!)
        await connection.query(
            'INSERT INTO Purchase_Order_Details (PO_ID, Material_ID, Quantity, Unit_Price) VALUES (?, ?, ?, ?)',
            [poId, mId, qty, price]
        );

        await connection.commit();
        res.json({ success: true, message: 'Stock replenishment triggered successfully via database trigger!', poId });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error("Transaction failed, rolled back:", err);
        res.status(500).json({ error: 'Failed to complete transaction' });
    } finally {
        if (connection) connection.release();
    }
});

// 8. Get Supplier Performance Summary (Stored Procedure CALL GetSupplierPerformanceSummary(?))
app.get('/api/suppliers/performance/:id', async (req, res) => {
    const supplierId = req.params.id;
    const sId = parseInt(supplierId);
    if (isNaN(sId)) {
        return res.status(400).json({ error: 'Invalid supplier ID parameter: must be a number' });
    }

    try {
        const [rows] = await pool.query('CALL GetSupplierPerformanceSummary(?)', [sId]);
        if (rows && rows[0]) {
            res.json(rows[0]);
        } else {
            res.json([]);
        }
    } catch (err) {
        console.error("Procedure GetSupplierPerformanceSummary failed:", err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 9. Get Warehouses and Safety Compliance
app.get('/api/warehouses', async (req, res) => {
    const data = await queryDB(`
        SELECT w.Warehouse_ID, w.Warehouse_Name, w.Location, w.Capacity,
               c.Inspection_Date, c.Inspector_Name, c.Passed_Inspection, c.Notes
        FROM Warehouses w
        LEFT JOIN Safety_Compliance c ON w.Warehouse_ID = c.Warehouse_ID
        ORDER BY w.Warehouse_Name ASC
    `);
    if (data) res.json(data);
    else res.status(500).json({ error: 'Database error' });
});

// 10. Get Active Shipments and Logistics Route Emissions
app.get('/api/shipments', async (req, res) => {
    const data = await queryDB(`
        SELECT s.Shipment_ID, s.Order_ID, s.Shipment_Date, s.Delivery_Date, s.Status,
               c.Transport_Mode, c.Distance_km, c.Estimated_CO2_kg
        FROM Shipments s
        LEFT JOIN Carbon_Emissions c ON s.Shipment_ID = c.Shipment_ID
        ORDER BY s.Shipment_Date DESC
    `);
    if (data) res.json(data);
    else res.status(500).json({ error: 'Database error' });
});

// Serve static frontend files
const path = require('path');
app.use(express.static(path.join(__dirname, '../dashboard')));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`SCM Backend running on http://localhost:${PORT}`);
});
