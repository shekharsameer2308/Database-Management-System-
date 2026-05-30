-- 02_advanced_tables.sql
-- "Resume-Worthy" additions: Forecasting, Emissions, Supplier Performance

-- AI/Analytics: Demand Forecasting
CREATE TABLE Demand_Forecasting (
    Forecast_ID INT AUTO_INCREMENT PRIMARY KEY,
    Product_ID INT,
    Forecast_Date DATE,
    Predicted_Demand INT,
    Confidence_Score DECIMAL(5,2), -- AI prediction confidence %
    FOREIGN KEY (Product_ID) REFERENCES Products(Product_ID)
);

-- Analytics: Supplier Performance Score
CREATE TABLE Supplier_Performance (
    Performance_ID INT AUTO_INCREMENT PRIMARY KEY,
    Supplier_ID INT,
    Evaluation_Date DATE,
    On_Time_Delivery_Rate DECIMAL(5,2), -- %
    Quality_Score DECIMAL(5,2), -- Out of 100
    Overall_Score DECIMAL(5,2),
    FOREIGN KEY (Supplier_ID) REFERENCES Suppliers(Supplier_ID)
);

-- Analytics/Sustainability: Carbon Emission Tracking
CREATE TABLE Carbon_Emissions (
    Emission_ID INT AUTO_INCREMENT PRIMARY KEY,
    Shipment_ID INT,
    Transport_Mode VARCHAR(50),
    Distance_km DECIMAL(10,2),
    Estimated_CO2_kg DECIMAL(10,2),
    FOREIGN KEY (Shipment_ID) REFERENCES Shipments(Shipment_ID)
);

-- Compliance: Safety Compliance Records
CREATE TABLE Safety_Compliance (
    Compliance_ID INT AUTO_INCREMENT PRIMARY KEY,
    Warehouse_ID INT,
    Inspection_Date DATE,
    Inspector_Name VARCHAR(255),
    Passed_Inspection BOOLEAN,
    Notes TEXT,
    FOREIGN KEY (Warehouse_ID) REFERENCES Warehouses(Warehouse_ID)
);
