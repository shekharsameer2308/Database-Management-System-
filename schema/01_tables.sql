-- 01_tables.sql
-- Core Schema for AI-Assisted Fertilizer Supply Chain Management System

CREATE TABLE Suppliers (
    Supplier_ID INT AUTO_INCREMENT PRIMARY KEY,
    Supplier_Name VARCHAR(255) NOT NULL,
    Contact_No VARCHAR(50),
    Email VARCHAR(100),
    Address TEXT
);

CREATE TABLE Raw_Materials (
    Material_ID INT AUTO_INCREMENT PRIMARY KEY,
    Material_Name VARCHAR(255) NOT NULL,
    Unit VARCHAR(50),
    Cost_Per_Unit DECIMAL(10, 2),
    Current_Stock INT DEFAULT 0
);

CREATE TABLE Purchase_Orders (
    PO_ID INT AUTO_INCREMENT PRIMARY KEY,
    Supplier_ID INT,
    Order_Date DATE,
    Expected_Delivery DATE,
    Status VARCHAR(50) DEFAULT 'Pending',
    FOREIGN KEY (Supplier_ID) REFERENCES Suppliers(Supplier_ID)
);

CREATE TABLE Purchase_Order_Details (
    Detail_ID INT AUTO_INCREMENT PRIMARY KEY,
    PO_ID INT,
    Material_ID INT,
    Quantity INT,
    Unit_Price DECIMAL(10, 2),
    FOREIGN KEY (PO_ID) REFERENCES Purchase_Orders(PO_ID),
    FOREIGN KEY (Material_ID) REFERENCES Raw_Materials(Material_ID)
);

CREATE TABLE Warehouses (
    Warehouse_ID INT AUTO_INCREMENT PRIMARY KEY,
    Warehouse_Name VARCHAR(255) NOT NULL,
    Location VARCHAR(255),
    Capacity INT
);

CREATE TABLE Inventory (
    Inventory_ID INT AUTO_INCREMENT PRIMARY KEY,
    Warehouse_ID INT,
    Material_ID INT,
    Quantity INT,
    FOREIGN KEY (Warehouse_ID) REFERENCES Warehouses(Warehouse_ID),
    FOREIGN KEY (Material_ID) REFERENCES Raw_Materials(Material_ID)
);

CREATE TABLE Products (
    Product_ID INT AUTO_INCREMENT PRIMARY KEY,
    Product_Name VARCHAR(255) NOT NULL,
    Selling_Price DECIMAL(10, 2)
);

CREATE TABLE Production_Batch (
    Batch_ID INT AUTO_INCREMENT PRIMARY KEY,
    Product_ID INT,
    Production_Date DATE,
    Quantity_Produced INT,
    FOREIGN KEY (Product_ID) REFERENCES Products(Product_ID)
);

CREATE TABLE Customers (
    Customer_ID INT AUTO_INCREMENT PRIMARY KEY,
    Customer_Name VARCHAR(255) NOT NULL,
    Location VARCHAR(255),
    Contact_No VARCHAR(50)
);

CREATE TABLE Sales_Orders (
    Order_ID INT AUTO_INCREMENT PRIMARY KEY,
    Customer_ID INT,
    Order_Date DATE,
    Status VARCHAR(50) DEFAULT 'Pending',
    FOREIGN KEY (Customer_ID) REFERENCES Customers(Customer_ID)
);

CREATE TABLE Shipments (
    Shipment_ID INT AUTO_INCREMENT PRIMARY KEY,
    Order_ID INT,
    Shipment_Date DATE,
    Delivery_Date DATE,
    Status VARCHAR(50) DEFAULT 'In Transit',
    FOREIGN KEY (Order_ID) REFERENCES Sales_Orders(Order_ID)
);
