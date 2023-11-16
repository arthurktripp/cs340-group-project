// Constructed using course materials in CS340

/*
  SETUP
*/

// app.js

// EXPRESS
var express = require('express'); 
var app = express();
PORT = 9794;

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


/*
  ROUTES
*/


app.get('/', function(req, res){
  // warehouseID and categoryID should go in a separate query
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
                JOIN Warehouses ON Warehouses.warehouseID = Parts.warehouseID;`;

  let query2 = `SELECT * FROM PartCategories`;
  let query3 = `SELECT 
                  warehouseID as "ID",
                  cityLocation as "City"
                FROM Warehouses`;
  db.pool.query(query1, function(error, rows, fields){ 
    let data = rows;
    db.pool.query(query2, function(error, rows, fields){ 
      let categories = rows;
        db.pool.query(query3, function(error, rows, fields){ 
          let warehouses = rows;
          // console.log(categories);
            res.render('index', {data: data, categories: categories, warehouses: warehouses});
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

    let query1 = `UPDATE Parts SET stockTotal = ${data['input-stockTotal']} WHERE partID = ${data['input-partID']}`;
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

// ----- NEEDS WORK ----- //
/* app.get('/part-categories', function(req, res) {
  let query2 = "SELECT * FROM PartCategories;";
  
  db.pool.query(query2, function(error, rows, fields){
    res.render('index', {data: rows});
  })
});
    */

/*
  LISTENER
*/
app.listen(PORT, function(){  
  console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});