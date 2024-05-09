import { Gauge } from 'react-gauge-chart';

const WarehouseGauge = ({ title, total, used }) => {
  const percentUsed = (used / total) * 100;

  return (
    <div className="warehouse-gauge">
      <h3>{title}</h3>
      <Gauge value={percentUsed} />
      <p>Total: {total}</p>
      <p>Used: {used}</p>
    </div>
  );
};

export default WarehouseGauge;