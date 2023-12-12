-- Group 68 Renewable Energy
-- Arthur Tripp and Liam Robbins


-- ----------------------------------
-- **** EnergySystems entity **** 
-- ----------------------------------

-- select stockParts for all parts associated with a system, then return the minimum.
-- Used to display maximum number of possible systems to be built
-- Not implemented
SELECT
	MIN(Parts.stockTotal) AS Max_Possible_Systems
FROM EnergySystems
	INNER JOIN SystemParts ON SystemParts.systemID = EnergySystems.systemID
	INNER JOIN Parts ON Parts.partID = SystemParts.partID
WHERE EnergySystems.SystemID = :SystemIDInput;

-- select
SELECT * FROM EnergySystems;

-- LEFT JOIN includes all parts once, regardless of attachment to system
-- CASE statement adds an identifier for inclusion in the specified system. 
-- The front end uses "checked" = BOOL to autocheck the right boxes for parts.
SELECT
Parts.partName,
Parts.partID,
CASE
	WHEN SystemParts.systemID IS NULL THEN "false"
	ELSE "true"
END AS checked
FROM Parts
LEFT JOIN SystemParts 
	ON SystemParts.partID = Parts.partID
	AND SystemParts.systemID = "${req.query.systemID}"
ORDER BY categoryID ASC, partName ASC;
	
-- used to add a list of all available parts
SELECT
	partID	 
FROM SystemParts
WHERE systemID = "${req.query.systemID}";

-- insert
-- create a new EnergySystem
-- The backend creates a new system then gets its energySystemID
-- to add associations to the intersection table.
INSERT
INTO EnergySystems(
	systemName,
	systemDescription,
	estimatedInstallTime,
	estimatedCustomerIncome)
VALUES (
	'${data['systemName']}',
	'${data['systemDescription']}', 
	'${estimatedInstallTime}',
	'${estimatedCustomerIncome}');

SELECT * FROM EnergySystems;

SELECT MAX(systemID) as maxID from EnergySystems;

INSERT INTO SystemParts
	(systemID, partID)
VALUES (
	${newEnergySystemID},
	${newEnergySystemPartID});

-- update

UPDATE EnergySystems
SET
	systemName = '${data.systemName}',
	systemDescription = '${data.systemDescription}',
	estimatedInstallTime = ${estimatedInstallTime},
	estimatedCustomerIncome = ${estimatedCustomerIncome}
WHERE
	systemID = ${data.systemID};

SELECT
	COUNT(*) as 'existingCount'
FROM SystemParts
WHERE systemID = ${data.systemID};

SELECT 
	partID as 'partsToUpdate',
	systemPartsID as 'systemPartsID'
FROM SystemParts
WHERE   systemID = ${data.systemID}
ORDER BY partsToUpdate;

-- Deletes intersections if needed, then updates any
-- existing SystemParts intersections, before adding more if needed.
UPDATE SystemParts 
  SET partID = ${data.updatedPartIDValues[newPartID]}
  WHERE systemID = ${data.systemID} AND partID = ${partToUpdate};

-- delete
DELETE FROM EnergySystems
WHERE systemID = :systemIDInput;



-- ----------------------------------
-- **** PartCategories entity **** --
-- ----------------------------------

-- select
SELECT * FROM PartCategories;

-- insert
INSERT INTO PartCategories(categoryName) VALUES
	(:categoryNameInput);
-- update not needed
-- delete not needed


-- ----------------------------------
-- **** Warehouses entity **** 
-- ----------------------------------

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
UPDATE Warehouses
SET phoneNumber = :partDescriptionInput, 
	addressLine1 = :addressLine1Input, 
	addressLine2 = :addressLine2Input, 
	cityLocation = :cityLocationInput, 
	stateLocation = :warehouseIDInput,
	zipCode = :zipCodeInput
WHERE partName = :partNameInput;
-- delete not needed


-- ----------------------------------
-- ****    Parts entity ****    
-- ----------------------------------

-- select if no query
SELECT
	partID as "ID",
	partName as "Name",
	partDescription as "Description",
	stockTotal as "Stock",
	partCost as "Cost",
	PartCategories.categoryName as "Category",
	Warehouses.cityLocation as "Warehouse",
	PartCategories.categoryID as "",
	Warehouses.warehouseID as ""
FROM Parts
JOIN PartCategories ON PartCategories.categoryID = Parts.categoryID
LEFT JOIN Warehouses ON Warehouses.warehouseID = Parts.warehouseID;

-- select by categoryID
SELECT
	partID as "ID",
	partName as "Name",
	partDescription as "Description",
	stockTotal as "Stock",
	partCost as "Cost",
	PartCategories.categoryName as "Category",
	Warehouses.cityLocation as "Warehouse",
	PartCategories.categoryID as "",
	Warehouses.warehouseID as ""
FROM Parts
	INNER JOIN Warehouses ON Warehouses.warehouseID = Parts.warehouseID
	INNER JOIN PartCategories ON PartCategories.categoryID = Parts.categoryID
WHERE Parts.categoryID = :categoryIDInput;

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
SET stockTotal = :partTotalInput
WHERE partID = :partIDInput;

-- delete
DELETE FROM Parts 
WHERE partID = :partIDInput;

-- categories drowpdown selection
SELECT * FROM PartCategories;

-- warehouse dropdown selection
SELECT 
	warehouseID as "ID",
	cityLocation as "City"
FROM Warehouses
;

-- ----------------------------------
-- **** SystemParts entity **** 
-- (intersection table between 
-- EnergySystems and Parts)
-- ----------------------------------
-- select
SELECT 
	EnergySystems.systemID, 
	EnergySystems.systemName, 
	Parts.partID, 
	Parts.partName 
FROM SystemParts
	INNER JOIN EnergySystems ON EnergySystems.systemID = SystemParts.systemID
	INNER JOIN Parts ON Parts.partID = SystemParts.partID
;

-- insert
INSERT INTO SystemParts
	(systemID, partID)
	VALUES (:systemIDInput, :partIDInput);

-- update
UPDATE EnergySystems
SET
	systemName = systemName,
	systemDescription = systemDescription,
	estimatedInstallTime = estimatedInstallTime,
	estimatedCustomerIncome = estimatedCustomerIncome
WHERE
	systemID = systemID
;

-- delete
DELETE FROM SystemParts
WHERE partID = :partIDInput AND systemID = :systemIDInput;