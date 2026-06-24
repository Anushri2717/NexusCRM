import { useNavigate } from 'react-router-dom';

const PAL = [['#E6F1FB','#185FA5'],['#E1F5EE','#0F6E56'],['#EEEDFE','#3C3489'],['#FAEEDA','#854F0B'],['#FAECE7','#993C1D']];
const fmtV = v => !v ? '—' : v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${v.toLocaleString()}`;

export default function LeadRow({ lead }) {
  const navigate = useNavigate();
  const initials = lead.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const [bg, fg] = PAL[(lead.name.charCodeAt(0) || 0) % PAL.length];
  return (
    <tr style={{ cursor: 'pointer' }} onClick={() => navigate(`/leads/${lead._id}`)}>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="avatar avatar-sm" style={{ background: bg, color: fg }}>{initials}</div>
          <div>
            <div style={{ fontWeight: 500, fontSize: 11.5 }}>{lead.name}</div>
            <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>{lead.email}</div>
          </div>
        </div>
      </td>
      <td>{lead.company}</td>
      <td><span className={`stage-badge ${lead.stage}`}>{lead.stage.replace('-', ' ')}</span></td>
      <td><span className={`tag tag-${lead.temperature}`}>{lead.temperature}</span></td>
      <td style={{ fontWeight: 500 }}>{fmtV(lead.dealValue)}</td>
      <td style={{ color: 'var(--gray-400)' }}>{lead.assignedTo?.name || '—'}</td>
      <td><i className="ti ti-chevron-right" style={{ color: 'var(--gray-300)', fontSize: 13 }} /></td>
    </tr>
  );
}