import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import LeadRow from '../components/LeadRow';
import LeadModal from '../components/LeadModal';

const STAGES = ['prospecting','qualification','proposal','negotiation','closed-won','closed-lost'];
const TEMPS  = ['hot','warm','cold'];

export default function Leads() {
  const [searchParams] = useSearchParams();
  const [leads, setLeads] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState({ stage:'', temperature:'', search: searchParams.get('search') || '' });
  const [showAdd, setShowAdd] = useState(false);

  const fetchLeads = useCallback(async (reset = true) => {
    if (reset) { setLoading(true); setCursor(null); } else setLoadingMore(true);
    try {
      const params = { limit: 20 };
      if (filters.stage) params.stage = filters.stage;
      if (filters.temperature) params.temperature = filters.temperature;
      if (filters.search) params.search = filters.search;
      if (!reset && cursor) params.cursor = cursor;
      const { data } = await api.get('/leads', { params });
      setLeads(reset ? data.leads : p => [...p, ...data.leads]);
      setCursor(data.nextCursor); setHasMore(data.hasMore);
    } finally { setLoading(false); setLoadingMore(false); }
  }, [filters]);

  useEffect(() => { fetchLeads(true); }, [filters]);
  const setFilter = (k, v) => setFilters(p => ({ ...p, [k]: v }));

  return (
    <div className="page-enter">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:13 }}>
        <div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:700 }}>All Leads</h2>
          <p style={{ fontSize:10, color:'var(--gray-400)', marginTop:1 }}>{leads.length} results</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><i className="ti ti-plus" /> New Lead</button>
      </div>

      <div style={{ display:'flex', gap:7, marginBottom:11, flexWrap:'wrap' }}>
        <div className="topbar-search" style={{ width:200 }}>
          <i className="ti ti-search" />
          <input value={filters.search} placeholder="Search name, company…" onChange={e => setFilter('search', e.target.value)} />
          {filters.search && <button style={{ background:'none', border:'none', color:'var(--gray-400)', cursor:'pointer', fontSize:12 }} onClick={() => setFilter('search', '')}><i className="ti ti-x" /></button>}
        </div>
        <select className="form-input form-select" style={{ width:138, padding:'4px 9px' }} value={filters.stage} onChange={e => setFilter('stage', e.target.value)}>
          <option value="">All stages</option>
          {STAGES.map(s => <option key={s} value={s}>{s.replace('-',' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>)}
        </select>
        <select className="form-input form-select" style={{ width:115, padding:'4px 9px' }} value={filters.temperature} onChange={e => setFilter('temperature', e.target.value)}>
          <option value="">All temps</option>
          {TEMPS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
        </select>
        {(filters.stage || filters.temperature || filters.search) && (
          <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ stage:'', temperature:'', search:'' })}><i className="ti ti-x" /> Clear</button>
        )}
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : leads.length === 0 ? (
        <div className="card"><div className="empty-state"><i className="ti ti-users" /><p>No leads found.</p></div></div>
      ) : (
        <>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Lead</th><th>Company</th><th>Stage</th><th>Temp</th><th>Value</th><th>Assigned</th><th></th></tr></thead>
              <tbody>{leads.map(l => <LeadRow key={l._id} lead={l} />)}</tbody>
            </table>
          </div>
          {hasMore && (
            <div style={{ textAlign:'center', marginTop:11 }}>
              <button className="btn btn-ghost" onClick={() => fetchLeads(false)} disabled={loadingMore}>{loadingMore ? 'Loading…' : 'Load more'}</button>
            </div>
          )}
        </>
      )}
      {showAdd && <LeadModal onClose={() => setShowAdd(false)} onSaved={lead => setLeads(p => [lead, ...p])} />}
    </div>
  );
}