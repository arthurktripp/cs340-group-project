-- Liam Robbins
-- Arthur Tripp
-- Group 68 - Team Renewable Energy

----------------------------------
-- **** Database Structure **** --
----------------------------------

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

--------------------------------
-- **** Database Inserts **** --
--------------------------------

-- insert data into the EnergySystems table
INSERT INTO EnergySystems (systemName, systemDescription, estimatedInstallTime, estimatedCustomerIncome)
    VALUES ("smallSolar", "This is a small solar panel system.", 60, 100),
    ("mediumSolar", "This is a medium solar panel system.", 120, 200),
    ("bigSolar", "This is a large solar panel system.", 180, 300)
;

-- insert data into the PartCategories table
INSERT INTO PartCategories (categoryName)
    VALUES ("Battery"), ("Cable"), ("Solar Panel")
;

-- insert data into the Warehouses table
INSERT INTO Warehouses (phoneNumber, addressLine1, addressLine2, cityLocation, stateLocation, zipCode)
    VALUES (1234567890, "123 Windy Ave.", NULL, "Austin", "Texas", 12345),
    (NULL, "456 Gusty Blvd.", NULL, "Portland", "Oregon", 54321),
    (5432109876, "789 Breezy St.", NULL, "New Orleans", "Louisiana", 13579)
;

-- insert data into the Parts table
INSERT INTO Parts (partName, partDescription, stockTotal, partCost, categoryID, warehouseID)
    VALUES ("Small battery", NULL, 100, 50.49, 1, 1),
    ("Standard cable", "Used in many systems to connect various parts.", 300, 20.99, 2, 2),
    ("Small solar panel", NULL, 50, 15.97, 3, 2)
;

-- insert data into the SystemParts intersection table
INSERT INTO SystemParts (systemID, partID)
    VALUES (1,1), (1,2), (1,3), (2,2)
;

-- commit
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;