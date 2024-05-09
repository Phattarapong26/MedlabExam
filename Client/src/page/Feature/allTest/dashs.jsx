import { useState, useEffect } from "react";
import NavBar from "../../Component/Navbar";
import Styles from "./dashs.module.css";
import Table from "react-bootstrap/Table";
import ProductChart from "./ProductChart";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

export function AppLayDash() {
  const [outOfStock, setOutOfStock] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [allLocation, setAllLocation] = useState(0);
  const [emptyLocation, setEmptyLocation] = useState(0);

  const fetchInventorySummary = async () => {
    try {
      const response = await fetch("http://localhost:3000/inventorySummary");
      const data = await response.json();
      if (data.status === "success") {
        setLowStock(data.low_stock_products);
        setOverdue(data.overdue_lots);
        setOutOfStock(data.out_of_stock_products);
      }
    } catch (error) {
      console.error("Error fetching inventory summary:", error);
    }
  };

  const fetchAllLocation = async () => {
    try {
      const response = await fetch("http://localhost:3000/getAllLocation");
      const data = await response.json();
      if (data.status === "success") {
        setAllLocation(data.all_locations.length);
        setEmptyLocation(data.empty_locations.length);
      }
    } catch (error) {
      console.error("Error fetching all locations:", error);
    }
  };
  const getColor = (emptyLocation, allLocation) => {
    if (emptyLocation != 0 && emptyLocation <= Math.floor(allLocation * 0.5)) {
      return "#FFD770";
    } else if (emptyLocation == 0) {
      return "#FC6A03";
    } else {
      return "#52b202";
    }
  };

  useEffect(() => {
    fetchInventorySummary();
    fetchAllLocation();
  }, []);
  return (
    <div className={Styles.dashsLayOut}>
      <NavBar />
      <div className={Styles.Undashs}>
        <div className={Styles.Gooddas}>
          <section>
              <div className={Styles.ListG}>
                <div className={Styles.CardList}>
                  <div className={Styles.Tsttt}>
                    <div className="card" style={{ height: "300px" }}>
                      <div className={Styles.Chartt}>
                        <ProductChart />
                      </div>
                    </div>
                  </div>
                  <div className={Styles.GaUG}>
                    <div className="row fs-4">ตำแหน่งจัดเก็บ</div>
                    <div className="col-12 d-flex justify-content-around align-items-center p-0 m-0">
                    <div className="col-md-6 col-sm-12 d-flex justify-content-center align-items-center">
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
        fill: getColor(emptyLocation, allLocation),
      },
      [`& .${gaugeClasses.valueMax}`]: {
        fill: "#1f1f1f",
      },
      [`& .${gaugeClasses.referenceArc}`]: {
        fill: theme.palette.text.disabled,
      },
    })}
  />
</div>
<div className="col-md-6 col-sm-12 fs-5">
  <div>ทั้งหมด {allLocation}</div>
  <div>ใช้ไป {allLocation - emptyLocation}</div>
  <div>เหลือ {emptyLocation}</div>
</div>
                    </div>
                  </div>
                </div>
                <div className={Styles.ListF}>
                  <div className={Styles.outS}>
                    <div className={Styles.Limts}>
                      <div className="card" style={{ height: "300px" }}>
                      <h3 className="card-title">ยาหมดสต๊อก</h3>
                        <div className="card-body">
                          <Table striped hover className={Styles.OSlist}>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>รหัสยา</th>
                                <th>ชื่อ</th>
                              </tr>
                            </thead>
                            {outOfStock.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.p_id}</td>
                                <td>{item.p_name}</td>
                              </tr>
                            ))}
                          </Table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={Styles.DeadS}>
                    <div className="col-12">
                      <div className="card" style={{ height: "330px" }}>
                        <div className="card-header px-3">
                          <div className="d-inline-flex flex-wrap justify-content-between align-items-center w-100">
                            <div className="col-md-4 col-sm-12">
                              <h3 className="card-title">ยาเหลือน้อย</h3>
                            </div>
                          </div>
                        </div>

                        <div
                          className="card-body"
                          style={{ maxHeight: "330px", overflowY: "auto" }}
                        >
                          <Table striped hover>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>รหัสยา</th>
                                <th>ชื่อ</th>
                                <th>ขั่นต่ำ</th>
                                <th>ในคลัง</th>
                              </tr>
                            </thead>
                            {lowStock.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.p_id}</td>
                                <td>{item.p_name}</td>
                                <td>{item.low_stock}</td>
                                <td>
                                  {item.total_quantity} {item.unit}
                                </td>
                              </tr>
                            ))}
                          </Table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={Styles.DSSA}>
                    <div className="col-12">
                      <div className="card" style={{ height: "330px" }}>
                        <div className="card-header px-3">
                          <div className="d-inline-flex flex-wrap justify-content-between align-items-center w-100">
                            <div className="col-md-6 col-sm-12">
                              <h3 className="card-title col-12">
                                ยาใกล้หมดอายุ
                              </h3>
                            </div>
                          </div>
                        </div>

                        <div
                          className="card-body"
                          style={{ maxHeight: "330px", overflowY: "auto" }}
                        >
                          <Table striped hover>
                            <thead>
                              <tr>
                                <th>ล็อต</th>
                                <th>ตำแหน่งจัดเก็บ</th>
                                <th>รหัสยา</th>
                                <th>ชื่อ</th>
                                <th>วันหมดอายุ</th>
                                <th>เหลืออีก</th>
                              </tr>
                            </thead>
                            {overdue.map((item, index) => (
                              <tr key={index}>
                                <td>{item.lot_id}</td>
                                <td>
                                  {item.warehouse_name} - {item.Location_name}
                                </td>
                                <td>{item.p_id}</td>
                                <td>{item.name}</td>
                                <td>
                                  {new Date(item.exp_date).toLocaleDateString(
                                    "en-GB"
                                  )}
                                </td>
                                <td>{item.days_overdue} วัน</td>
                              </tr>
                            ))}
                          </Table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </section>
        </div>
      </div>
    </div>
  );
}
