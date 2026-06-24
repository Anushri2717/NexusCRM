import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const titles = {
  '/dashboard': 'Dashboard', '/leads': 'Leads', '/pipeline': 'Pipeline',
  '/email-logs': 'Email Logs', '/access': 'Access Control',
};

export default function Topbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const title = titles[pathname] || (pathname.startsWith('/leads/') ? 'Lead Detail' : 'NexusCRM');

  const handleSearch = e => {
    e.preventDefault();
    if (search.trim()) navigate(`/leads?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="topbar">
      <span className="topbar-title">{title}</span>
      <form onSubmit={handleSearch} className="topbar-search">
        <i className="ti ti-search" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads, companies…" />
      </form>
      <button className="btn btn-ghost btn-sm btn-icon" title="Notifications">
        <i className="ti ti-bell" style={{ fontSize: 14 }} />
      </button>
    </header>
  );
}