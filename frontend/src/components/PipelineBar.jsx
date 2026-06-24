const COLORS = {
  prospecting: '#378ADD', qualification: '#7F77DD', proposal: '#BA7517',
  negotiation: '#D85A30', 'closed-won': '#1D9E75', 'closed-lost': '#A32D2D',
};

export default function PipelineBar({ stage, count, value, max }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  const color = COLORS[stage] || '#9EA5B0';
  const label = stage.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
  return (
    <div className="pipeline-bar-row">
      <div className="pipeline-bar-header">
        <span className="pipeline-bar-name">{label}</span>
        <span className="pipeline-bar-meta">{count} · ₹{(value / 100000).toFixed(1)}L</span>
      </div>
      <div className="pipeline-bar-bg">
        <div className="pipeline-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}