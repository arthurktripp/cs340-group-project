
// Constructed using course materials in CS340
// Adapted from provided materials at https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Accessed 12/9/2023


// app.js

/* ************************
 -------- SETUP -------- //
**************************/ 

// EXPRESS
var express = require('express'); 
var app = express();
PORT = 12323;

// HANDLEBARS
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({                     // Create an instance of the handlebars engine to process templates
  extname: ".hbs", 
}));  
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'));              // defines the folder for linking css & js


//DATABASE
var db = require('./database/db-connector');


/* *************************
 -------- ROUTES -------- //
***************************/ 

// ----- PARTS PAGE ----- //
app.get('/', function(req, res){
  let query1;
  if (req.query.categoryID === undefined || req.query.categoryID == "all") {
    query1 = 
      `SELECT
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
      LEFT JOIN Warehouses ON Warehouses.warehouseID = Parts.warehouseID;`;
  } else { 
    query1 =
      `SELECT
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
      LEFT JOIN Warehouses ON Warehouses.warehouseID = Parts.warehouseID
      WHERE PartCategories.categoryID LIKE ${req.query.categoryID};`;
  } 

  let query2 = 
    `SELECT * FROM PartCategories;`;

  let query3 = 
    `SELECT 
        warehouseID as "ID",
        cityLocation as "City"
      FROM Warehouses;`;
      
  db.pool.query(query1, function(error, rows, fields) { 
    let data = rows;
    db.pool.query(query2, function(error, rows, fields) { 
      let categories = rows;
      db.pool.query(query3, function(error, rows, fields) { 
        let warehouses = rows;
        res.render('index', {
          title: 'Parts',
          data: data,
          categories: categories,
          warehouses: warehouses,
          navParts: true,
          helpers: {
            // autoselects the correct category dropdown:
            catSelected: function (catID){
              if (catID == `${req.query.categoryID}`){
                return "selected"
              };
            }
          }
        });
      });
    });
  });
});

app.post('/add-part-form', function(req, res) 
{
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  query1 = 
  `INSERT INTO Parts 
    (partName, partDescription, stockTotal, partCost, categoryID, warehouseID) 
  VALUES (
    '${data['input-partName']}', 
    '${data['input-partDescription']}', 
    ${data['input-stockTotal']}, 
    ${data['input-partCost']}, 
    ${data['input-categoryID']}, 
    ${data['input-warehouseID']})`;
  db.pool.query(query1, function(error, rows, fields){

    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error)
      res.sendStatus(400);
    } else {
        res.redirect('/');
    }
  })
});

app.post('/edit-part-form', function(req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  let query1 = 
  `UPDATE Parts 
  SET 
    stockTotal = ${data['input-stockTotal']}, 
    warehouseID = ${data['select-city']} 
  WHERE partID = ${data['select-partID']}`;
  db.pool.query(query1, function(error, rows, fields){
    // Check to see if there was an error
    if (error) {

    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
    console.log(error);
    res.sendStatus(400);
    } else {
      res.redirect('/');
    }
  })
});

app.delete('/delete-part-ajax/', function(req,res,next){
  let data = req.body;
  let partID = parseInt(data.partID);
  let query1 = `DELETE FROM Parts WHERE partID = ?`;

  // Run the 1st query
  db.pool.query(query1, [partID], function(error, rows, fields){
    if (error) {

    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
    console.log(error);
    res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
})});


// ----- ENERGY SYSTEMS PAGE ----- //
app.get('/energy-systems', function(req, res) {
  let query1; 
  
  if (req.query.systemID === undefined) {
    query1 = 
      `SELECT
        systemID as ID, 
        systemName as Name,
        systemDescription as Description, 
        estimatedInstallTime as Time, 
        estimatedCustomerIncome as Income 
      FROM EnergySystems;`;
  } else  {
     query1 = 
      `SELECT 
        systemID as ID, 
        systemName as Name,
        systemDescription as Description, 
        estimatedInstallTime as Time, 
        estimatedCustomerIncome as Income 
      FROM EnergySystems 
      WHERE systemID LIKE "${req.query.systemID}";`
  }
 let query2 = 
  // LEFT JOIN includes all parts once, regardless of attachment to system
  // CASE statement adds an identifier for inclusion in the specified system. 
  `SELECT
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
    ORDER BY categoryID ASC, partName ASC;`
    
  let query3 = 
    `SELECT
      partID	 
    FROM SystemParts
    WHERE systemID = "${req.query.systemID}";`

  
  db.pool.query(query1, function(error, rows, fields){
    let data = rows;
   
    db.pool.query(query2, function(error, rows, fields){
      let parts = rows;

      db.pool.query(query3, function(error, rows, fields){
        let systemParts = rows;
      
        res.render('energy-systems', {
          title: 'Energy Systems',
          data: data,
          parts: parts,
          systemParts: systemParts,
          navES: true,
          helpers: {
            // checks off parts that are included in existing systems:
            checked: function (includes){
              if (includes == 'true'){
                return "checked"
              }
            }
          }
        });
      });
    });  
  });
});


app.post('/add-energy-system-ajax', function(req, res){
  // capture incoming data:
  let data = req.body;
  console.log(data);

  // capture Null values:
  let estimatedInstallTime = parseInt(data.estimatedInstallTime);
  if (isNaN(estimatedInstallTime)){
    estimatedInstallTime = "NULL"
  }
  let estimatedCustomerIncome = parseInt(data.estimatedCustomerIncome);
  if (isNaN(estimatedCustomerIncome)) {
    estimatedCustomerIncome = "NULL"
  }

  // queries for adding the new energy system
  query1 = 
    `INSERT INTO EnergySystems(
      systemName,
      systemDescription,
      estimatedInstallTime,
      estimatedCustomerIncome)
    VALUES (
      '${data['systemName']}',
      '${data['systemDescription']}', 
      '${estimatedInstallTime}',
      '${estimatedCustomerIncome}');`;
  db.pool.query(query1, function(error, rows, fields) {
    // check for an error:
    if (error) {
      console.log(error)
      res.sendStatus(400);
    } else {
      
      query2 = 
        `SELECT * FROM EnergySystems`;
      db.pool.query(query2, function(error, rows, fields) {
        // check for an error:
        if (error) {console.log(error); res.sendStatus(400);}
        else {
          res.send(rows);

          // Get the systemID of the system we just added
          query3 = `SELECT MAX(systemID) as maxID from EnergySystems`;
          db.pool.query(query3, function(error, rows, fields) {
            if (error) {console.log(error); res.sendStatus(400);}
            else {
              var newEnergySystemID = rows[0]['maxID']; 
            }

            // Iterate through the checked parts and add them to the system
            data.systemParts.forEach(function(each){
              let newEnergySystemPartID = each;                   
              query4 = `
                INSERT INTO SystemParts
                  (systemID, partID)
                VALUES (
                  ${newEnergySystemID},
                  ${newEnergySystemPartID});`
                
              db.pool.query(query4, function(error, rows, fields) {
                if (error) {console.log(error); res.sendStatus(400);} 
              })
            })
          })
        }
      })
    }
  })
});

app.put('/put-energy-system-ajax', function(req, res) {
  let data = req.body;
  console.log(data);

  let estimatedInstallTime = parseInt(data.estimatedInstallTime);
  if (isNaN(estimatedInstallTime)){
    estimatedInstallTime = "NULL";
  }
  let estimatedCustomerIncome = parseInt(data.estimatedCustomerIncome);
  if (isNaN(estimatedCustomerIncome)){
    estimatedCustomerIncome = "NULL";
  }

  let queryUpdateValues = 
    `UPDATE EnergySystems
    SET
      systemName = '${data.systemName}',
      systemDescription = '${data.systemDescription}',
      estimatedInstallTime = ${estimatedInstallTime},
      estimatedCustomerIncome = ${estimatedCustomerIncome}
    WHERE
      systemID = ${data.systemID};`

  let queryCountOfSystemParts =
    `SELECT
      COUNT(*) as 'existingCount'
    FROM SystemParts
    WHERE systemID = ${data.systemID};`

  let queryGetSystemPartsPartID =
    `SELECT 
      partID as 'partsToUpdate',
      systemPartsID as 'systemPartsID'
    FROM SystemParts
    WHERE   systemID = ${data.systemID}
    ORDER BY partsToUpdate;`
  

  let partToUpdate;
  let newPartID;
  let queryUpdateSystemParts =
  `UPDATE SystemParts 
  SET partID = ${data.updatedPartIDValues[newPartID]}
  WHERE systemID = ${data.systemID} AND partID = ${partToUpdate};`
  
  let queryDeleteSystemParts =
    `DELETE FROM SystemParts 
    WHERE systemID = ${data.systemID}
    AND systemPartsID = (
      SELECT MAX(systemPartsID) 
      FROM SystemParts
      WHERE systemID = ${data.systemID});`

  let addPartsID;
  let queryAddSystemParts = 
    `INSERT INTO SystemParts (systemID, partsID)
    VALUES (${data.systemID}, ${addPartsID});`


  // update the EnergySystems table:
  db.pool.query(queryUpdateValues,
    [estimatedInstallTime, estimatedCustomerIncome, data.systemName, data.systemDescription], 
    function(error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      };
    
    // Get the number of prior SystemParts 
    db.pool.query(queryCountOfSystemParts, data.systemID, function(errors, rows, fields){
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        let existingSystemPartsCount = rows;
        existingSystemPartsCount = (existingSystemPartsCount[0].existingCount);

        // When a user changes the associated parts, and there are the same or fewer parts,
        // we will delete any unneeded parts then update the rest.
        if (data.updatedSystemPartsCount <= existingSystemPartsCount) {
          let numToRemove = (existingSystemPartsCount - data.updatedSystemPartsCount);
          // had trouble passing in the right values here, so I've 
          // included the query directly here.
          db.pool.query(`
            DELETE FROM SystemParts 
            WHERE systemID = ${data.systemID}
            ORDER BY systemID
            LIMIT ${numToRemove};`,
            function(error) {
              if (error){console.log(error); sendStatus(400)};
            
            // Get a list of the remaining parts to update
            db.pool.query(queryGetSystemPartsPartID, function(error, rows, fields) {
              if(error) {console.log(error); res.sendStatus(400)};
              let partsToUpdateObject = rows;
              let partIDsToUpdateList = [];
              let systemPartsIDsToUpdate = [];
              for (each in partsToUpdateObject) {
                partIDsToUpdateList.push(partsToUpdateObject[each].partsToUpdate);
                systemPartsIDsToUpdate.push(partsToUpdateObject[each].systemPartsID);
              };
              partIDsToUpdateList.sort();
              systemPartsIDsToUpdate.sort();
              data.updatedPartIDValues.sort();
                

              // UPDATE the remaining relevant SystemParts to match the selection
              let i = 0;
              for (newPartID in data.updatedPartIDValues) {
                let newPartUpdate = parseInt(data.updatedPartIDValues[newPartID]);
                partToUpdate = parseInt(systemPartsIDsToUpdate[i]);
                
                db.pool.query(
                  `UPDATE SystemParts 
                  SET partID = ${newPartUpdate}
                  WHERE systemPartsID = ${partToUpdate};`, function(errors, rows, fields){
                  if (error) {console.log(error); res.sendStatus(400);};
                });
                i++;
              }
            })
          });
        } else { 
          // UPDATE with more associations than initially set
          // first update the existing associations to match submitted values
          let i = data.updatedSystemPartsCount;
          let countUp = 0;
          db.pool.query(queryGetSystemPartsPartID, function(error, rows, fields) {
            if(error) {console.log(error); res.sendStatus(400)};
            let partsToUpdateObject = rows;
            let partIDsToUpdateList = []
            for (each in partsToUpdateObject) {
              partIDsToUpdateList.push(partsToUpdateObject[each].systemPartsID)
            };
            let systemPartsIDsToUpdate = Object.values(data.updatedPartIDValues);

            for (newPartID in partsToUpdateObject) {
              let newPartUpdate = parseInt(data.updatedPartIDValues[newPartID]);
              partToUpdate = parseInt(partIDsToUpdateList[countUp]);
              db.pool.query(
                `UPDATE SystemParts 
                SET partID = ${newPartUpdate}
                WHERE systemPartsID = ${partToUpdate};`, function(errors, rows, fields){
                if (error) {console.log(error); res.sendStatus(400);};
              });
              i--;
              countUp++;
            }
            // finally, add the remaining SystemParts records submitted
            for (j = countUp; j < data.updatedSystemPartsCount; j++) {
              addPartsID = parseInt(data.updatedPartIDValues[j]);
              db.pool.query(`INSERT INTO SystemParts (systemID, partID)
                VALUES (${data.systemID}, ${addPartsID});`,
                  function(error, rows, fields){
                  if (error) {console.log(error); res.sendStatus(400);};
              });
            };
          });
        };
      };
    });
  });
});

app.delete('/delete-system-ajax/', function(req,res,next){
  let data = req.body;
  let systemID = parseInt(data.id);
  let deleteSystem = `DELETE FROM EnergySystems WHERE systemID = ?`;
  let deleteBsg_People= `DELETE FROM bsg_people WHERE id = ?`;


        // Run the 1st query
        db.pool.query(deleteSystem, [systemID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
})});



// ----- CATEGORIES PAGE ----- //
app.get('/part-categories', function(req, res) {
  let query1 = 
    `SELECT 
      categoryID as ID,
      categoryName as Name
    FROM PartCategories;`
  
  db.pool.query(query1, function(error, rows, fields){
    res.render('categories', {
      title: 'Parts Categories',
      navCat: true,
      data: rows
    });
  })
});

app.post('/add-category-form', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    query1 = 
      `INSERT INTO PartCategories (categoryName)
      VALUES ('${data['input-categoryName']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/part-categories');
        }
    })
});

// ----- WAREHOUSES PAGE ----- //
app.get('/warehouses', function(req, res) {
  let query1 = 
    `SELECT 
      warehouseID as ID,
      addressLine1 as Address,
      addressLine2 as Address2,
      cityLocation as City,
      stateLocation as State,
      zipCode as Zip,
      phoneNumber as Phone
    FROM Warehouses;`;
  
  db.pool.query(query1, function(error, rows, fields){
    res.render('warehouses', {
      title: 'Warehouses',
      navWare: true,
      data: rows,
    });
  })
});

app.post('/add-warehouse-form', function(req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  query1 = `
  INSERT INTO Warehouses
    (phoneNumber,
    addressLine1,
    addressLine2,
    cityLocation,
    stateLocation,
    zipCode) 
  VALUES (
    '${data['input-warehousePhone']}', 
    '${data['input-warehouseAddress']}', 
    '${data['input-warehouseAddress2']}', 
    '${data['input-warehouseCity']}', 
    '${data['input-warehouseState']}', 
    '${data['input-warehouseZip']}')`;
  db.pool.query(query1, function(error, rows, fields) {

    // Check to see if there was an error
    if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400);
    } else {
      res.redirect('/warehouses');
    }
  })
});

// ----- INTERSECTIONS PAGE ----- //
app.get('/intersection', function(req, res) {
  let query1 = 
    `SELECT
      systemPartsID as "ID",
      EnergySystems.systemName as "System",
      Parts.partName as "Part"
    FROM SystemParts
    JOIN EnergySystems ON EnergySystems.systemID = SystemParts.systemID
    JOIN Parts ON Parts.partID = SystemParts.partID
    ORDER BY System;`;
  let query2 = 
    `SELECT * FROM EnergySystems;`;
  let query3 =
    `SELECT * FROM Parts;`;
  
  db.pool.query(query1, function(error, rows, fields) { 
    let data = rows;
    db.pool.query(query2, function(error, rows, fields) { 
      let systems = rows;
      db.pool.query(query3, function(error, rows, fields) { 
        let parts = rows;
        // console.log(parts);
        res.render('intersection', {
          title: 'Intersection',
          data: data,
          systems: systems,
          navESP: true,
          parts: parts
        });
      })
    })
  })
});

app.post('/add-intersection-form', function(req, res) 
{
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  //What if I perform a select query, and if it fails, then we call insert? Otherwise we alert the user

  query1 = `SELECT * FROM SystemParts WHERE systemID = ${data['input-systemID']} AND partID = ${data['input-partID']}`;

  query2 = `INSERT INTO SystemParts (systemID, partID) VALUES (
      ${data['input-systemID']}, 
      ${data['input-partID']})`;

  db.pool.query(query1, function(error, rows, fields) {
    // Check to see if there was an error
    if (rows == '') { //if select query is empty
        db.pool.query(query2, function(error, rows, fields) {
            res.redirect('/intersection');
        })
    } else {
      res.redirect('/intersection');    //I would like to use alert() here but I can't. Any way to tell the user that they can't insert an existing intersection?
    }
  })
});

app.delete('/delete-intersection-ajax/', function(req,res,next){
  let data = req.body;
  let systemPartsID = parseInt(data.systemPartsID);
  let query1 = `DELETE FROM SystemParts WHERE systemPartsID = ?`;

    // Run the 1st query
    db.pool.query(query1, [systemPartsID], function(error, rows, fields){
      if (error) {

      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
      } else {
        res.sendStatus(204);
      }
})});

app.get('/reset-database', function(req, res){
  db.pool.query('SET FOREIGN_KEY_CHECKS = 0', function(error){
    if (error) {console.log(error)};
  db.pool.query(`DROP TABLE SystemParts;`, function(error){
    if (error) {console.log(error)};
    db.pool.query(`DROP TABLE Parts;`, function(error){
      if (error) {console.log(error)};
      db.pool.query(`DROP TABLE Warehouses;`, function(error){
        if (error) {console.log(error)};
        db.pool.query(`DROP TABLE PartCategories;`, function(error){
          if (error) {console.log(error)};
          db.pool.query(`DROP TABLE EnergySystems;`, function(error){
            if (error) {console.log(error)};
            db.pool.query(`CREATE TABLE EnergySystems (
              systemID INT(11) NOT NULL AUTO_INCREMENT,
              systemName VARCHAR(255) NOT NULL UNIQUE,
              systemDescription VARCHAR(500),
              estimatedInstallTime INT(11),
              estimatedCustomerIncome INT(11),
              PRIMARY KEY (systemID)
          );`, function(error){
            if(error){console.log(error)};
            db.pool.query(`CREATE TABLE PartCategories (
              categoryID INT(11) NOT NULL AUTO_INCREMENT,
              categoryName VARCHAR(255) NOT NULL UNIQUE,
              PRIMARY KEY (categoryID)
          );`, function(error){
            if (error) {console.log(error)};
            db.pool.query(`CREATE TABLE Warehouses (
              warehouseID INT(11) NOT NULL AUTO_INCREMENT,
              phoneNumber VARCHAR(15),
              addressLine1 VARCHAR(255) NOT NULL,
              addressLine2 VARCHAR(255),
              cityLocation VARCHAR(255) NOT NULL UNIQUE,
              stateLocation VARCHAR(255) NOT NULL,
              zipCode VARCHAR(9) NOT NULL,
              PRIMARY KEY (warehouseID));`, function(error){
                if(error){console.log(error)};
                db.pool.query(`CREATE TABLE Parts (
                  partID INT(11) NOT NULL AUTO_INCREMENT,
                  partName VARCHAR(255) NOT NULL UNIQUE,
                  partDescription VARCHAR(500),
                  stockTotal INT(11) NOT NULL,
                  partCost DECIMAL(5,2) NOT NULL,
                  categoryID INT(11) NOT NULL,
                  warehouseID INT(11),
                  PRIMARY KEY(partID),
                  FOREIGN KEY (categoryID) REFERENCES PartCategories(categoryID),
                  FOREIGN KEY (warehouseID) REFERENCES Warehouses(warehouseID));`, function(error){
                    if (error) {console.log(error)};
                    db.pool.query(`CREATE TABLE SystemParts (
                      systemPartsID INT(11) NOT NULL AUTO_INCREMENT,
                      systemID INT(11) NOT NULL,
                      partID INT(11) NOT NULL,
                      PRIMARY KEY(systemPartsID),
                      FOREIGN KEY (systemID) REFERENCES EnergySystems(systemID) ON DELETE CASCADE,
                      FOREIGN KEY (partID) REFERENCES Parts(partID) ON DELETE CASCADE
                  );`, function(error){
                    if (error) {console.log(error)};
            
            
            db.pool.query(`INSERT INTO EnergySystems (systemName, systemDescription, estimatedInstallTime, estimatedCustomerIncome)
            VALUES ("Small Solar", "This is a small solar panel system.", 60, 101),
            ("Medium Solar", "This is a medium solar panel system.", 120, 200),
            ("Big Solar", "This is a large solar panel system.", 180, 300),
            ("Big Solar Alternate", "Testing the inclusion of parts.", 150, 280),
            ("Anitas Custom System", "Custom setup for a studio apartment", 61, 25),
            ("RV Solar System", "Mounted solar panel system designed for RVs and vans.", 92, 0),
            ("HydroPower System", "Home Hydropower generator with energy storage.", 240, 40);`, function(error){
              if (error) {console.log(error)};
              db.pool.query(`INSERT INTO PartCategories (categoryName)
              VALUES ("Battery"), ("Cable"), ("Solar Panel"), ("Generator"), ("Roof Mount");`, function(error){
                if (error) {console.log(error)};
                db.pool.query(`INSERT INTO Warehouses (phoneNumber, addressLine1, addressLine2, cityLocation, stateLocation, zipCode)
                VALUES (1234567890, "123 Windy Ave.", NULL, "Austin", "Texas", 12345),
                (NULL, "456 Gusty Blvd.", NULL, "Portland", "Oregon", 54321), 
                (5432109876, "789 Breezy St.", NULL, "New Orleans", "Louisiana", 13579),
                (5135551234, "3231 Cincinnati-Dayton Highway", "Suite 4", "Cincinnati", "Ohio", 45032);`, function(error){
                  if (error) {console.log(error)};
                  db.pool.query(`INSERT INTO Parts (partName, partDescription, stockTotal, partCost, categoryID, warehouseID)
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
                  ("Home Solar Mount Small", "Mounts a small solar panel to a home roof", 180, 80, 5, 4);`, function(error){
                    if (error) {console.log(error)};
                    db.pool.query(`INSERT INTO SystemParts (systemID, partID)
                    VALUES (3, 4),(4, 4),(4, 4),(7, 4),(6, 4),(2, 11),(7, 5),(2, 5),(6, 5),(6, 8),(1, 6),
                        (5, 2),(2, 2),(6, 2),(1, 2),(5, 1),(2, 1),(1, 1),(7, 7);`, function(error){
                          if (error) {console.log(error)};
                          res.redirect('/');
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})
})
})
})
})
})
});






/*
app.get('/reset-database', function(req, res, next){
  db.pool.query(dbReset.prepareDelete, function(error, rows, fields) {
    if (error){ console.log(error); res.sendStatus(400);
    } else {
      db.pool.query(dbReset.resetQuery, function(error, rows, fields){
        if (error){ console.log(error); res.sendStatus(400);
        } else {
          db.pool.query(dbReset.commitQuery, function(error, rows, fields) {
            if (error){ console.log(error); res.sendStatus(400)
            } else {
              res.sendStatus(204);
              res.redirect('/index');
            };
          });
        };
      });
    };
  });
});
*/

/*
  LISTENER
*/
app.listen(PORT, function(){  
  console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
