-- Group 68 Renewable Energy
-- Arthur Tripp and Liam Robbins


------------------------------------
-- **** EnergySystems entity **** 
------------------------------------

-- select stockParts for all parts associated with a system, then return the minimum.
-- Used to display maximum number of possible systems to be built
SELECT
	MIN(Parts.stockTotal) AS Max_Possible_Systems
FROM EnergySystems
	INNER JOIN SystemParts ON SystemParts.systemID = EnergySystems.systemID
	INNER JOIN Parts ON Parts.partID = SystemParts.partID
WHERE EnergySystems.SystemID = :SystemIDInput; -- could use name instead

-- select
SELECT * FROM EnergySystems;

-- insert
-- create a new EnergySystem
INSERT INTO EnergySystems(
	systemName, systemDescription, estimatedInstallTime, estimatedCustomerIncome)
	VALUES (
		:systemNameInput,
		:systemDescriptionInput, 
		:estimatedInstallTimeInput, 
		:estimatedCustomerIncomeInput);
-- update not needed

-- delete
DELETE FROM EnergySystems
WHERE systemID = :systemIDInput; --Could use name instead


-- PartCategories entity
-- select
SELECT * FROM PartCategories;

-- insert
INSERT INTO PartCategories(categoryName) VALUES
	(:categoryNameInput);
-- update not needed
-- delete not needed


------------------------------------
-- **** Warehouses entity **** 
------------------------------------

-- select
SELECT * FROM Warehouses

-- insert
INSERT INTO Warehouses
	(phoneNumber, addressLine1, addressLine2, cityLocation, stateLocation, zipCode)
	VALUES(
		:phoneNumberInput, 
		:addressLine1Input, 
		:addressLine2Input, 
		:cityLocationInput, 
		:stateLocationInput, 
		:zipCodeInput);
-- update not needed
-- delete not needed


------------------------------------
-- ****    Parts entity ****    
------------------------------------

-- select
SELECT 
	partID, 
	partName, 
	partDescription, 
	stockTotal, 
	partCost, 
	PartCategories.categoryName, 
	Warehouses.cityLocation
FROM Parts
	INNER JOIN Warehouses ON Warehouses.warehouseID = Parts.warehouseID
	INNER JOIN PartCategories ON PartCategories.categoryID = Parts.categoryID;

-- select by categoryID
SELECT
	partID, 
	partName, 
	partDescription, 
	stockTotal, 
	partCost, 
	PartCategories.categoryName, 
	Warehouses.cityLocation 
FROM Parts
	INNER JOIN Warehouses ON Warehouses.warehouseID = Parts.warehouseID
	INNER JOIN PartCategories ON PartCategories.categoryID = Parts.categoryID
WHERE Parts.categoryID = :categoryIDInput;	--Could use name instead

-- insert
INSERT INTO Parts
	(partName, partDescription, stockTotal, partCost, categoryID, warehouseID)
	VALUES(
		:partNameInput, 
		:partDescriptionInput, 
		:stockTotalInput, 
		:partCostInput, 
		:categoryIDInput, 
		:warehouseIDInput);
-- update not needed
UPDATE Parts
SET partDescription:partDescriptionInput, 
	stockTotal:stockTotalInput, 
	partCost:partCostInput, 
	categoryID:categoryIDInput, 
	warehouseID:warehouseIDInput
WHERE partName:partNameInput;

-- delete
DELETE FROM Parts 
WHERE partID = :partIDInput; --Could use name instead


------------------------------------
-- **** SystemParts entity **** 
-- (intersection table between 
-- EnergySystems and Parts)
------------------------------------
-- select
SELECT 
	EnergySystems.systemID, 
	EnergySystems.systemName, 
	Parts.partID, 
	Parts.partName 
FROM SystemParts
	INNER JOIN EnergySystems ON EnergySystems.systemID = SystemParts.systemID
	INNER JOIN Parts ON Parts.partID = SystemParts.partID;



-- insert
INSERT INTO SystemParts
	(systemID, partID)
	VALUES (:systemIDInput, :partIDInput);

-- update not needed
-- delete not needed