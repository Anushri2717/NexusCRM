import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'sales_rep' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate('/dashboard', { replace: true }); }, [user]);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (tab === 'login') {
        const res = await login(form.email, form.password);
        if (!res.ok) { setError(res.message); setLoading(false); return; }
        navigate('/dashboard');
      } else {
        await api.post('/auth/register', form);
        const res = await login(form.email, form.password);
        if (!res.ok) { setError(res.message); setLoading(false); return; }
        navigate('/dashboard');
      }
    } catch (err) { setError(err.response?.data?.message || 'Something went wrong'); setLoading(false); }
  };

  const inputStyle = { background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.10)', color:'#fff' };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#0C1827 0%,#12243A 50%,#0C1827 100%)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'10%', left:'15%', width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(24,95,165,0.14) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'15%', right:'10%', width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle,rgba(29,158,117,0.09) 0%,transparent 70%)', pointerEvents:'none' }} />

      <div style={{ width:340, position:'relative', zIndex:1, animation:'slideUp 0.32s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ textAlign:'center', marginBottom:20 }}>
          <div style={{ width:36, height:36, background:'var(--blue-600)', borderRadius:9, display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:9, boxShadow:'0 5px 16px rgba(24,95,165,0.32)' }}>
            <i className="ti ti-topology-star-3" style={{ fontSize:18, color:'#fff' }} />
          </div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700, color:'#fff', letterSpacing:-0.3 }}>NexusCRM</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:2 }}>Enterprise Sales Intelligence</div>
        </div>

        <div style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:12, padding:'18px 20px', boxShadow:'0 16px 40px rgba(0,0,0,0.32)' }}>
          <div style={{ display:'flex', background:'rgba(255,255,255,0.06)', borderRadius:6, padding:3, marginBottom:16 }}>
            {['login','register'].map(t => (
              <button key={t} type="button" onClick={() => { setTab(t); setError(''); }}
                style={{ flex:1, padding:'5px 0', border:'none', cursor:'pointer', borderRadius:4, fontFamily:'var(--font-body)', fontSize:11, fontWeight:500, transition:'all 0.15s', background:tab===t?'#fff':'transparent', color:tab===t?'var(--gray-900)':'rgba(255,255,255,0.38)', boxShadow:tab===t?'0 1px 4px rgba(0,0,0,0.12)':'none' }}>
                {t === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {tab === 'register' && (
              <div className="form-group">
                <label className="form-label" style={{ color:'rgba(255,255,255,0.52)' }}>Full Name</label>
                <input className="form-input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Anushri A." style={inputStyle} />
              </div>
            )}
            <div className="form-group">
              <label className="form-label" style={{ color:'rgba(255,255,255,0.52)' }}>Email</label>
              <input className="form-input" type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@company.com" style={inputStyle} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ color:'rgba(255,255,255,0.52)' }}>Password</label>
              <input className="form-input" type="password" required value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" style={inputStyle} />
            </div>
            {tab === 'register' && (
              <div className="form-group">
                <label className="form-label" style={{ color:'rgba(255,255,255,0.52)' }}>Role</label>
                <select className="form-input form-select" value={form.role} onChange={e => set('role', e.target.value)} style={inputStyle}>
                  <option value="admin">Admin</option>
                  <option value="sales_rep">Sales Rep</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            )}
            {error && (
              <div style={{ background:'#FCEBEB', border:'1px solid #F7C1C1', color:'#A32D2D', borderRadius:5, padding:'7px 10px', fontSize:11, marginBottom:11, display:'flex', alignItems:'center', gap:6 }}>
                <i className="ti ti-alert-circle" /> {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              style={{ width:'100%', padding:'8px', background:'var(--blue-600)', color:'#fff', border:'none', borderRadius:6, fontFamily:'var(--font-body)', fontSize:12, fontWeight:600, cursor:loading?'not-allowed':'pointer', opacity:loading?0.75:1, transition:'all 0.14s', boxShadow:'0 3px 10px rgba(24,95,165,0.28)', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              {loading
                ? <><i className="ti ti-loader-2" style={{ animation:'spin 0.7s linear infinite', display:'inline-block' }} /> Signing in…</>
                : <>{tab === 'login' ? 'Sign in to NexusCRM' : 'Create account'} <i className="ti ti-arrow-right" /></>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}