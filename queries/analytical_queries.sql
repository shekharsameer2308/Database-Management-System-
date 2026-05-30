-- analytical_queries.sql
-- Useful queries for reporting and analytics

-- 1. Top Suppliers by Order Count
SELECT S.Supplier_Name, COUNT(P.PO_ID) AS Total_Orders
FROM Suppliers S
JOIN Purchase_Orders P ON S.Supplier_ID = P.Supplier_ID
GROUP BY S.Supplier_Name
ORDER BY Total_Orders DESC;

-- 2. Inventory Status (Low stock ordered first)
SELECT Material_Name, Current_Stock, Unit
FROM Raw_Materials
ORDER BY Current_Stock ASC;

-- 3. Monthly Sales Orders
SELECT MONTH(Order_Date) AS Month, COUNT(Order_ID) AS Total_Orders
FROM Sales_Orders
GROUP BY MONTH(Order_Date)
ORDER BY Month;

-- 4. Delayed Shipments (Expected delivery has passed, or took too long)
-- Assuming 'Delivery_Date' here meant 'Expected_Delivery_Date' from context of standard shipments,
-- but based on the prompt's condition: Delivery_Date > Shipment_Date + INTERVAL 7 DAY
SELECT Shipment_ID, Order_ID, Shipment_Date, Delivery_Date, Status
FROM Shipments
WHERE Delivery_Date > Shipment_Date + INTERVAL 7 DAY;

-- ==============================================================
-- ADVANCED "RESUME-WORTHY" QUERIES
-- ==============================================================

-- 5. Demand vs Current Stock (Assuming 1 unit of product needs roughly 1 unit of raw material - simplified)
-- This highlights the AI forecasting aspect
SELECT 
    p.Product_Name, 
    df.Predicted_Demand, 
    df.Confidence_Score,
    df.Forecast_Date
FROM Demand_Forecasting df
JOIN Products p ON df.Product_ID = p.Product_ID
WHERE df.Confidence_Score > 90.0
ORDER BY df.Predicted_Demand DESC;

-- 6. Supplier Performance Review
-- Identify suppliers with low on-time delivery rates for review
SELECT Supplier_Name, Evaluation_Date, On_Time_Delivery_Rate, Overall_Score
FROM Supplier_Performance sp
JOIN Suppliers s ON sp.Supplier_ID = s.Supplier_ID
WHERE On_Time_Delivery_Rate < 90.0;

-- 7. Total Carbon Footprint per Transport Mode
SELECT Transport_Mode, SUM(Estimated_CO2_kg) as Total_CO2_Emissions
FROM Carbon_Emissions
GROUP BY Transport_Mode
ORDER BY Total_CO2_Emissions DESC;
