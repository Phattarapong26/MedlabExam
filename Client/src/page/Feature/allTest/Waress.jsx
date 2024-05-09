import { useState, useEffect } from "react";
import { Container, Grid, Card, CardContent, Typography } from "@mui/material";


const GaugeS = () => {
  const [warehouseData, setWarehouseData] = useState(null);

  useEffect(() => {
    fetchWarehouseData();
  }, []);

  const fetchWarehouseData = () => {
    fetch("/getWarehouse")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setWarehouseData(data);
        } else {
          console.error("Error fetching warehouse data:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching warehouse data:", error);
      });
  };

  return (
    <Container>
      <Grid container spacing={3}>
        {/* Container แรก */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                Total Storage
              </Typography>
              {warehouseData && (
                <Typography variant="body1">
                  Total Locations: {warehouseData.total_locations}
                </Typography>
              )}
              {/* เพิ่ม Gauge ที่แสดงข้อมูลที่จัดเก็บเท่าไหร่ของที่จัดเก็บทั้งหมด */}
            </CardContent>
          </Card>
        </Grid>
        {/* Container ที่สอง */}
        <Grid item xs={12}>
          {/* ทำการแสดง Card และ Gauge โดยใช้ข้อมูลจาก API */}
          {/* ตำแหน่งแสดงความคิดเห็น */}
        </Grid>
        
      </Grid>
    </Container>
  );
};

export default GaugeS;
