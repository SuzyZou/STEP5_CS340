/* ======================SETUP=====================*/
// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
PORT = 9023;
// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({
    defaultLayout:"main",
    extname: ".hbs"

}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters an *.hbs file.
// Static Files
// app.use(express.static('public'));
app.use(express.static(__dirname + '/public')); 


/*====================ROUTES===========================*/
app.post('/searchCustomer', function(req, res)
{
    // Declare Query 1

    // let query1;
    let userInput = req.body.lname
    // console.log("userinput is",userInput)

    // If there is no query string, we just perform a basic SELECT
    // console.log("data",req)
    

    if (userInput === undefined)
    {

        query1 = `SELECT 
                 * FROM Customers;`
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * 
                FROM Customers 
                WHERE lastName LIKE "${userInput}%";`
    }

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Use the data to render the HTML page
        
        let customer = rows;
        res.render('customers', {data:customer});
        
    })
});








app.post("/deleteCustomer",function(req,res){
    let userInput1 = req.body
    let data = userInput1['delete-customer']
    console.log("userinput1",data)
    if (data === undefined){
        query1 = `SELECT 
        * FROM Customers;`
    }else{
        query1 = `DELETE 
                       FROM Customers
                       WHERE customerID = ${data};`
     }
     //Run query
     db.pool.query(query1, function(error, rows, fields){
        // Save the customer
        return res.redirect('/')
    })

})



// GET ROUTES
app.get('/', function(req, res)
{
    // Declare Query 1

    let query1;
     
    // If there is no query string, we just perform a basic SELECT
    // console.log("The requsted last Name is",req.query.lastName)
    if (req.query.lastName === undefined)
    {

        query1 = "SELECT * FROM Customers;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Customers WHERE lastName LIKE "${req.query.lastName}%"`
    }

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the customer
        let customer = rows;
        // console.log("customers in the Database:",customer)
        return res.render('customers', {data: customer});

    })

});

    

//POST ROUTES
app.post('/add-person-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log("recived data:",data)

    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (firstName, lastName, emailAddress, address,city) VALUES ('${data['input-fname']}', '${data['input-lname']}', '${data['input-emailAdresses']}','${data['input-address']}', '${data['input-city']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.status(404).render('error', {
                page: req.url,
            });
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/');
        }
    })
})


//POST ROUTES
app.post('/add-order-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log("recived data:",data)

    // Create the query and run it on the database
    query1 = `INSERT INTO Orders (customerID, orderDate, creditCardNumb, creditCardExpDate,numOrderedItems,pricePaid) VALUES ('${data['input-orderID']}', '${data['input-orderDate']}', '${data['input-creditCardNumb']}','${data['input-creditCardExpDate']}', '${data['input-numOrderedItems']}','${data['input-pricePaid']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.status(404).render('error', {
                page: req.url,
            });
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/orders');
        }
    })
})






app.get('/customers',function(req,res){
   
    query1 = "SELECT * FROM Customers;";
    db.pool.query(query1, function(error, rows, fields){
        
        // Use the data to render the HTML page
        let customer = rows;
        res.render('customers', {data:customer});  
    })
     
 });

 app.get('/orders',function(req,res){
   
    query1 = "SELECT orderID, customerID, DATE_FORMAT(orderDate, '%b %e, %Y') as orderDate, creditCardNumb, DATE_FORMAT(creditCardExpDate, '%b %e, %Y') as creditCardExpDate, numOrderedItems, pricePaid FROM Orders;"
    db.pool.query(query1, function(error, rows, fields){
        let orders = rows;
        res.render('orders', {data:orders});  
    })
     
 });

 app.get('/items',function(req,res){
   
    query4 = "SELECT * FROM Items;";
    db.pool.query(query4, function(error, rows, fields){
        
        // Use the data to render the HTML page
        let orders = rows;
        res.render('items', {data:orders});  
    })
     
 });
 

 app.get('/categories',function(req,res){
   
    query4 = "SELECT * FROM Categories;";
    db.pool.query(query4, function(error, rows, fields){
        
        // Use the data to render the HTML page
        let orders = rows;
        res.render('categories', {data:orders});  
    })
     
 });

 app.get('/reviews',function(req,res){
   
    query4 = "SELECT * FROM Reviews;";
    db.pool.query(query4, function(error, rows, fields){
        
        // Use the data to render the HTML page
        let orders = rows;
        res.render('reviews', {data:orders});  
    })
     
 });


 app.get('/home',function(req,res){
   
    res.render('home');  
    
 });








/*=============================LISTENER=========================*/
app.listen(PORT, function () {
    console.log("express start to listen:",PORT + '; press Ctrl-C to terminate.');
});

