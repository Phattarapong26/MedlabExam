import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";
import { useEffect, useState } from "react";

export default function ProductChart() {
  const [product, setProduct] = useState(0);
  const [outOfStock, setOutOfStock] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [overdue, setOverdue] = useState(0);

  const fetchDate = async () => {
    try {
      const response = await fetch("http://localhost:3000/inventorySummary");
      const data = await response.json();
      if (data.status === "success") {
        setProduct(data.total_product_count);
        setLowStock(data.low_stock_products.length);
        setOverdue(data.overdue_lots.length);
        setOutOfStock(data.out_of_stock_products.length);
      }
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    }
  };
  const [allLocation, setAllLocation] = useState(0);
  const [emptyLocation, setEmptyLocation] = useState(0);
  const LocationUse = allLocation - emptyLocation;

  const getLocationDetail = async () => {
    try {
      const response = await fetch("http://localhost:3000/getAllLocation");
      const data = await response.json();
      if (data.status === "success") {
        setAllLocation(data.all_locations.length);
        setEmptyLocation(data.empty_locations.length);
      }
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    }
  };

  useEffect(() => {
    fetchDate();
    getLocationDetail();
  }, []);
  const chartSetting = {
    width: 700,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-20px, 0)",
      },
    },
  };
  const dataset = [
    {
      product: product,
      low: lowStock,
      out: outOfStock,
      lot: LocationUse,
      overdue: overdue,
      type: "warehouse status",
    },
   
  ];

    const valueFormatter = (value) => `${value} ล็อต`;

  return (
    <div className="d-flex justify-content-center align-items-center">
      <BarChart
        dataset={dataset}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "type",
            categoryGapRatio: 0.2,
            barGapRatio: 0,
          },
        ]}
        series={[
          { dataKey: "product", label: "All Product" },
          { dataKey: "out", label: "Stock Out" },
          { dataKey: "low", label: "Stock Low" },
          { dataKey: "overdue", label: "Lot Dead",valueFormatter },
          { dataKey: "lot", label: "Export",valueFormatter },
        ]}
        {...chartSetting}
      />
    </div>
  );
}
