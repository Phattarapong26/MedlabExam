
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





                <div className={Styles.ColA}>ตำแหน่งจัดเก็บ</div>
                <Gauge
                  width={200}
                  height={200}
                  cornerRadius="50%"
                  value={allLocation - emptyLocation}
                  valueMax={allLocation}
                  text={
                    emptyLocation == 0
                      ? "เต็ม"
                      : `${allLocation - emptyLocation} / ${allLocation}`
                  }
                  sx={(theme) => ({
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 40,
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                      fill: `${
                        emptyLocation != 0 &&
                        emptyLocation <= Math.floor(allLocation * 0.5)
                          ? "#0fe3ae"
                          : emptyLocation == 0
                          ? "#FC6A03" //เต็ม
                          : "#52b202" //ว่าง
                      }`,
                    },
                    [`& .${gaugeClasses.valueMax}`]: {
                      fill: "#1f1f1f",
                    },
                    [`& .${gaugeClasses.referenceArc}`]: {
                      fill: theme.palette.text.disabled,
                    },
                  })}
                />
                <div className={Styles.ColD}>
                  <div>ทั้งหมด {allLocation}</div>
                  <div>ใช้ไป {allLocation - emptyLocation}</div>
                  <div>เหลือ {emptyLocation}</div>
                </div>
              </div>