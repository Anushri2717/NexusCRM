import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ActivityItem from '../components/ActivityItem';
import ActivityModal from '../components/ActivityModal';
import LeadModal from '../components/LeadModal';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const fmtV = v => !v ? '—' : v >= 100000 ? `₹${(v/100000).toFixed(2)}L` : `₹${v.toLocaleString()}`;
const PAL = [['#E6F1FB','#185FA5'],['#E1F5EE','#0F6E56'],['#EEEDFE','#3C3489'],['#FAEEDA','#854F0B'],['#FAECE7','#993C1D']];

function Detail({ label, value }) {
  return (
    <div style={{ marginBottom:9 }}>
      <div style={{ fontSize:9, color:'var(--gray-400)', fontWeight:600, textTransform:'uppercase', letterSpacing:0.4, marginBottom:2 }}>{label}</div>
      <div style={{ fontSize:11.5, color:'var(--gray-800)', fontWeight:500 }}>{value || '—'}</div>
    </div>
  );
}

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

  useEffect(() => {
    api.get(`/leads/${id}`).then(r => setData(r.data)).catch(() => navigate('/leads')).finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this lead and all activities?')) return;
    try { await api.delete(`/leads/${id}`); toast('Lead deleted'); navigate('/leads'); }
    catch (err) { toast(err.response?.data?.message || 'Delete failed', 'error'); }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!data) return null;

  const { lead, activities } = data;
  const initials = lead.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const [bg, fg] = PAL[(lead.name.charCodeAt(0) || 0) % PAL.length];

  return (
    <div className="page-enter">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom:13 }} onClick={() => navigate('/leads')}>
        <i className="ti ti-arrow-left" /> Back to Leads
      </button>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:12 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div className="card">
            <div className="card-body" style={{ padding:14 }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:11 }}>
                <div className="avatar avatar-lg" style={{ background:bg, color:fg }}>{initials}</div>
                <div style={{ flex:1 }}>
                  <h2 style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:700 }}>{lead.name}</h2>
                  <div style={{ fontSize:10, color:'var(--gray-400)', marginTop:1 }}>
                    {lead.position}{lead.position && lead.company ? ' · ' : ''}{lead.company}
                  </div>
                  <div style={{ display:'flex', gap:5, marginTop:7, flexWrap:'wrap' }}>
                    <span className={`stage-badge ${lead.stage}`}>{lead.stage.replace('-', ' ')}</span>
                    <span className={`tag tag-${lead.temperature}`}>{lead.temperature}</span>
                    {lead.source && <span className="tag" style={{ background:'var(--gray-100)', color:'var(--gray-600)' }}>{lead.source}</span>}
                  </div>
                </div>
                <div style={{ display:'flex', gap:5 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowEdit(true)}><i className="ti ti-edit" /> Edit</button>
                  {user?.role === 'admin' && <button className="btn btn-danger btn-sm" onClick={handleDelete}><i className="ti ti-trash" /></button>}
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:7, marginTop:14, paddingTop:12, borderTop:'1px solid var(--gray-100)' }}>
                {[
                  { icon:'ti-currency-rupee', label:'Deal Value',     val:fmtV(lead.dealValue),                                                            color:'#185FA5' },
                  { icon:'ti-calendar-due',   label:'Expected Close', val:lead.expectedClose ? new Date(lead.expectedClose).toLocaleDateString('en-IN'):'—', color:'#854F0B' },
                  { icon:'ti-user',           label:'Assigned To',    val:lead.assignedTo?.name || 'Unassigned',                                            color:'#0F6E56' },
                ].map(({ icon, label, val, color }) => (
                  <div key={label} style={{ textAlign:'center', padding:'9px 7px', background:'var(--gray-50)', borderRadius:'var(--radius-md)' }}>
                    <i className={`ti ${icon}`} style={{ fontSize:15, color }} />
                    <div style={{ fontSize:9, color:'var(--gray-400)', marginTop:3, fontWeight:600, textTransform:'uppercase', letterSpacing:0.3 }}>{label}</div>
                    <div style={{ fontSize:11.5, fontWeight:600, marginTop:1 }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Activity Timeline</span>
              <button className="btn btn-primary btn-sm" onClick={() => setShowActivity(true)}><i className="ti ti-plus" /> Log Activity</button>
            </div>
            <div className="card-body">
              {activities.length === 0
                ? <div className="empty-state"><i className="ti ti-activity" /><p>No activities logged yet.</p></div>
                : activities.map(a => <ActivityItem key={a._id} activity={a} />)}
            </div>
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div className="card">
            <div className="card-header"><span className="card-title">Contact Info</span></div>
            <div className="card-body">
              <Detail label="Email" value={<a href={`mailto:${lead.email}`} style={{ color:'var(--blue-600)' }}>{lead.email}</a>} />
              <Detail label="Phone" value={lead.phone} />
              <Detail label="Company" value={lead.company} />
              <Detail label="Position" value={lead.position} />
            </div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Deal Info</span></div>
            <div className="card-body">
              <Detail label="Stage" value={<span className={`stage-badge ${lead.stage}`}>{lead.stage.replace('-',' ')}</span>} />
              <Detail label="Temperature" value={<span className={`tag tag-${lead.temperature}`}>{lead.temperature}</span>} />
              <Detail label="Deal Value" value={fmtV(lead.dealValue)} />
              <Detail label="Source" value={lead.source?.replace('-',' ')} />
              <Detail label="Expected Close" value={lead.expectedClose ? new Date(lead.expectedClose).toLocaleDateString('en-IN') : null} />
            </div>
          </div>
          {lead.notes && (
            <div className="card">
              <div className="card-header"><span className="card-title">Notes</span></div>
              <div className="card-body"><p style={{ fontSize:11.5, color:'var(--gray-600)', lineHeight:1.6, whiteSpace:'pre-wrap' }}>{lead.notes}</p></div>
            </div>
          )}
          <div className="card">
            <div className="card-header"><span className="card-title">Timeline</span></div>
            <div className="card-body">
              <Detail label="Created" value={new Date(lead.createdAt).toLocaleDateString('en-IN', { dateStyle:'medium' })} />
              <Detail label="Last Updated" value={new Date(lead.updatedAt).toLocaleDateString('en-IN', { dateStyle:'medium' })} />
            </div>
          </div>
        </div>
      </div>

      {showEdit && <LeadModal lead={lead} onClose={() => setShowEdit(false)} onSaved={updated => setData(p => ({ ...p, lead:updated }))} />}
      {showActivity && <ActivityModal leadId={id} onClose={() => setShowActivity(false)} onLogged={a => setData(p => ({ ...p, activities:[a, ...p.activities] }))} />}
    </div>
  );
}