# SCM AI: Cyber-Glow SCM Command Center & Database

Welcome to **SCM AI**, a next-generation **AI-Assisted Fertilizer Supply Chain Management (SCM) System** and analytical database. 

This full-stack system pairs a highly optimized MySQL schema with a Node.js/Express REST API and a breathtaking, custom-built React/Vite obsidian dashboard featuring glowing cybernetics and live data synchronization.

---

## 🔗 Live Production Demo
Access the production dashboard live in your browser:
👉 **[SCM AI Command Center (Vercel)](https://dashboard-six-sable-18.vercel.app/)**

*(Note: The live frontend queries the local Node.js API. Make sure your local backend server is running on port 5000 to view live database updates!)*

---

## 🎨 Breathtaking Visuals & Command Center Redesign

We overthrew generic layout grids to deliver a jaw-dropping obsidian-themed digital command station:
* **🌌 pulsing Mesh Backdrop Glows:** Slowly animating organic blur light sources (Cyan, Indigo, and Fuchsia) floating in the dark obsidian space (`#030712`).
* **✨ Glowing Glassmorphism Cards:** Glass cards styled in translucent deep graphite (`rgba(10, 15, 30, 0.7)`) with glowing linear-gradient fuchsia and indigo borders that react dynamically to cursor hovering.
* **📊 Custom Gradient Capsule Charts:** Multi-stop linear gradients replacing flat bar/area lines (Cyan-to-Blue, Emerald-to-Mint, Indigo-to-Fuchsia) with rounded capsule bar pill shapes.
* **⚡ Snappy Animations:** Interactions tuned with snappy cubic-bezier transitions (`180ms`) to provide immediate button scaling and click feedback.

---

## 📈 Rich SCM Datasets & Features

This database models standard SCM pipelines but extends them with advanced analytical indicators and compliance structures:

### 1. Advanced Analytical Schema
* **6 Raw Material Inputs:** Ammonia (Tons), Urea (Tons), Sulfuric Acid (Liters), Potash (Tons), Phosphate (Tons), Ammonium Nitrate (Tons).
* **4 Products Tracked:** Fertilizer A (High Nitrogen), Fertilizer B (Balanced NPK), Fertilizer C (Organic Supergrow), Fertilizer D (Phosphate Max).
* **AI Demand Forecasting:** Multi-score predictive demand columns featuring predictive AI confidence scores.
* **Safety & Capacity Compliance:** Active inspection logs, inspector records, and passed/failed compliance flags for all chemical storage depots.

### 2. Live Cargo Delivery Pipeline (New Module)
* Displays real-time progress of cargo shipments (`In Transit`, `Pending`, `Delivered`).
* Tracks route distance (km), estimated shipping dates, and carbon footprint (Estimated CO2 kg) benchmarks per transport mode (Cargo Ship, Freight Train, Cargo Truck).

---

## ⚙️ Stored Procedures & Database Automation

Automation logic is built straight into the SCM database engine and fully bound to the dashboard interface:
1. **Replenishment Trigger (`UpdateStock`):** Adding an item to `Purchase_Order_Details` automatically triggers stock increases for that raw material in `Raw_Materials`, instantly updating the live frontend charts.
2. **Alert Stored Procedure (`LowStockAlert`):** Scans inventory tables and returns list warning logs for materials where current stocks have fallen below `100` (e.g. Potash and Ammonium Nitrate). Renders a warning banner in the UI.
3. **Evaluation Stored Procedure (`GetSupplierPerformanceSummary`):** Accepts a supplier ID to return evaluation logs, delivery ratios, and overall vendor scores. Accessible via a dropdown picker in the SCM panel.

---

## 📂 Project Structure

```text
database folder/
├── schema/
│   ├── 01_tables.sql           # Core schema (Suppliers, Raw Materials, Orders)
│   ├── 02_advanced_tables.sql  # Forecasting, Emissions, Supplier Performance
│   ├── 03_triggers.sql         # Stock update trigger (Automation)
│   ├── 04_procedures.sql       # Low-stock alerting & Supplier performance audit
│   └── 05_seed_data.sql        # Core mock SCM seed data
├── queries/
│   └── analytical_queries.sql  # Complex analytical queries for SCM metrics
├── backend/                    # Node.js Express REST API server
│   ├── .env                    # Environment configuration (Port 3307 / 3306)
│   └── server.js               # Express app routes and MySQL queries
└── dashboard/                  # React Vite Frontend application
    ├── src/
    │   ├── App.jsx             # Redesigned obsidian React App dashboard
    │   ├── index.css           # Premium obsidian cyber-glow design styling
    │   └── main.jsx            # Application entry
    ├── index.html              # Custom fonts (Outfit & Inter) preconnects
    └── vite.config.js          # Vite config
```

---

## 🛠️ Setup Instructions

### 1. Database Setup (MySQL)
Open your MySQL console or terminal client:
```sql
CREATE DATABASE SCM_DB;
USE SCM_DB;
```

Run the schema files sequentially:
```bash
mysql -u root -p SCM_DB < schema/01_tables.sql
mysql -u root -p SCM_DB < schema/02_advanced_tables.sql
mysql -u root -p SCM_DB < schema/03_triggers.sql
mysql -u root -p SCM_DB < schema/04_procedures.sql
mysql -u root -p SCM_DB < schema/05_seed_data.sql
```

### 2. Backend REST API Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   npm install
   ```
2. Configure your MySQL credentials inside `backend/.env`. (By default, configured for custom port `3307` and blank password).
3. Start the node server:
   ```bash
   node server.js
   ```
   API will listen at [http://localhost:5000](http://localhost:5000).

### 3. Frontend Dashboard Setup
1. Navigate to the `dashboard` folder:
   ```bash
   cd dashboard
   npm install
   ```
2. Launch the Vite development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

---

## 🔒 License
Licensed under the [ISC License](LICENSE). Built with absolute devotion and luxury aesthetics by Sameer Shekhar.
