const TYPE_META = {
  email:          { icon: 'ti-mail',           bg: '#E6F1FB', color: '#185FA5' },
  call:           { icon: 'ti-phone',          bg: '#E1F5EE', color: '#0F6E56' },
  note:           { icon: 'ti-notes',          bg: '#F1EFE8', color: '#5F5E5A' },
  meeting:        { icon: 'ti-calendar',       bg: '#EEEDFE', color: '#534AB7' },
  'stage-change': { icon: 'ti-arrows-exchange',bg: '#FAEEDA', color: '#854F0B' },
  'deal-won':     { icon: 'ti-trophy',         bg: '#E1F5EE', color: '#0F6E56' },
  'deal-lost':    { icon: 'ti-x',              bg: '#FCEBEB', color: '#A32D2D' },
};

function timeAgo(d) {
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function ActivityItem({ activity }) {
  const { icon, bg, color } = TYPE_META[activity.type] || TYPE_META.note;
  return (
    <div className="activity-item">
      <div className="activity-icon-wrap" style={{ background: bg, color }}>
        <i className={`ti ${icon}`} />
      </div>
      <div className="activity-body">
        <div className="activity-title">
          <strong>{activity.title}</strong>
          {activity.lead?.name && <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}> · {activity.lead.name}</span>}
        </div>
        {activity.description && <div style={{ fontSize: 10, color: 'var(--gray-400)', marginTop: 1 }}>{activity.description}</div>}
        <div className="activity-time">
          {activity.performedBy?.name && `${activity.performedBy.name} · `}{timeAgo(activity.createdAt)}
        </div>
      </div>
    </div>
  );
}