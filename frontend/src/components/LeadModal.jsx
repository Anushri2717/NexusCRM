import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useToast } from './Toast';

const BLANK = { name:'', email:'', phone:'', company:'', position:'', stage:'prospecting', temperature:'warm', dealValue:'', source:'other', notes:'', expectedClose:'', assignedTo:'' };

export default function LeadModal({ lead, onClose, onSaved }) {
  const [form, setForm] = useState(lead ? { ...lead, assignedTo: lead.assignedTo?._id || '' } : { ...BLANK });
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => { api.get('/users').then(r => setUsers(r.data)).catch(() => {}); }, []);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, dealValue: Number(form.dealValue) || 0 };
      if (lead) { const r = await api.put(`/leads/${lead._id}`, payload); onSaved(r.data); toast('Lead updated'); }
      else { const r = await api.post('/leads', payload); onSaved(r.data); toast('Lead created'); }
      onClose();
    } catch (err) { toast(err.response?.data?.message || 'Save failed', 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{lead ? 'Edit Lead' : 'Add New Lead'}</span>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><i className="ti ti-x" style={{ fontSize: 13 }} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              {[
                { k:'name',      l:'Full Name *', ph:'Rajesh Kumar',     req:true },
                { k:'email',     l:'Email *',     ph:'raj@co.com',       req:true, type:'email' },
                { k:'phone',     l:'Phone',       ph:'+91 98765 43210' },
                { k:'company',   l:'Company *',   ph:'Infosys Ltd',      req:true },
                { k:'position',  l:'Position',    ph:'CTO' },
                { k:'dealValue', l:'Deal Value (₹)', ph:'500000',        type:'number' },
              ].map(({ k, l, ph, type='text', req }) => (
                <div className="form-group" key={k}>
                  <label className="form-label">{l}</label>
                  <input className="form-input" type={type} required={!!req} value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Stage</label>
                <select className="form-input form-select" value={form.stage} onChange={e => set('stage', e.target.value)}>
                  {['prospecting','qualification','proposal','negotiation','closed-won','closed-lost'].map(s => (
                    <option key={s} value={s}>{s.replace('-',' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Temperature</label>
                <select className="form-input form-select" value={form.temperature} onChange={e => set('temperature', e.target.value)}>
                  <option value="hot">Hot</option><option value="warm">Warm</option><option value="cold">Cold</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Source</label>
                <select className="form-input form-select" value={form.source} onChange={e => set('source', e.target.value)}>
                  {['website','referral','cold-call','linkedin','email','other'].map(s => (
                    <option key={s} value={s}>{s.replace('-',' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Expected Close</label>
                <input className="form-input" type="date" value={form.expectedClose ? form.expectedClose.slice(0,10) : ''} onChange={e => set('expectedClose', e.target.value)} />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Assign To</label>
                <select className="form-input form-select" value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
                  <option value="">— unassigned —</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea className="form-input" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any relevant context…" style={{ resize: 'vertical' }} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><i className="ti ti-loader-2" style={{ animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Saving…</> : (lead ? 'Update Lead' : 'Create Lead')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}