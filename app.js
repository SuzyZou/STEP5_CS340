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

app.post("/deleteOrder",function(req,res){
    let userInput1 = req.body
    let data = userInput1['delete-order']
    console.log("userinput1",data)
    if (data === undefined){
        queryDeleteOrder = `SELECT 
        * FROM Orders;`
    }else{
        queryDeleteOrder = `DELETE 
                       FROM Orders
                       WHERE orderID = ${data};`
     }
     //Run query
     db.pool.query(queryDeleteOrder, function(error, rows, fields){
        // Save the customer
        return res.redirect('/orders')
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
                errorContent:"We're sorry for the inconvenience caused by our system's limitation on using the same email address twice. Your understanding is appreciated as we work to improve our services. "
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
    query1 = `INSERT INTO Orders (customerID, orderDate, creditCardNumb, creditCardExpDate,numOrderedItems,pricePaid) VALUES ('${data['input-customerID']}', '${data['input-orderDate']}', '${data['input-creditCardNumb']}','${data['input-creditCardExpDate']}', '${data['input-numOrderedItems']}','${data['input-pricePaid']}')`;
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


app.post('/add-item-form',function(req,res){
     // Capture the incoming data and parse it back to a JS object
     let data = req.body;
     console.log("recived data from  add order form:",data)
     // Create the query and run it on the database
     inserItems = `INSERT INTO Items (reviewID, categoryID, itemName, price) VALUES ('${data['input-reviewID']}', '${data['input-categoryID']}', '${data['input-item-name']}','${data['input-price']}')`;
     db.pool.query(inserItems, function(error, rows, fields){
 
         // Check to see if there was an error
         if (error) {
             // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
             console.log(error)
             res.status(404).render('error', {
                 page: req.url,
             });
         }
         else{
            res.redirect('/items',);
         }
     })


})

// POST ROUTE
app.post('/add-review-form',function(req,res){
    let data = req.body;
     console.log("recived data from  add-review-from form:",data)
     // Create the query and run it on the database
     inserItems = `INSERT INTO Reviews (customerID, overallRating, feedback) VALUES('${data['input-customerID']}', '${data['input-overall-rating']}', '${data['input-feedback']}')`;
     db.pool.query(inserItems, function(error, rows, fields){
         // Check to see if there was an error
         if (error) {
             // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
             console.log(error)
             res.status(404).render('error', {
                 page: req.url,
             });
         }
         else{
            res.redirect('/reviews',);
         }
     })


})


app.post('/add-category-form',function(req,res){
    let data = req.body;
    console.log ("data recevied in the add category form: ",data)
    let categoryQuery = `INSERT INTO Categories(categoryName) VALUES('${data['input-category-name']}')`;
    db.pool.query(categoryQuery, function(error, rows, fields){
        // Check to see if there was an error
        if (error){
            console.log(error)
            res.status(404).render('error', {
                page: req.url,
            });
        }else{
           res.redirect('/categories',);
        }
          
     });

});


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
    
    CustomerQU2 = "SELECT * FROM Customers;"

    db.pool.query(query1, function(error, orders, fields){
          
        db.pool.query(CustomerQU2,function(error,customer,fields){
                
           
            res.render(
                'orders',{orders:orders,
                customers:customer}
                );     
        })
       
    })
     
 });


 app.get('/items',function(req,res){
   
    queryReview = "SELECT * FROM Reviews;"
    queryCategory = "SELECT * FROM Categories"
    queryItems = "SELECT * FROM Items;"
    db.pool.query(queryReview, function(error, reviewRows, fields){
        db.pool.query(queryCategory, function(error, categoryRows, fields){
            db.pool.query(queryItems, function(error, itemrows, fields){  
               if (error){

               }else{
                res.render('items', {
                    Reviews:reviewRows,
                    Categories: categoryRows,
                    Items: itemrows
                });  
               }
                
            })

        })
       
    })
     
 });

 app.get('/categories',function(req,res){
   
    query4 = "SELECT * FROM Categories;";
    db.pool.query(query4, function(error, rows, fields){
        
        // Use the data to render the HTML page
        let categories = rows;
        res.render('categories', {data:categories});  
    })
     
 });

 app.get('/reviews',function(req,res){
   
    queryReview = "SELECT * FROM Reviews;";
    queryCustomer = "SELECT * FROM Customers;"
    db.pool.query( queryReview, function(error, reviewRows, fields){
        
        db.pool.query(queryCustomer , function(error, customerRows, fields){
            
            res.render('reviews', {Reviews:reviewRows,
                Customers: customerRows
            }); 
        })
         
    })
     
 });


 app.get('/home',function(req,res){
   
    res.render('home',{title: "Home Page",
        path:"./public/img/OSU_symbol.jpeg"

    });  
    
 });



/*=============================LISTENER=========================*/
app.listen(PORT, function () {
    console.log("express start to listen:",PORT + '; press Ctrl-C to terminate.');
});

