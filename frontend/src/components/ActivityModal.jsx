import { useState } from 'react';
import api from '../api/axios';
import { useToast } from './Toast';

export default function ActivityModal({ leadId, onClose, onLogged }) {
  const [form, setForm] = useState({ type:'email', title:'', description:'', emailSubject:'', emailBody:'', duration:'', outcome:'' });
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const r = await api.post('/activities', { ...form, lead: leadId, duration: Number(form.duration) || undefined });
      onLogged(r.data); toast('Activity logged'); onClose();
    } catch (err) { toast(err.response?.data?.message || 'Failed', 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 420 }}>
        <div className="modal-header">
          <span className="modal-title">Log Activity</span>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><i className="ti ti-x" style={{ fontSize: 13 }} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Type</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[{v:'email',icon:'ti-mail',l:'Email'},{v:'call',icon:'ti-phone',l:'Call'},{v:'note',icon:'ti-notes',l:'Note'},{v:'meeting',icon:'ti-calendar',l:'Meeting'}].map(({ v, icon, l }) => (
                  <button key={v} type="button" className="btn btn-ghost btn-sm" onClick={() => set('type', v)}
                    style={form.type === v ? { background:'var(--blue-50)', borderColor:'var(--blue-400)', color:'var(--blue-600)' } : {}}>
                    <i className={`ti ${icon}`} />{l}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" required value={form.title} onChange={e => set('title', e.target.value)} placeholder="Activity summary" />
            </div>
            {form.type === 'email' && <>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input className="form-input" value={form.emailSubject} onChange={e => set('emailSubject', e.target.value)} placeholder="Re: Proposal" />
              </div>
              <div className="form-group">
                <label className="form-label">Body</label>
                <textarea className="form-input" rows={2} value={form.emailBody} onChange={e => set('emailBody', e.target.value)} style={{ resize: 'vertical' }} />
              </div>
            </>}
            {(form.type === 'call' || form.type === 'meeting') &&
              <div className="form-group">
                <label className="form-label">Duration (min)</label>
                <input className="form-input" type="number" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="30" />
              </div>
            }
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea className="form-input" rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Additional context…" style={{ resize: 'vertical' }} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Outcome</label>
              <input className="form-input" value={form.outcome} onChange={e => set('outcome', e.target.value)} placeholder="e.g. Interested, follow-up in 2 weeks" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Logging…' : 'Log Activity'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}