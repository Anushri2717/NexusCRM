import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import ActivityItem from '../components/ActivityItem';

const FILTERS = [
  { v:'',             label:'All types',    icon:'ti-list'            },
  { v:'email',        label:'Emails',       icon:'ti-mail'            },
  { v:'call',         label:'Calls',        icon:'ti-phone'           },
  { v:'note',         label:'Notes',        icon:'ti-notes'           },
  { v:'meeting',      label:'Meetings',     icon:'ti-calendar'        },
  { v:'stage-change', label:'Stage Changes',icon:'ti-arrows-exchange' },
];

export default function EmailLogs() {
  const [activities, setActivities] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchActivities = useCallback(async (reset = true) => {
    if (reset) setLoading(true); else setLoadingMore(true);
    try {
      const params = { limit: 25 };
      if (typeFilter) params.type = typeFilter;
      if (!reset && cursor) params.cursor = cursor;
      const { data } = await api.get('/activities', { params });
      setActivities(reset ? data.activities : p => [...p, ...data.activities]);
      setCursor(data.nextCursor); setHasMore(data.hasMore);
    } finally { setLoading(false); setLoadingMore(false); }
  }, [typeFilter]);

  useEffect(() => { fetchActivities(true); }, [typeFilter]);

  return (
    <div className="page-enter">
      <div style={{ marginBottom:13 }}>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:700 }}>Activity & Email Logs</h2>
        <p style={{ fontSize:10, color:'var(--gray-400)', marginTop:1 }}>Complete history of all sales activities</p>
      </div>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
        {FILTERS.map(({ v, label, icon }) => (
          <button key={v} className="btn btn-ghost btn-sm" onClick={() => setTypeFilter(v)}
            style={typeFilter === v ? { background:'var(--blue-50)', borderColor:'var(--blue-400)', color:'var(--blue-600)' } : {}}>
            <i className={`ti ${icon}`} />{label}
          </button>
        ))}
      </div>
      <div className="card">
        <div className="card-header">
          <span className="card-title">{FILTERS.find(f => f.v === typeFilter)?.label || 'All Activities'}</span>
          <span className="text-muted">{activities.length} entries</span>
        </div>
        <div className="card-body">
          {loading ? <div className="loading-center"><div className="spinner" /></div>
          : activities.length === 0 ? <div className="empty-state"><i className="ti ti-inbox" /><p>No activities found.</p></div>
          : <>
            {activities.map(a => <ActivityItem key={a._id} activity={a} />)}
            {hasMore && (
              <div style={{ textAlign:'center', paddingTop:11 }}>
                <button className="btn btn-ghost" onClick={() => fetchActivities(false)} disabled={loadingMore}>{loadingMore ? 'Loading…' : 'Load more'}</button>
              </div>
            )}
          </>}
        </div>
      </div>
    </div>
  );
}