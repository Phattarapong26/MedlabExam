const mysql = require("mysql");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
const secret = "MEDLABGLOBAL";


const app = express();

// Middleware
app.use(cors({
  credentials: true,
  origin: "http://localhost:5173", // Adjust the origin as needed
  exposedHeaders: ["SET-COOKIE"],
}));
app.use(cookieParser());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  port: "3306",
  password: "root",
  database: "medlab",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

app.get("/getAllLocation", (req, res) => {
  const page = req.query.page || 1; // Default to page 1 if not specified
  const limit = 3; // Locations per page

  const offset = (page - 1) * limit;

  const query = `
    SELECT *
    FROM location
    LIMIT ${limit}
    OFFSET ${offset}`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching location data:", err);
      res.status(500).json({ status: "error", message: "Internal server error" });
      return;
    }
    res.json({ status: "success", locations: result });
  });
});

app.get('/events', (req, res) => {
  db.query('SELECT * FROM events', (err, results) => {
    if (err) {
      console.error('Error fetching events from database:', err);
      res.status(500).json({ error: 'Error fetching events from database' });
      return;
    }
    res.status(200).json(results);
  });
});

// POST endpoint to create events
app.post('/events', (req, res) => {
  const eventData = req.body;

  // Validate request body
  if (!eventData || !eventData.title || !eventData.start_date || !eventData.start_time || !eventData.end_date || !eventData.end_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Insert event data into the events table
  db.query('INSERT INTO events (title, description, start_date, start_time, end_date, end_time, notifications_value, notifications_unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [eventData.title, eventData.description, eventData.start_date, eventData.start_time, eventData.end_date, eventData.end_time, eventData.notifications_value, eventData.notifications_unit],
    (err, result) => {
      if (err) {
        console.error('Error inserting event into database:', err);
        res.status(500).json({ error: 'Error inserting event into database' });
        return;
      }
      console.log('Event inserted into database:', result.insertId);
      res.status(201).json({ message: 'Event created successfully' });
    });
});

// PUT endpoint to update events
app.put('/events/:id', (req, res) => {
  const eventId = req.params.id;
  const eventData = req.body;

  // Validate request body
  if (!eventData || !eventData.title || !eventData.start_date || !eventData.start_time || !eventData.end_date || !eventData.end_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Update event data in the events table
  db.query('UPDATE events SET title=?, description=?, start_date=?, start_time=?, end_date=?, end_time=?, notifications_value=?, notifications_unit=? WHERE id=?',
    [eventData.title, eventData.description, eventData.start_date, eventData.start_time, eventData.end_date, eventData.end_time, eventData.notifications_value, eventData.notifications_unit, eventId],
    (err, result) => {
      if (err) {
        console.error('Error updating event in database:', err);
        return res.status(500).json({ error: 'Error updating event in database' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
      console.log('Event updated in database:', eventId);
      res.status(200).json({ message: 'Event updated successfully' });
    });
});

// DELETE endpoint to delete events
app.delete('/events/:id', (req, res) => {
  const eventId = req.params.id;

  // Delete event data from the events table
  db.query('DELETE FROM events WHERE id=?', [eventId],
    (err, result) => {
      if (err) {
        console.error('Error deleting event from database:', err);
        res.status(500).json({ error: 'Error deleting event from database' });
        return;
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
      console.log('Event deleted from database:', eventId);
      res.status(200).json({ message: 'Event deleted successfully' });
    });
});


// create user
app.post("/createAccount", jsonParser, (req, res) => {
  const user_name = req.body.user_name;
  const user_password = req.body.user_password;
  const name = req.body.name;
  const surname = req.body.surname;
  const role = req.body.role;
  const withdraw = req.body.withdraw;
  const add_new = req.body.add_new;
  bcrypt.hash(user_password, saltRounds, function (err, hash) {
    db.query(
      "INSERT INTO user (user_name, user_password, name, surname, role, withdraw, add_new) VALUES(?,?,?,?,?,?,?)",
      [user_name, hash, name, surname, role, withdraw, add_new],
      (err, result) => {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        } else {
          res.json({
            status: "success",
            message: "Account created successfully",
          });
        }
      }
    );
  });
});

app.post('/LoginNEw', jsonParser, (req, res) => {
  const user_name = req.body.user_name;
  const user_password = req.body.user_password;

  db.query(
    'SELECT * FROM usernew WHERE user_name = ? AND user_password = ?',
    [user_name, user_password],
    (err, result) => {
      if (err) {
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        return;
      }
      if (result.length === 0) {
        res.status(404).json({ status: 'not found', message: 'User not found' });
        return;
      }
      res.status(200).json({ status: 'success', message: 'Login successfully' });
    }
  );
});


// //login and gen jwt token
// app.post("/login", jsonParser, (req, res) => {
//   const user_name = req.body.user_name;
//   const user_password = req.body.user_password;
//   const role = req.body.role;

//   db.query(
//     //check user account in database
//     "SELECT * FROM user WHERE user_name= ? AND role = ?",
//     [user_name, role],
//     (err, user) => {
//       if (err) {
//         res.json({ status: "error", message: err });
//         return;
//       }
//       //if user not found return "not found"
//       if (user.length == 0) {
//         res.json({ status: "not found", message: "User not found" });
//         return;
//       }
//       //if all value correct return jwt token and status
//       bcrypt.compare(
//         user_password,
//         user[0].user_password,
//         function (err, result) {
//           if (result) {
//             const tokenUsername = jwt.sign(
//               { user_name: user[0].user_name },
//               secret,
//               { expiresIn: "1h" }
//             );
//             res.cookie("token", tokenUsername, {
//               // maxAge: 500000,
//               httpOnly: true,
//               // sameSite:"none",
//             });
//             res.json({
//               status: "success",
//               message: "Login successfully",
//             });
//           } else {
//             res.json({ status: "error", message: "Login failed" });
//             return;
//           }
//         }
//       );
//     }
//   );
// });

// // check jwt token and return user detail for check withdraw and add_new rights
// app.get("/authen", jsonParser, (req, res) => {
//   try {
//     const token = req.cookies.token;
//     const user = jwt.verify(token, secret);
//     db.query(
//       "SELECT user_name,name,surname,role,withdraw,add_new,purchase FROM user where user_name = ?",
//       user.user_name,
//       (err, result) => {
//         if (err) {
//           res.json({ status: "error", message: err });
//           return;
//         } else {
//           res.send(result);
//         }
//       }
//     );
//   } catch (err) {
//     res.json({ status: "error", message: err.message });
//   }
// });

// app.get("/logout", jsonParser, (req, res) => {
//   res.clearCookie("token");
//   res.send("Cooking Cleared");
// });

app.get("/userList", jsonParser, (req, res) => {
  const sql = `
  SELECT name,surname, role, withdraw, add_new, purchase, role_name 
  FROM user INNER JOIN user_role ON user.role = user_role.role_id `;
  db.query(sql, (err, result) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      res.send(result);
    }
  });
});
app.post("/getUserDetail", jsonParser, (req, res) => {
  const user_name = req.body.username;

  db.query(
    "SELECT * FROM user WHERE user_name = ?",
    user_name,
    (err, result) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      } else {
        res.send(result);
      }
    }
  );
});

// ----- Product -----

app.get("/product", jsonParser, (req, res) => {
  db.query(
    "SELECT * FROM product INNER JOIN unit ON product.unit = unit.unit_id INNER JOIN type ON product.type = type.type_id INNER JOIN category ON product.category = category.category_id ORDER by cast(id as unsigned)",
    (err, result) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/getQuantity", jsonParser, (req, res) => {
  const id = req.body.id;
  db.query(
    "SELECT SUM(quantity) as p_quantity FROM lot WHERE p_id =? AND location_id IS NOT NULL",
    id,
    (err, result) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/inventorySummary", (req, res) => {
  // Count total products
  const countProductQuery = "SELECT COUNT(*) as totalProduct FROM product";

  // Show low stock products (excluding quantity = 0)
  const showLowStockQuery = `
    SELECT
        product.id AS p_id,
        product.name AS p_name,
        unit.unit_name AS unit,
        product.low_stock,
        IFNULL(SUM(lot.quantity), 0) AS total_quantity,
        CASE
            WHEN IFNULL(SUM(lot.quantity), 0) <= product.low_stock THEN 'Low Stock'
            ELSE 'Sufficient Stock'
        END AS stock_status
    FROM
        product
    LEFT JOIN
        lot ON product.id = lot.p_id
    LEFT JOIN
        unit ON product.unit = unit.unit_id
    WHERE lot.quantity > 0 AND lot.location_id IS NOT NULL
    GROUP BY
        lot.p_id,product.id`;

  // Show products with quantity = 0 or null
  const showOutOfStockProductsQuery = `
    SELECT
        product.id AS p_id,
        product.name AS p_name,
        product.low_stock,
        IFNULL(SUM(lot.quantity), 0) AS total_quantity,
        CASE
            WHEN IFNULL(SUM(lot.quantity), 0) <= 0 THEN 'Out of Stock'  -- Change label to 'Out of Stock'
        END AS stock_status
    FROM
        product
    LEFT JOIN
        lot ON product.id = lot.p_id
    WHERE lot.quantity <= 0 OR lot.quantity IS NULL  -- Include only products with quantity = 0 or null
    GROUP BY
        product.id`;

  const overdueLotsQuery = `
    SELECT *,DATEDIFF(exp_date, CURRENT_DATE) AS days_overdue
    FROM lot
    LEFT JOIN product ON lot.p_id = product.id
    LEFT JOIN location ON lot.location_id = location.location_id
    LEFT JOIN warehouse ON warehouse.warehouse_id = location.warehouse_id
    WHERE DATEDIFF(exp_date, CURRENT_DATE) <= before_date`;

  db.query(countProductQuery, (err, productResult) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    }
    const totalProductCount = productResult[0].totalProduct;

    db.query(showLowStockQuery, (err, lowStockResult) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      const lowStockProducts = lowStockResult.filter(
        (product) => product.stock_status === "Low Stock"
      );

      db.query(showOutOfStockProductsQuery, (err, outOfStockProductsResult) => {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        }
        const outOfStockProducts = outOfStockProductsResult;

        db.query(overdueLotsQuery, (err, overdueLotsResult) => {
          if (err) {
            res.json({ status: "error", message: err });
            return;
          }

          res.json({
            status: "success",
            total_product_count: totalProductCount,
            low_stock_products: lowStockProducts,
            out_of_stock_products: outOfStockProducts,
            overdue_lots: overdueLotsResult,
          });
        });
      });
    });
  });
});

app.post("/checkProductID", jsonParser, (req, res) => {
  const id = req.body.id;
  db.query(
    "SELECT COUNT(*) as countID FROM product where id = ?",
    id,
    (err, result) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/addNewProduct", jsonParser, (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const low_stock = req.body.low_stock;
  const unit = req.body.unit;
  const type = req.body.type;
  const category = req.body.category;
  const detail = req.body.detail;
  const direction = req.body.direction;

  db.query(
    "INSERT INTO product (id, name, low_stock, unit, type, category, detail, direction) VALUES(?,?,?,?,?,?,?,?)",
    [id, name, low_stock, unit, type, category, detail, direction],
    (err, result) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      } else {
        res.json({ status: "success", message: "Insert  Successfully" });
      }
    }
  );
});

// Get product detail for edit
app.post("/getDetail", jsonParser, (req, res) => {
  const id = req.body.id;
  const sql = `
  SELECT * FROM product 
  INNER JOIN unit ON product.unit = unit.unit_id 
  INNER JOIN type ON product.type = type.type_id 
  INNER JOIN category ON product.category = category.category_id
  WHERE id = ?
  `;
  db.query(sql, id, (err, result) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      res.send(result);
    }
  });
});

app.put("/updateProduct", jsonParser, (req, res) => {
  const id = req.body.id;
  const low_stock = req.body.low_stock;
  const name = req.body.name;
  const unit = req.body.unit;
  const type = req.body.type;
  const category = req.body.category;
  const detail = req.body.detail;
  const direction = req.body.direction;
  db.query(
    "UPDATE product SET id = ?, name = ?, low_stock = ?, unit = ?, type = ?, category = ?, detail = ?, direction = ? WHERE id = ?",
    [id, name, low_stock, unit, type, category, detail, direction, id],
    (err, result) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/removeProduct", jsonParser, (req, res) => {
  const id = req.body.id;
  db.query("DELETE FROM product WHERE id = ?", id, (err, result) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      res.json({ status: "success", message: "Delete  Successfully" });
    }
  });
});

app.get("/getUnit", jsonParser, (req, res) => {
  db.query("SELECT * FROM unit", (err, result) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      res.send(result);
    }
  });
});
app.get("/getType", jsonParser, (req, res) => {
  db.query("SELECT * FROM type", (err, result) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      res.send(result);
    }
  });
});
app.get("/getCategory", jsonParser, (req, res) => {
  db.query("SELECT * FROM category", (err, result) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      res.send(result);
    }
  });
});

// ----- Order -----
app.post("/purchase", jsonParser, (req, res) => {
  const user_name = req.body.user_name;
  const orderList = req.body.orderList;
  let purchase_id;

  db.query(
    "INSERT INTO purchase (purcher) VALUES (?)",
    user_name,
    (err, result) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      } else {
        purchase_id = result.insertId;
        const sql = "INSERT INTO lot (p_id, quantity) VALUES ?";
        const values = orderList.map((order) => [order.p_id, order.quantity]);

        db.query(sql, [values], (err, lotResult) => {
          if (err) {
            res.json({ status: "error", message: err });
            return;
          } else {
            const lotIds = [];
            for (let i = 0; i < lotResult.affectedRows; i++) {
              lotIds.push(lotResult.insertId + i);
            }

            const purchaseDetailValues = orderList.map((order, index) => [
              purchase_id,
              lotIds[index],
              order.p_id,
              order.quantity,
            ]);

            db.query(
              "INSERT INTO purchase_detail (purchase_id, lot_id, p_id, quantity) VALUES ?",
              [purchaseDetailValues],
              (err, purchaseDetailResult) => {
                if (err) {
                  res.json({ status: "error", message: err });
                  return;
                } else {
                  res.json({
                    status: "success",
                    message: "Insert Successfully",
                    purchase_id: purchase_id,
                  });
                }
              }
            );
          }
        });
      }
    }
  );
});

app.post("/purchaseDetail", jsonParser, (req, res) => {
  const purchase_id = req.body.purchase_id;
  const sql = `
  SELECT * FROM purchase_detail
  INNER JOIN lot ON purchase_detail.lot_id = lot.lot_id
  INNER JOIN product ON lot.p_id = product.id
  INNER JOIN unit ON product.unit = unit.unit_id
  WHERE purchase_id = ?
  `;
  db.query(sql, purchase_id, (err, result) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      res.send(result);
    }
  });
});

// ----- Warehouse, Location -----
app.get("/getWarehouse", jsonParser, (req, res) => {
  db.query("SELECT * FROM warehouse", (err, result) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      res.send(result);
    }
  });
});
app.post("/createWarehouse", jsonParser, (req, res) => {
  const name = req.body.name;
  db.query(
    "SELECT * FROM warehouse WHERE warehouse_name = ?",
    name,
    (err, result) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      } else if (result.length > 0) {
        res.json({
          status: "Already",
          message: "Warehouse name already exist",
        });
        return;
      } else {
        db.query(
          "INSERT INTO warehouse (warehouse_name) VALUES (?)",
          name,
          (err, result) => {
            if (err) {
              res.json({ status: "error", message: err });
              return;
            } else {
              res.send(result);
            }
          }
        );
      }
    }
  );
});

app.post("/Warehouse", jsonParser, (req, res) => {
  const warehouse_id = req.body.warehouse_id;

  // get total locations in warehouse
  const totalLocations = `
      SELECT COUNT(*) AS total_locations
      FROM location
      WHERE warehouse_id = ?`;

  // get total lots in warehouse along with count where before_date >= DATEDIFF(exp_date, due_date)
  const totalLots = `
      SELECT
        COUNT(lot.lot_id) AS total_lots,
        SUM(CASE WHEN lot.before_date >= DATEDIFF(lot.exp_date, lot.due_date) THEN 1 ELSE 0 END) AS total_lots_before_date
      FROM location l
      LEFT JOIN lot ON l.location_id = lot.location_id
      WHERE l.warehouse_id = ?
      GROUP BY l.location_id`;

  // Execute total locations query
  db.query(totalLocations, warehouse_id, (err, totalLocationsResult) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    }

    db.query(totalLots, warehouse_id, (err, totalLotsResult) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }

      const totalLotsCount = totalLotsResult.reduce(
        (total, current) => total + current.total_lots,
        0
      );
      const totalLotsBeforeDateCount = totalLotsResult.reduce(
        (total, current) => total + current.total_lots_before_date,
        0
      );

      res.json({
        status: "success",
        total_locations: totalLocationsResult[0].total_locations,
        total_lots: totalLotsCount,
        total_lots_before_date: totalLotsBeforeDateCount,
      });
    });
  });
});

app.post("/WarehouseDetail", jsonParser, (req, res) => {
  const warehouse_id = req.body.warehouse_id;

  const lotsInLocation = `
      SELECT  * , DATEDIFF(lot.exp_date, lot.due_date) AS days_left
      FROM location
      LEFT JOIN warehouse ON warehouse.warehouse_id = location.warehouse_id
      LEFT JOIN lot ON location.location_id = lot.location_id  
      LEFT JOIN product ON lot.p_id = product.id
      LEFT JOIN unit ON product.unit = unit.unit_id
      WHERE location.warehouse_id = ? OR lot.location_id = NULL
      ORDER BY location.Location_name;`;

  db.query(lotsInLocation, warehouse_id, (err, result) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      res.send(result);
    }
  });
});

app.delete("/deleteWarehouse", jsonParser, (req, res) => {
  const warehouse_id = req.body.warehouse_id;

  db.query(
    "SELECT * FROM location WHERE warehouse_id = ?",
    [warehouse_id],
    (err, result) => {
      if (!result.length) {
        db.query(
          "DELETE FROM warehouse WHERE warehouse_id = ?",
          warehouse_id,
          (err, result) => {
            if (err) {
              res.json({ status: "error", message: err });
              return;
            } else {
              res.json({ status: "success", message: "Delete  Successfully" });
            }
          }
        );
      } else {
        res.json({
          status: "error",
          message: "Cannot delete warehouse with existing location",
        });
      }
    }
  );
});

app.post("/createLocation", jsonParser, (req, res) => {
  const location_name = req.body.location_name;
  const warehouse_id = req.body.warehouse_id;

  db.query(
    "SELECT * FROM location WHERE Location_name = ?",
    location_name,
    (err, location) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      } else if (location.length > 0) {
        res.json({
          status: "Already",
          message: "Warehouse name already exist",
        });
      } else {
        db.query(
          "INSERT INTO location (Location_name , warehouse_id) VALUES (?,?)",
          [location_name, warehouse_id],
          (err, result) => {
            if (err) {
              res.json({ status: "error", message: err });
              return;
            } else {
              res.send(result);
            }
          }
        );
      }
    }
  );
});

app.delete("/deleteLocation", jsonParser, (req, res) => {
  const location_name = req.body.location_name;

  db.query(
    "DELETE FROM location WHERE Location_name = ?",
    location_name,
    (err, result) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      } else {
        res.json({ status: "success", message: "Delete  Successfully" });
      }
    }
  );
});

//get all and empty location
app.get("/getAllLocation", jsonParser, (req, res) => {
  const allLocation = `SELECT * FROM location`;
  const emptyLocation = `
    SELECT location.*
    FROM location
    LEFT JOIN lot ON location.location_id = lot.location_id
    WHERE lot.location_id IS NULL`;

  db.query(allLocation, (err, allLocationResult) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      const allLocations = allLocationResult;

      db.query(emptyLocation, (err, emptyLocationResult) => {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        } else {
          const emptyLocations = emptyLocationResult;

          res.json({
            status: "success",
            all_locations: allLocations,
            empty_locations: emptyLocations,
          });
        }
      });
    }
  });
});

// ----- Import -----
// Get Empty Location

app.get("/getEmptyLocation", jsonParser, (req, res) => {
  const sql = `
  SELECT warehouse.warehouse_id, warehouse.warehouse_name,location.location_id, location.Location_name
  FROM location 
  LEFT JOIN warehouse ON location.warehouse_id = warehouse.warehouse_id
  LEFT JOIN lot ON location.location_id = lot.location_id 
  WHERE lot.location_id IS NULL`;
  db.query(sql, (err, result) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      res.send(result);
    }
  });
});

app.post("/getDetailForImport", jsonParser, (req, res) => {
  const purchase_id = req.body.purchase_id;

  // Query to check if there are any purchase records for the given purchase ID
  let purchaseCheck = `
    SELECT COUNT(*) AS purchaseCount
    FROM purchase
    WHERE purchase_id = ?`;

  db.query(purchaseCheck, purchase_id, (err, purchaseCheckResult) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    }

    const purchaseCount = purchaseCheckResult[0].purchaseCount;

    if (purchaseCount === 0) {
      res.json({
        status: "No purchase order",
        message: "No purchase order found for the given purchase ID",
      });
      return;
    }

    // Query to count occurrences of lot.location_id that are not null
    let LocationCount = `
      SELECT COUNT(*) AS locationCount
      FROM purchase_detail
      WHERE purchase_id = ?  AND location_id IS NOT NULL`;

    // Query to count occurrences of lot.exp_date that are empty
    let ExpDateCount = `
      SELECT COUNT(*) AS expDateCount
      FROM lot
      LEFT JOIN purchase_detail ON lot.lot_id = purchase_detail.lot_id
      WHERE purchase_detail.purchase_id = ? AND lot.exp_date IS NULL`;

    db.query(LocationCount, purchase_id, (err, locationResult) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }

      const locationCount = locationResult[0].locationCount;

      if (locationCount > 0) {
        res.json({
          status: "Imported",
          message: "Locations are already imported",
        });
        return;
      }

      // Execute the query to count empty exp_dates
      db.query(ExpDateCount, purchase_id, (err, expDateResult) => {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        }
        const expDateCount = expDateResult[0].expDateCount;
        // If waiting for vendor, send response
        if (expDateCount > 0) {
          res.json({
            status: "Waiting",
            message: "Waiting for vendor to provide expiration dates",
          });
          return;
        }

        // Query to retrieve purchase details
        let sql = `
          SELECT *
          FROM purchase_detail
          LEFT JOIN purchase ON purchase.purchase_id = purchase_detail.purchase_id
          LEFT JOIN lot ON lot.lot_id = purchase_detail.lot_id
          LEFT JOIN product ON product.id = lot.p_id
          LEFT JOIN unit ON product.unit = unit.unit_id
          LEFT JOIN location ON location.location_id = lot.location_id
          WHERE purchase.purchase_id = ?`;

        // Execute the main query
        db.query(sql, purchase_id, (err, result) => {
          if (err) {
            res.json({ status: "error", message: err });
            return;
          } else {
            if (result.length === 0) {
              res.json({
                status: "Not found",
                message: "No records found for the given purchase ID",
              });
            } else {
              res.json({ status: "success", data: result });
            }
          }
        });
      });
    });
  });
});

app.put("/import", jsonParser, (req, res) => {
  const purchase_id = req.body.purchase_id;
  const user_name = req.body.user_name;
  const updateList = req.body.updateList;

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.json({
        status: "error",
        message: "Transaction failed to start",
      });
    }

    // Insert into import table
    let importSQL = `INSERT INTO import (purchase_id, importer) VALUES (?, ?)`;
    db.query(importSQL, [purchase_id, user_name], (err, importResult) => {
      if (err) {
        // Rollback transaction if insert operation fails
        return db.rollback(() => {
          res.json({
            status: "error",
            message: "Failed to import data",
            error: err,
          });
        });
      }

      // Update location_id in lot table for each item in updateList array
      let updatePromises = updateList.map((updateItem) => {
        return new Promise((resolve, reject) => {
          // Update location_id in lot table
          let updateLot = `UPDATE lot SET location_id = ?, before_date = ? WHERE lot_id = ?`;
          db.query(
            updateLot,
            [updateItem.location_id, updateItem.before_date, updateItem.lot_id],
            (err, updateLotResult) => {
              if (err) {
                reject(err);
              } else {
                // Update location_id in purchase_detail table
                let updatePurchaseDetail = `UPDATE purchase_detail SET location_id = ? WHERE lot_id = ?`;
                db.query(
                  updatePurchaseDetail,
                  [updateItem.location_id, updateItem.lot_id],
                  (err, updatePurchaseDetailResult) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(updatePurchaseDetailResult);
                    }
                  }
                );
              }
            }
          );
        });
      });

      // Execute all update promises
      Promise.all(updatePromises)
        .then(() => {
          // Commit transaction if all updates are successful
          db.commit((err) => {
            if (err) {
              // Rollback transaction if commit fails
              return db.rollback(() => {
                res.json({
                  status: "error",
                  message: "Failed to commit transaction",
                  error: err,
                });
              });
            }
            // If everything is successful, send success response
            res.json({ status: "success", message: "Imported Successfully" });
          });
        })
        .catch((updateErr) => {
          // Rollback transaction if any update operation fails
          return db.rollback(() => {
            res.json({
              status: "error",
              message: "Failed to update location",
              error: updateErr,
            });
          });
        });
    });
  });
});

// ----- Export -----
app.post("/getDetailForExport", jsonParser, (req, res) => {
  const p_id = req.body.id;

  db.query(
    "SELECT SUM(quantity) AS total_quantity FROM lot WHERE p_id = ? GROUP BY p_id",
    [p_id],
    (err, result) => {
      if (err) {
        res.json({ status: "error", message: err });
      } else {
        res.json({ status: "success", data: result });
      }
    }
  );
});

app.put("/export", (req, res) => {
  const exportOrders = req.body.exportOrders;
  const exporter = req.body.exporter;
  const receiver = req.body.receiver;
  let exportId;

  // Start transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
      return;
    }

    // Insert record into export table
    db.query(
      "INSERT INTO export (exporter,receiver) VALUES (?,?)",
      [exporter, receiver],
      (err, exportResult) => {
        if (err) {
          console.error("Error inserting into export table:", err);
          db.rollback(() => {
            res
              .status(500)
              .json({ status: "error", message: "Internal Server Error" });
          });
          return;
        }
        // Retrieve the generated export_id
        exportId = exportResult.insertId;

        // Function to handle export of each order
        const processExport = (order) => {
          return new Promise((resolve, reject) => {
            const { p_id, quantity } = order;
            let remainingQuantity = quantity;

            const sql = `
            SELECT * FROM lot
            WHERE p_id = ?
            ORDER BY exp_date ASC
          `;
            db.query(sql, [p_id], (err, result) => {
              if (err) {
                console.error("Error retrieving lot:", err);
                reject(err);
                return;
              }

              // Iterate through the lots to export the required quantity
              for (const lot of result) {
                if (remainingQuantity <= 0) break;

                const availableQuantity = Math.min(
                  lot.quantity,
                  remainingQuantity
                );

                // Insert a record into export_detail for each lot export, including export_id and location_id
                db.query(
                  "INSERT INTO export_detail (export_id, lot_id, p_id, quantity, location_id) VALUES (?, ?, ?, ?, ?)",
                  [
                    exportId,
                    lot.lot_id,
                    lot.p_id,
                    availableQuantity,
                    lot.location_id,
                  ],
                  (err, exportDetailResult) => {
                    if (err) {
                      console.error("Error inserting export detail:", err);
                      reject(err);
                      return;
                    }
                  }
                );

                // Update the remaining quantity in the lot
                const updatedQuantity = lot.quantity - availableQuantity;
                db.query(
                  "UPDATE lot SET quantity = ? WHERE lot_id = ?",
                  [updatedQuantity, lot.lot_id],
                  (err, updateResult) => {
                    if (err) {
                      console.error("Error updating lot quantity:", err);
                      reject(err);
                      return;
                    }

                    // Set location_id to null if quantity becomes zero
                    if (updatedQuantity === 0) {
                      db.query(
                        "UPDATE lot SET location_id = NULL WHERE lot_id = ?",
                        [lot.lot_id],
                        (err, updateLocationResult) => {
                          if (err) {
                            console.error("Error updating lot location:", err);
                            reject(err);
                            return;
                          }
                        }
                      );
                    }
                  }
                );

                remainingQuantity -= availableQuantity;
              }

              if (remainingQuantity > 0) {
                console.error(
                  `Insufficient quantity available for product ID ${productId}`
                );
                reject(
                  new Error(
                    `Insufficient quantity available for product ID ${productId}`
                  )
                );
                return;
              }

              resolve();
            });
          });
        };

        const promises = [];

        // Iterate through each export order and process export
        exportOrders.forEach((order) => {
          promises.push(processExport(order));
        });

        // Execute all promises and commit transaction
        Promise.all(promises)
          .then(() => {
            db.commit((err) => {
              if (err) {
                console.error("Error committing transaction:", err);
                res
                  .status(500)
                  .json({ status: "error", message: "Internal Server Error" });
                return;
              }
              res.json({
                status: "success",
                export_id: exportId,
                message: "Products exported successfully",
              });
            });
          })
          .catch((error) => {
            console.error("Error processing export:", error);
            db.rollback(() => {
              res
                .status(500)
                .json({ status: "error", message: "Internal Server Error" });
            });
          });
      }
    );
  });
});

app.post("/exportDetail", jsonParser, (req, res) => {
  const exportID = req.body.export_id;
  const sql = `
  SELECT *, export_detail.location_id, export_detail.quantity FROM export_detail 
  INNER JOIN lot ON export_detail.lot_id = lot.lot_id
  INNER JOIN location ON export_detail.location_id = location.location_id
  INNER JOIN product ON lot.p_id = product.id
  INNER JOIN unit ON product.unit = unit.unit_id
  INNER JOIN export ON export_detail.export_id = export.export_id
  WHERE export_detail.export_id = ?`;
  db.query(sql, exportID, (err, result) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      // Check if result array is empty
      if (result.length === 0) {
        res.json({ status: "No data", message: "No data", data: [] });
        return;
      }
      res.send(result);
    }
  });
});

// ----- History -----
app.get("/purchaseHistory", jsonParser, (req, res) => {
  db.query("SELECT * FROM purchase", (err, purchaseResult) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      // Check if purchaseResult array is empty
      if (purchaseResult.length === 0) {
        res.json({ status: "No data", message: "No data", data: [] });
        return;
      }

      const purchaseIds = purchaseResult.map(
        (purchase) => purchase.purchase_id
      );
      const sql = `
        SELECT *,purchase_detail.quantity FROM purchase_detail
        LEFT JOIN purchase ON purchase.purchase_id = purchase_detail.purchase_id
        LEFT JOIN lot on purchase_detail.lot_id = lot.lot_id   
        LEFT JOIN product ON product.id = purchase_detail.p_id
        LEFT JOIN unit ON product.unit = unit.unit_id
        LEFT JOIN location ON location.location_id = purchase_detail.location_id
        WHERE purchase.purchase_id IN (?)`;

      db.query(sql, [purchaseIds], (err, detailResult) => {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        } else {
          const combinedData = purchaseResult.map((purchase) => {
            const details = detailResult.filter(
              (detail) => detail.purchase_id === purchase.purchase_id
            );
            return { ...purchase, details };
          });
          res.json({ status: "success", data: combinedData });
        }
      });
    }
  });
});

app.get("/importHistory", jsonParser, (req, res) => {
  db.query("SELECT * FROM import", (err, importResult) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      if (importResult.length === 0) {
        res.json({
          status: "No import",
          message: "No import records found",
        });
        return;
      }

      const purchaseIds = importResult.map((imp) => imp.purchase_id);
      const sql = `
        SELECT *,purchase_detail.quantity FROM purchase_detail
        LEFT JOIN purchase ON purchase.purchase_id = purchase_detail.purchase_id
        LEFT JOIN lot ON lot.lot_id = purchase_detail.lot_id
        LEFT JOIN product ON product.id = purchase_detail.p_id
        LEFT JOIN unit ON product.unit = unit.unit_id
        LEFT JOIN location ON location.location_id = purchase_detail.location_id
        WHERE purchase_detail.purchase_id IN (?)`;

      db.query(sql, [purchaseIds], (err, detailResult) => {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        } else {
          const combinedData = importResult.map((imp) => {
            const details = detailResult.filter(
              (detail) => detail.purchase_id === imp.purchase_id
            );
            return { ...imp, details };
          });
          res.json({ status: "success", data: combinedData });
        }
      });
    }
  });
});

app.get("/exportHistory", jsonParser, (req, res) => {
  db.query("SELECT * FROM export", (err, exportResult) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    } else {
      if (exportResult.length === 0) {
        res.json({
          status: "No import",
          message: "No import records found",
        });
        return;
      }

      const exportIds = exportResult.map((imp) => imp.export_id);
      const sql = `
      SELECT *, export_detail.location_id, export_detail.quantity FROM export_detail 
      INNER JOIN lot ON export_detail.lot_id = lot.lot_id
      INNER JOIN location ON export_detail.location_id = location.location_id
      INNER JOIN product ON lot.p_id = product.id
      INNER JOIN unit ON product.unit = unit.unit_id
      INNER JOIN export ON export_detail.export_id = export.export_id
      WHERE export_detail.export_id IN (?)`;

      db.query(sql, [exportIds], (err, detailResult) => {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        } else {
          const combinedData = exportResult.map((imp) => {
            const details = detailResult.filter(
              (detail) => detail.export_id === imp.export_id
            );
            return { ...imp, details };
          });
          res.json({ status: "success", data: combinedData });
        }
      });
    }
  });
});


app.get('/gauge', (req, res) => {
  connection.query('SELECT COUNT(*) as allLocation, SUM(CASE WHEN location_id IS NULL THEN 1 ELSE 0 END) as emptyLocation FROM location', (err, results) => {
    if (err) throw err;

    const allLocation = results[0].allLocation;
    const emptyLocation = results[0].emptyLocation;

    res.json({
      allLocation,
      emptyLocation,
      usedLocation: allLocation - emptyLocation
    });
  });
});



app.listen("3000", () => {
  console.log("Server is running on port 3000");
});
