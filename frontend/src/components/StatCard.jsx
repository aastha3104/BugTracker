function StatCard({ title, value, icon, type }) {
  return (
    <div className={`stat-card stat-${type}`}>

      <div className="stat-top">

        <span className="stat-title">
          {title}
        </span>

        <span className="stat-icon">{icon}</span>

      </div>

      <h2>{value}</h2>

      <div className="stat-line">
        <span></span>
      </div>

      <small>
        {title === "Total Bugs"
          ? "All reported issues"
          : title === "Open"
          ? "Needs attention"
          : title === "In Progress"
          ? "Currently being fixed"
          : "Successfully closed"}
      </small>

    </div>
  );
}

export default StatCard;