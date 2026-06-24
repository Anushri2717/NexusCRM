export default function StatCard({ label, value, sub, trend, icon, color = 'blue' }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className={`stat-icon ${color}`}><i className={`ti ${icon}`} /></div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && (
        <div className={`stat-sub ${trend === 'up' ? 'stat-up' : trend === 'down' ? 'stat-down' : 'text-muted'}`}>
          {trend === 'up' && <i className="ti ti-trending-up" style={{ fontSize: 9, marginRight: 2 }} />}
          {trend === 'down' && <i className="ti ti-trending-down" style={{ fontSize: 9, marginRight: 2 }} />}
          {sub}
        </div>
      )}
    </div>
  );
}