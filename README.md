# AI-Assisted Fertilizer Supply Chain Management System

Welcome to the AI-Assisted Fertilizer Supply Chain Management (SCM) database project. This SQL database goes beyond standard CRUD operations by incorporating advanced supply chain analytics, demand forecasting, supplier performance scoring, and carbon emission tracking.

## Project Overview

This system is designed to manage the flow of raw materials from suppliers to warehouses, track production batches, and handle customer sales orders. It is tailored for the manufacturing industry (specifically fertilizer production, e.g., Ammonia, Urea).

### Key Features
* **Demand Forecasting Table:** To simulate AI predictions on product demand.
* **Supplier Performance Scoring:** To evaluate vendors based on delivery rates and quality.
* **Carbon Emission Tracking:** For sustainability reporting on shipments.
* **Automation (Triggers):** Automatically updating stock levels upon receiving purchase orders.
* **Stored Procedures:** For generating quick alerts (e.g., low stock warnings).

## Project Structure

```text
database folder/
├── schema/
│   ├── 01_tables.sql           # Core schema (Suppliers, Raw_Materials, Orders, etc.)
│   ├── 02_advanced_tables.sql  # Forecasting, Emissions, Supplier Performance
│   ├── 03_triggers.sql         # Automation logic (Stock updates)
│   ├── 04_procedures.sql       # Stored procedures (Alerts, Summaries)
│   └── 05_seed_data.sql        # Dummy data for testing
├── queries/
│   └── analytical_queries.sql  # Useful queries for reporting and dashboards
├── backend/                    # Node.js API server
└── dashboard/                  # React Frontend application
```

## Setup Instructions

### 1. Database Setup (MySQL)
Open your MySQL client or terminal and run:
```sql
CREATE DATABASE SCM_DB;
USE SCM_DB;
```

Run the scripts located in the `schema/` directory sequentially to ensure foreign keys and triggers are created correctly.
```bash
mysql -u root -p SCM_DB < schema/01_tables.sql
mysql -u root -p SCM_DB < schema/02_advanced_tables.sql
mysql -u root -p SCM_DB < schema/03_triggers.sql
mysql -u root -p SCM_DB < schema/04_procedures.sql
mysql -u root -p SCM_DB < schema/05_seed_data.sql
```

### 2. Backend API Setup
Navigate to the `backend` directory, install dependencies, and start the server:
```bash
cd backend
npm install
node server.js
```
Note: Update `backend/.env` with your actual MySQL credentials if needed.

### 3. Frontend Dashboard Setup
Navigate to the `dashboard` directory, install dependencies, and start the development server:
```bash
cd dashboard
npm install
npm run dev
```
Navigate to `http://localhost:5173/` in your browser.

To build the frontend for production, run:
```bash
npm run build
```
