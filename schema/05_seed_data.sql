-- 05_seed_data.sql
-- Sample data to populate the AI-Assisted Fertilizer SCM System

-- 1. Suppliers
INSERT INTO Suppliers (Supplier_Name, Contact_No, Email, Address) VALUES 
('AgroChem Global', '123-456-7890', 'contact@agrochem.com', '123 Chem St, NY'),
('Nitrogen Sources Ltd', '987-654-3210', 'sales@nitrosources.com', '456 Nito Ave, TX');

-- 2. Raw_Materials
INSERT INTO Raw_Materials (Material_Name, Unit, Cost_Per_Unit, Current_Stock) VALUES 
('Ammonia', 'Tons', 500.00, 150),
('Urea', 'Tons', 300.00, 200),
('Sulfuric Acid', 'Liters', 1.50, 5000);

-- 3. Warehouses
INSERT INTO Warehouses (Warehouse_Name, Location, Capacity) VALUES 
('Main Hub TX', 'Texas', 10000),
('East Coast Storage', 'New Jersey', 5000);

-- 4. Products
INSERT INTO Products (Product_Name, Selling_Price) VALUES 
('Fertilizer A (High Nitrogen)', 45.00),
('Fertilizer B (Balanced NPK)', 55.00);

-- 5. Customers
INSERT INTO Customers (Customer_Name, Location, Contact_No) VALUES 
('FarmCorp Inc.', 'Iowa', '111-222-3333'),
('GreenFields LLC', 'California', '444-555-6666');

-- 6. Purchase_Orders
INSERT INTO Purchase_Orders (Supplier_ID, Order_Date, Expected_Delivery, Status) VALUES 
(1, '2026-05-20', '2026-05-25', 'Delivered'),
(2, '2026-05-28', '2026-06-05', 'Shipped');

-- 7. Purchase_Order_Details (This will trigger UpdateStock if tested line by line after trigger creation)
INSERT INTO Purchase_Order_Details (PO_ID, Material_ID, Quantity, Unit_Price) VALUES 
(1, 1, 50, 480.00),
(2, 2, 100, 290.00);

-- 8. Sales_Orders
INSERT INTO Sales_Orders (Customer_ID, Order_Date, Status) VALUES 
(1, '2026-05-21', 'Shipped'),
(2, '2026-05-25', 'Pending');

-- 9. Shipments
INSERT INTO Shipments (Order_ID, Shipment_Date, Delivery_Date, Status) VALUES 
(1, '2026-05-22', '2026-05-26', 'Delivered'),
(2, '2026-05-27', '2026-06-10', 'In Transit'); -- Example of delayed shipment

-- 10. AI/Analytics Seed Data
INSERT INTO Demand_Forecasting (Product_ID, Forecast_Date, Predicted_Demand, Confidence_Score) VALUES 
(1, '2026-06-01', 500, 92.5),
(2, '2026-06-01', 350, 88.0);

INSERT INTO Supplier_Performance (Supplier_ID, Evaluation_Date, On_Time_Delivery_Rate, Quality_Score, Overall_Score) VALUES 
(1, '2026-05-01', 98.5, 95.0, 96.75),
(2, '2026-05-01', 85.0, 90.0, 87.50);

INSERT INTO Carbon_Emissions (Shipment_ID, Transport_Mode, Distance_km, Estimated_CO2_kg) VALUES 
(1, 'Truck', 450.5, 320.0),
(2, 'Train', 1200.0, 450.5);
