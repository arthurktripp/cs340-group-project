-- Liam Robbins
-- Arthur Tripp
-- Group 68 - Team Renewable Energy

-- --------------------------------
-- **** Database Structure **** --
-- --------------------------------

-- disable foreign key checks and auto-commit
SET AUTOCOMMIT = 0;
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS EnergySystems;
DROP TABLE IF EXISTS PartCategories;
DROP TABLE IF EXISTS Warehouses;
DROP TABLE IF EXISTS Parts;
DROP TABLE IF EXISTS SystemParts;



-- create the EnergySystems table
CREATE TABLE EnergySystems (
    systemID INT(11) NOT NULL AUTO_INCREMENT,
    systemName VARCHAR(255) NOT NULL UNIQUE,
    systemDescription VARCHAR(500),
    estimatedInstallTime INT(11),
    estimatedCustomerIncome INT(11),
    PRIMARY KEY (systemID)
);

-- create the PartCategories table
CREATE TABLE PartCategories (
    categoryID INT(11) NOT NULL AUTO_INCREMENT,
    categoryName VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (categoryID)
);

-- create the Warehouses table
CREATE TABLE Warehouses (
    warehouseID INT(11) NOT NULL AUTO_INCREMENT,
    phoneNumber VARCHAR(15),
    addressLine1 VARCHAR(255) NOT NULL,
    addressLine2 VARCHAR(255),
    cityLocation VARCHAR(255) NOT NULL UNIQUE,
    stateLocation VARCHAR(255) NOT NULL,
    zipCode VARCHAR(9) NOT NULL,
    PRIMARY KEY (warehouseID)
);

-- create the Parts table
CREATE TABLE Parts (
    partID INT(11) NOT NULL AUTO_INCREMENT,
    partName VARCHAR(255) NOT NULL UNIQUE,
    partDescription VARCHAR(500),
    stockTotal INT(11) NOT NULL,
    partCost DECIMAL(5,2) NOT NULL,
    categoryID INT(11) NOT NULL,
    warehouseID INT(11),
    PRIMARY KEY(partID),
    FOREIGN KEY (categoryID) REFERENCES PartCategories(categoryID),
    FOREIGN KEY (warehouseID) REFERENCES Warehouses(warehouseID)
);

-- create the SystemParts intersection table
CREATE TABLE SystemParts (
    systemPartsID INT(11) NOT NULL AUTO_INCREMENT,
    systemID INT(11) NOT NULL,
    partID INT(11) NOT NULL,
    PRIMARY KEY(systemPartsID),
    FOREIGN KEY (systemID) REFERENCES EnergySystems(systemID) ON DELETE CASCADE,
    FOREIGN KEY (partID) REFERENCES Parts(partID) ON DELETE CASCADE
);

-- ------------------------------
-- **** Database Inserts **** --
-- ------------------------------

-- insert data into the EnergySystems table
INSERT INTO EnergySystems (systemName, systemDescription, estimatedInstallTime, estimatedCustomerIncome)
    VALUES ("Small Solar", "This is a small solar panel system.", 60, 101),
    ("Medium Solar", "This is a medium solar panel system.", 120, 200),
    ("Big Solar", "This is a large solar panel system.", 180, 300),
    ("Big Solar Alternate", "Testing the inclusion of parts.", 150, 280),
    ("Anitas Custom System", "Custom setup for a studio apartment", 61, 25),
    ("RV Solar System", "Mounted solar panel system designed for RVs and vans.", 92, 0),
    ("HydroPower System", "Home Hydropower generator with energy storage.", 240, 40)
;

-- insert data into the PartCategories table
INSERT INTO PartCategories (categoryName)
    VALUES ("Battery"), ("Cable"), ("Solar Panel"), ("Generator"), ("Roof Mount")
;

-- insert data into the Warehouses table
INSERT INTO Warehouses (phoneNumber, addressLine1, addressLine2, cityLocation, stateLocation, zipCode)
    VALUES (1234567890, "123 Windy Ave.", NULL, "Austin", "Texas", 12345),
    (NULL, "456 Gusty Blvd.", NULL, "Portland", "Oregon", 54321), 
    (5432109876, "789 Breezy St.", NULL, "New Orleans", "Louisiana", 13579),
    (5135551234, "3231 Cincinnati-Dayton Highway", "Suite 4", "Cincinnati", "Ohio", 45032)
;

-- insert data into the Parts table
INSERT INTO Parts (partName, partDescription, stockTotal, partCost, categoryID, warehouseID)
    VALUES ("Standard cable", "Used in many systems to connect various parts.", 300, 20.99, 2, 2), 
    ("Small solar panel", "Solar Panel for small houses or RVs", 50, 15.97, 3, 2), 
    ("Large solar panel", "Solar panel for houses and businesses", 50, 100, 3, 2), 
    ("High voltage cable", "Rated for 240v", 30, 25.99, 2, 2), 
    ("Large Battery", "30kWh full day of avg household use", 24, 900, 1, 2), 
    ("Small Battery", "1kWh", 50, 120, 1, 1), 
    ("Water Wheel Turbine", "Generates power when placed in running water", 16, 800, 4, 2), 
    ("Medium Battery", "12kWh, enough for a house to get through the night.", 48, 600, 1, 3), 
    ("RV Solar Mount", "Mounting system for RVs and large vans.", 120, 90, 5, 4), 
    ("Home Solar Mount Large", "Mounts a large solar panel to a roof", 120, 110, 5, 4), 
    ("Home Solar Mount Small", "Mounts a small solar panel to a home roof", 180, 80, 5, 4)
;

-- insert data into the SystemParts intersection table
INSERT INTO SystemParts (systemID, partID)
    VALUES (3, 4),
        (4, 4),
        (4, 4),
        (7, 4),
        (6, 4),
        (2, 11),
        (7, 5),
        (2, 5),
        (6, 5),
        (6, 8),
        (1, 6),
        (5, 2),
        (2, 2),
        (6, 2),
        (1, 2),
        (5, 1),
        (2, 1),
        (1, 1),
        (7, 7)
;

-- commit
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;