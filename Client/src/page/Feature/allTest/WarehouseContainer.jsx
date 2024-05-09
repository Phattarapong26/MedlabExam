import { useState, useEffect } from 'react';
import axios from 'axios';
import WarehouseGauge from './WarehouseGauge';
import { Gauge } from 'react-gauge-chart';

const WarehouseContainer = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const warehousesPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getWarehouse');
        setWarehouses(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const indexOfLastWarehouse = currentPage * warehousesPerPage;
  const indexOfFirstWarehouse = indexOfLastWarehouse - warehousesPerPage;
  const currentWarehouses = warehouses.slice(indexOfFirstWarehouse, indexOfLastWarehouse);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderWarehouses = () => {
    return currentWarehouses.map((warehouse) => (
      <WarehouseGauge
        key={warehouse.warehouse_id}
        title={warehouse.warehouse_name}
        total={warehouse.total_locations}
        used={warehouse.total_lots - warehouse.total_lots_before_date}
      />
    ));
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(warehouses.length / warehousesPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <nav>
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <a onClick={() => paginate(number)} className="page-link">
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  return (
    <div className="warehouse-container">
      <div className="warehouse-gauges">{renderWarehouses()}</div>
      <div className="pagination-container">{renderPagination()}</div>
    </div>
  );
};

export default WarehouseContainer;