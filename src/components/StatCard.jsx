const StatCard = ({ title, value }) => {
  return (
    <div className="card bg-white shadow-sm rounded p-4 h-100 d-flex align-items-center">
      <div className="card-body">
        <p className="text-muted mb-2">{title}</p>
        <h2 className="card-title fw-bold">{value}</h2>
      </div>
    </div>
  );
};

export default StatCard;
