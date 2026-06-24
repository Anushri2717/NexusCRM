import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import PipelineBar from '../components/PipelineBar';
import ActivityItem from '../components/ActivityItem';
import LeadModal from '../components/LeadModal';

const STAGES = ['prospecting','qualification','proposal','negotiation','closed-won','closed-lost'];
const PAL = [['#E6F1FB','#185FA5'],['#E1F5EE','#0F6E56'],['#EEEDFE','#3C3489'],['#FAEEDA','#854F0B'],['#FAECE7','#993C1D']];

export default function Dashboard() {
  const [pipeline, setPipeline] = useState(null);
  const [activities, setActivities] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get('/pipeline'), api.get('/activities?limit=8'), api.get('/leads?limit=5')])
      .then(([p, a, l]) => { setPipeline(p.data); setActivities(a.data.activities); setRecentLeads(l.data.leads); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  const { totals = {}, stageData = [] } = pipeline || {};
  const stageMap = Object.fromEntries(stageData.map(s => [s._id, s]));
  const maxCount = Math.max(...stageData.map(s => s.count), 1);
  const winRate = totals.totalLeads > 0 ? Math.round((totals.wonDeals / totals.totalLeads) * 100) : 0;

  return (
    <div className="page-enter">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:700, color:'var(--gray-900)' }}>Good morning 👋</h1>
          <p style={{ fontSize:11, color:'var(--gray-400)', marginTop:1 }}>Here's what's happening in your pipeline today.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <i className="ti ti-plus" /> Add Lead
        </button>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Leads"    value={totals.totalLeads || 0}                                   icon="ti-users"          color="blue"   sub="+12% this month"       trend="up" />
        <StatCard label="Pipeline Value" value={`₹${((totals.totalPipeline || 0) / 100000).toFixed(1)}L`} icon="ti-currency-rupee" color="purple" sub="+8.4% vs last month"   trend="up" />
        <StatCard label="Deals Won"      value={totals.wonDeals || 0}                                      icon="ti-trophy"         color="teal"   sub={`${winRate}% win rate`} trend="up" />
        <StatCard label="Won Value"      value={`₹${((totals.wonValue || 0) / 100000).toFixed(1)}L`}      icon="ti-chart-line"     color="coral"  sub="Closed this cycle" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Deal Pipeline</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/pipeline')}>View all <i className="ti ti-arrow-right" style={{ fontSize:10 }} /></button>
          </div>
          <div className="card-body">
            {STAGES.filter(s => s !== 'closed-lost').map(s => (
              <PipelineBar key={s} stage={s} count={stageMap[s]?.count || 0} value={stageMap[s]?.totalValue || 0} max={maxCount} />
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Leads</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/leads')}>View all <i className="ti ti-arrow-right" style={{ fontSize:10 }} /></button>
          </div>
          <div className="card-body" style={{ paddingTop:6 }}>
            {recentLeads.length === 0 && <div className="empty-state"><i className="ti ti-users" /><p>No leads yet</p></div>}
            {recentLeads.map(lead => {
              const initials = lead.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
              const [bg, fg] = PAL[(lead.name.charCodeAt(0) || 0) % PAL.length];
              return (
                <div key={lead._id} onClick={() => navigate(`/leads/${lead._id}`)}
                  style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0', borderBottom:'1px solid var(--gray-100)', cursor:'pointer', transition:'padding-left 0.14s' }}
                  onMouseEnter={e => e.currentTarget.style.paddingLeft = '3px'}
                  onMouseLeave={e => e.currentTarget.style.paddingLeft = '0'}>
                  <div className="avatar avatar-sm" style={{ background:bg, color:fg }}>{initials}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11.5, fontWeight:500 }}>{lead.name}</div>
                    <div style={{ fontSize:10, color:'var(--gray-400)' }}>{lead.company}</div>
                  </div>
                  <span className={`tag tag-${lead.temperature}`}>{lead.temperature}</span>
                  <span className={`stage-badge ${lead.stage}`}>{lead.stage.replace('-', ' ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Activity</span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/email-logs')}>View logs <i className="ti ti-arrow-right" style={{ fontSize:10 }} /></button>
        </div>
        <div className="card-body">
          {activities.length === 0 && <div className="empty-state"><i className="ti ti-activity" /><p>No activity yet</p></div>}
          {activities.map(a => <ActivityItem key={a._id} activity={a} />)}
        </div>
      </div>

      {showAdd && <LeadModal onClose={() => setShowAdd(false)} onSaved={lead => setRecentLeads(p => [lead, ...p].slice(0, 5))} />}
    </div>
  );
}