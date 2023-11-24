// Constructed using course materials in CS340

/*
  SETUP
*/

// app.js

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

/* *************************
 ----- RENDER PAGES ----- //
***************************/ 

// ----- PARTS PAGE ----- //
app.get('/', function(req, res){
  let query1 = `SELECT
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

  let query2 = `SELECT * FROM PartCategories;`;
  let query3 = `SELECT 
                  warehouseID as "ID",
                  cityLocation as "City"
                FROM Warehouses;`;
  db.pool.query(query1, function(error, rows, fields) { 
    let data = rows;
    db.pool.query(query2, function(error, rows, fields) { 
      let categories = rows;
        db.pool.query(query3, function(error, rows, fields) { 
          let warehouses = rows;
          // console.log(categories);
            res.render('index', {data: data,
                                categories: categories,
                                warehouses: warehouses,
                                title: 'Parts'});
        })
    })
  })
});

app.post('/add-part-form', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    query1 = `INSERT INTO Parts (partName, partDescription, stockTotal, partCost, categoryID, warehouseID) VALUES (
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
        }
        else
        {
            res.redirect('/');
        }
    })
});

app.post('/edit-part-form', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let query1 = `UPDATE Parts SET stockTotal = ${data['input-stockTotal']}, warehouseID = ${data['select-city']} WHERE partID = ${data['select-partID']}`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
      if (error) {

      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
      }
      else
      {
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
            }
            else
            {
                res.sendStatus(204);
            }
})});

// ----- ENERGY SYSTEMS PAGE ----- //
app.get('/energy-systems', function(req, res) {
  let query1 = `SELECT
                  systemID as ID,
                  systemName as Name,
                  systemDescription as Description,
                  estimatedInstallTime as Time,
                  estimatedCustomerIncome Income
                FROM EnergySystems;`;
  
  db.pool.query(query1, function(error, rows, fields){
    res.render('energy-systems', {data: rows,
                                  title: 'Energy Systems'});
  })
});

// ----- CATEGORIES PAGE ----- //
app.get('/part-categories', function(req, res) {
  let query1 = `SELECT 
                  categoryID as ID,
                  categoryName as Name
                  FROM PartCategories;`;
  
  db.pool.query(query1, function(error, rows, fields){
    res.render('categories', {data: rows,
                              title: 'Parts Categories'});
  })
});

app.post('/add-category-form', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    query1 = `INSERT INTO PartCategories (categoryName) VALUES (
        '${data['input-categoryName']}')`;
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
  let query1 = `SELECT 
                  warehouseID as ID,
                  phoneNumber as Phone,
                  addressLine1 as Address,
                  addressLine2 as Address2,
                  cityLocation as City,
                  stateLocation as State,
                  zipCode as Zip
                  FROM Warehouses;`;
  
  db.pool.query(query1, function(error, rows, fields){
    res.render('warehouses', {data: rows,
                              title: 'Warehouses'});
  })
});

app.post('/add-warehouse-form', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    query1 = `INSERT INTO Warehouses (phoneNumber, addressLine1, addressLine2, cityLocation, stateLocation, zipCode) VALUES (
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
        }
        else
        {
            res.redirect('/warehouses');
        }
    })
});

// ----- INTERSECTIONS PAGE ----- //
app.get('/intersection', function(req, res) {
  let query1 = `SELECT
                  systemPartsID as "ID",
                  EnergySystems.systemName as "System",
                  Parts.partName as "Part"
                FROM SystemParts
                JOIN EnergySystems ON EnergySystems.systemID = SystemParts.systemID
                JOIN Parts ON Parts.partID = SystemParts.partID;`;

  let query2 = `SELECT * FROM EnergySystems;`;
  let query3 = `SELECT * FROM Parts;`;
  
  db.pool.query(query1, function(error, rows, fields) { 
    let data = rows;
    db.pool.query(query2, function(error, rows, fields) { 
      let systems = rows;
        db.pool.query(query3, function(error, rows, fields) { 
          let parts = rows;
          // console.log(parts);
            res.render('intersection', {data: data,
                                systems: systems,
                                parts: parts,
                                title: 'Intersection'});
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
      // console.log(rows)
        // Check to see if there was an error
        if (rows == '') { //if select query is empty
            db.pool.query(query2, function(error, rows, fields) {
                res.redirect('/intersection');
            })
        }
    })
    res.redirect('/intersection');    //I would like to use alert() here but I can't. Any way to tell the user that they can't insert an existing intersection?
});


/*
  LISTENER
*/
app.listen(PORT, function(){  
  console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});