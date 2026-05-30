-- 04_procedures.sql
-- Stored Procedures for analytics and alerts

DELIMITER //

-- Procedure to generate low-stock alerts
CREATE PROCEDURE LowStockAlert()
BEGIN
    SELECT Material_ID, Material_Name, Current_Stock, Unit
    FROM Raw_Materials
    WHERE Current_Stock < 100;
END;
//

-- Procedure to get a summary of supplier performance
CREATE PROCEDURE GetSupplierPerformanceSummary(IN target_supplier_id INT)
BEGIN
    SELECT s.Supplier_Name, p.Evaluation_Date, p.On_Time_Delivery_Rate, p.Overall_Score
    FROM Supplier_Performance p
    JOIN Suppliers s ON p.Supplier_ID = s.Supplier_ID
    WHERE p.Supplier_ID = target_supplier_id
    ORDER BY p.Evaluation_Date DESC;
END;
//

DELIMITER ;
