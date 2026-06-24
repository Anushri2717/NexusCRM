import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard' },
  { to: '/leads',     icon: 'ti-users',            label: 'Leads'     },
  { to: '/pipeline',  icon: 'ti-chart-bar',         label: 'Pipeline'  },
  { to: '/email-logs',icon: 'ti-mail',              label: 'Email Logs'},
];
const adminItems = [
  { to: '/access', icon: 'ti-shield-lock', label: 'Access Control' },
];
const PAL = [['#E6F1FB','#185FA5'],['#E1F5EE','#0F6E56'],['#EEEDFE','#3C3489'],['#FAEEDA','#854F0B'],['#FAECE7','#993C1D']];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || 'U';
  const [bg, fg] = PAL[(user?.name?.charCodeAt(0) || 0) % PAL.length];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon"><i className="ti ti-topology-star-3" /></div>
        <span className="sidebar-logo-text">NexusCRM</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main</div>
        {navItems.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <i className={`ti ${icon}`} />{label}
          </NavLink>
        ))}
        {user?.role === 'admin' && <>
          <div className="sidebar-section-label">Admin</div>
          {adminItems.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <i className={`ti ${icon}`} />{label}
            </NavLink>
          ))}
        </>}
      </nav>

      <div className="sidebar-footer">
        <div className="avatar avatar-sm" style={{ background: bg, color: fg }}>{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="sidebar-footer-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
          <div className="sidebar-footer-role">{user?.role?.replace('_', ' ')}</div>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.28)', fontSize: 14, cursor: 'pointer', padding: 2 }}
          title="Sign out">
          <i className="ti ti-logout" />
        </button>
      </div>
    </aside>
  );
}