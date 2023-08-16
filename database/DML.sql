-- ************************************************************************
--                         Requirment
-- We have 5 tables( Categories, Cutstomers, Items, Orders, Reviews) and 1 composite table(ordersItem): we need to  implement 3 SELECTS, 5 INSERTS, 1 update(M:N),1 DELETE (M:N; )causing no data anomalies), 1 NULLable relationship, and 1 Search/Dynamic for a total of 14 functions.
-- *************************************************************************


-- *************************************************************************
--                      Select Statements
--         for displying and searching/filtering
-- ************************************************************************

-- Displying data from database
SELECT * FROM Customers;
SELECT orderID, customerID, DATE_FORMAT(orderDate, '%b %e, %Y') as orderDate, creditCardNumb, DATE_FORMAT(creditCardExpDate, '%b %e, %Y') as creditCardExpDate, numOrderedItems, pricePaid 
FROM Orders;

SELECT * FROM Items;

SELECT * FROM ordersItems;

SELECT * FROM Categories; 

SELECT * FROM Reviews;


-- For filterling stars level on the Reviews page
SELECT * FROM Reviews WHERE overallRating >=${data};
SELECT * FROM ordersItems where itemID =${text};
SELECT COUNT(*) as COUNT from Customers where customerID = ${id}

-- Select for the Dinamically search by last name on the Customers page 
SELECT * FROM Customers WHERE lastName LIKE ${req.query.lastName}%;
SELECT * FROM Customers WHERE lastName LIKE "${userInput}%"


-- *************************************************************************
--                      Insert Statements
--                5 Insert statements to add new thing on each page
-- ************************************************************************
INSERT INTO Customers (firstName, lastName, emailAddress, address,city) 
VALUES ('${data['input-fname']}', '${data['input-lname']}', '${data['input-emailAdresses']}','${data['input-address']}', '${data['input-city']}');

INSERT INTO Categories(categoryName) VALUES('${data.categoryName}';

INSERT INTO Items (reviewID, categoryID, itemName, price) 
VALUES ('${data['input-reviewID']}', '${data['input-categoryID']}', '${data['input-item-name']}','${data['input-price']}');

 INSERT INTO Orders (customerID, orderDate, creditCardNumb, creditCardExpDate,numOrderedItems,pricePaid) 
 VALUES ('${data['input-orderID']}', '${data['input-orderDate']}', '${data['input-creditCardNumb']}','${data['input-creditCardExpDate']}', '${data['input-numOrderedItems']}','${data['input-pricePaid']}');

INSERT INTO Reviews (overallRating, feedback, customerID)
               VALUES (${rating}, "${text}", "${id}")

-- *************************************************************************
--                  Delete Statements
--             3 delete statements, two for our M:N, one for Customers page
-- ************************************************************************

DELETE FROM Customers WHERE customerID = ${data};

-- M: N
DELETE FROM Orders WHERE orderID = ${data};

DELETE FROM Items WHERE itemID = ${data}


-- *************************************************************************
--                      Update Statements
--                    Two updates for our M:N 
-- ************************************************************************

UPDATE Items 
SET itemName = "${itemNameVal}", price = "${priceVal}"
WHERE itemID = ${itemIDVal } AND reviewID = ${reviewIDVal} AND categoryID = ${categoryIDVal}

UPDATE Orders 
SET orderDate = "${orderDateVal}",creditCardNumb = "${creditCarNumbVal}", 
creditCardExpDate = "${creditCardExpDateVal}", numOrderedItems= "${numbOrderedItemVal}",
pricePaid = "${pricePaidVal}"
WHERE orderID = ${OrderIDVal} AND customerID = ${CustomerIDVal}

