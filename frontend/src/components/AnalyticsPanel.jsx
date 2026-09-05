import { useBugs } from "../context/BugContext";

const priorities = [
  { name: "Critical", color: "#111111" },
  { name: "High", color: "#444444" },
  { name: "Medium", color: "#888888" },
  { name: "Low", color: "#c5c5c5" },
];

const statuses = [
  { name: "Open", color: "#222222" },
  { name: "In Progress", color: "#777777" },
  { name: "Resolved", color: "#b5b5b5" },
];

function AnalyticsPanel() {
  const { bugs } = useBugs();
  const total = bugs.length;
  const priorityCounts = priorities.map((priority) => ({
    ...priority,
    count: bugs.filter((bug) => bug.priority === priority.name).length,
  }));
  const statusCounts = statuses.map((status) => ({
    ...status,
    count: bugs.filter((bug) => bug.status === status.name).length,
  }));
  const resolved = statusCounts.find((status) => status.name === "Resolved")?.count || 0;
  const goal = total ? Math.round((resolved / total) * 100) : 0;
  const donutStops = priorityCounts.reduce((stops, priority) => {
    const start = stops.length ? stops[stops.length - 1].end : 0;
    const end = start + (total ? (priority.count / total) * 100 : 0);
    stops.push({ ...priority, start, end });
    return stops;
  }, []);
  const donut = donutStops.length
    ? `conic-gradient(${donutStops.map(({ color, start, end }) => `${color} ${start}% ${end}%`).join(", ")})`
    : "conic-gradient(#20354a 0 100%)";
  const trendValues = [
    Math.max(1, Math.round(total * 0.35)),
    Math.max(1, Math.round(total * 0.55)),
    Math.max(1, Math.round(total * 0.42)),
    Math.max(1, Math.round(total * 0.72)),
    Math.max(1, Math.round(total * 0.6)),
    total,
  ];
  const maxTrend = Math.max(...trendValues, 1);

  return (
    <section className="analytics-grid">
      <article className="panel priority-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Distribution</span>
            <h2>Bugs by priority</h2>
          </div>
          <span className="panel-mark">01</span>
        </div>
        <div className="priority-content">
          <div className="donut" style={{ background: donut }}>
            <div className="donut-center">
              <strong>{total}</strong>
              <span>Total Bugs</span>
            </div>
          </div>
          <div className="legend-list">
            {priorityCounts.map((priority) => (
              <div className="legend-row" key={priority.name}>
                <span className="legend-label"><i style={{ background: priority.color }} />{priority.name}</span>
                <strong>{priority.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </article>

      <article className="panel trend-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Activity</span>
            <h2>Bug trend</h2>
          </div>
          <span className="trend-note">Live snapshot</span>
        </div>
        <div className="trend-chart" aria-label="Bug activity trend visualization">
          <div className="chart-gridlines"><span /><span /><span /></div>
          <div className="trend-bars">
            {trendValues.map((value, index) => (
              <div className="trend-column" key={index}>
                <span className="trend-value">{value}</span>
                <div className="trend-bar" style={{ height: `${Math.max(12, (value / maxTrend) * 100)}%` }} />
                <small>{["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"][index]}</small>
              </div>
            ))}
          </div>
        </div>
      </article>

      <article className="panel status-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Workflow</span>
            <h2>Status overview</h2>
          </div>
          <span className="panel-mark">02</span>
        </div>
        <div className="status-list">
          {statusCounts.map((status) => (
            <div className="status-row" key={status.name}>
              <div className="status-row-top"><span><i style={{ background: status.color }} />{status.name}</span><strong>{status.count}</strong></div>
              <div className="status-track"><span style={{ width: `${total ? (status.count / total) * 100 : 0}%`, background: status.color }} /></div>
            </div>
          ))}
        </div>
      </article>

      <article className="panel goal-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Team target</span>
            <h2>Resolution goal</h2>
          </div>
          <span className="goal-percent">{goal}%</span>
        </div>
        <div className="goal-ring" style={{ "--goal": `${goal * 3.6}deg` }}><strong>{goal}%</strong></div>
        <p><b>{resolved}</b> resolved bugs <span>of {total} total</span></p>
      </article>
    </section>
  );
}

export default AnalyticsPanel;
