-- 03_triggers.sql
-- Triggers for automation in the SCM system

DELIMITER //

-- Automatically update stock after a purchase order detail is added
-- (Assuming the addition to Purchase_Order_Details means it was received, 
-- or you could tie this to a PO status update instead)
CREATE TRIGGER UpdateStock
AFTER INSERT ON Purchase_Order_Details
FOR EACH ROW
BEGIN
    UPDATE Raw_Materials
    SET Current_Stock = Current_Stock + NEW.Quantity
    WHERE Material_ID = NEW.Material_ID;
END;
//

DELIMITER ;
