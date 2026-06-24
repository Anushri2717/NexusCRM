import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import PipelineBar from '../components/PipelineBar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const STAGES = ['prospecting','qualification','proposal','negotiation','closed-won','closed-lost'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS = ['#378ADD','#7F77DD','#BA7517','#D85A30','#1D9E75','#A32D2D'];

export default function Pipeline() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/pipeline').then(r => setData(r.data)).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  const { totals = {}, stageData = [], monthlyWon = [] } = data || {};
  const stageMap = Object.fromEntries(stageData.map(s => [s._id, s]));
  const maxCount = Math.max(...stageData.map(s => s.count), 1);
  const winRate = totals.totalLeads > 0 ? Math.round((totals.wonDeals / totals.totalLeads) * 100) : 0;

  const chartData = {
    labels: monthlyWon.length ? monthlyWon.map(m => MONTHS[m._id.month - 1]) : MONTHS.slice(0, 6),
    datasets: [{
      label: 'Won (₹L)',
      data: monthlyWon.length ? monthlyWon.map(m => m.value / 100000) : [0,0,0,0,0,0],
      backgroundColor: 'rgba(24,95,165,0.12)', borderColor: '#185FA5',
      borderWidth: 1.5, borderRadius: 3, borderSkipped: false,
    }]
  };
  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `₹${ctx.parsed.y.toFixed(2)}L` } } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10, family: 'Inter' }, color: '#9EA5B0' } },
      y: { grid: { color: '#F0F2F5' }, ticks: { font: { size: 10, family: 'Inter' }, color: '#9EA5B0', callback: v => `₹${v}L` } },
    }
  };

  return (
    <div className="page-enter">
      <div style={{ marginBottom:14 }}>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:700 }}>Sales Pipeline</h2>
        <p style={{ fontSize:10, color:'var(--gray-400)', marginTop:1 }}>Track deal progression and revenue across all stages</p>
      </div>
      <div className="stats-grid" style={{ marginBottom:14 }}>
        <StatCard label="Total Leads"    value={totals.totalLeads || 0}                                   icon="ti-users"          color="blue" />
        <StatCard label="Pipeline Value" value={`₹${((totals.totalPipeline || 0) / 100000).toFixed(1)}L`} icon="ti-currency-rupee" color="purple" />
        <StatCard label="Deals Won"      value={totals.wonDeals || 0}                                      icon="ti-trophy"         color="teal"  sub={`${winRate}% win rate`} trend="up" />
        <StatCard label="Won Revenue"    value={`₹${((totals.wonValue || 0) / 100000).toFixed(1)}L`}      icon="ti-cash"           color="coral" />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Stages Breakdown</span></div>
          <div className="card-body">
            {STAGES.map(s => <PipelineBar key={s} stage={s} count={stageMap[s]?.count || 0} value={stageMap[s]?.totalValue || 0} max={maxCount} />)}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Monthly Won Revenue</span></div>
          <div className="card-body" style={{ height:210 }}><Bar data={chartData} options={chartOpts} /></div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginTop:12 }}>
        {STAGES.map((s, i) => {
          const d = stageMap[s] || { count:0, totalValue:0 };
          return (
            <div key={s} className="card" style={{ borderTop:`2px solid ${COLORS[i]}` }}>
              <div className="card-body">
                <div style={{ fontSize:9, color:'var(--gray-400)', fontWeight:600, textTransform:'uppercase', letterSpacing:0.4 }}>{s.replace('-', ' ')}</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, marginTop:5 }}>{d.count}</div>
                <div style={{ fontSize:10, color:'var(--gray-400)', marginTop:1 }}>{d.count === 1 ? 'lead' : 'leads'} · ₹{(d.totalValue / 100000).toFixed(1)}L</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}