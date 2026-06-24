import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';

const ROLES={
  admin:    {label:'Admin',    desc:'Full access — manage users, delete leads, view all data',color:'var(--purple-600)'},
  sales_rep:{label:'Sales Rep',desc:'Create & manage assigned leads, log activities',         color:'var(--teal-600)'},
  viewer:   {label:'Viewer',   desc:'Read-only access to leads and pipeline',                 color:'var(--gray-600)'},
};
const PAL=[['#E6F1FB','#185FA5'],['#E1F5EE','#0F6E56'],['#EEEDFE','#3C3489'],['#FAEEDA','#854F0B'],['#FAECE7','#993C1D']];

export default function AccessControl() {
  const {user:me}=useAuth();
  const toast=useToast();
  const navigate=useNavigate();
  const [users,setUsers]=useState([]);
  const [loading,setLoading]=useState(true);
  const [editing,setEditing]=useState(null);
  const [newRole,setNewRole]=useState('');

  useEffect(()=>{
    if(me?.role!=='admin'){navigate('/dashboard');return;}
    api.get('/users').then(r=>setUsers(r.data)).finally(()=>setLoading(false));
  },[]);

  const handleRoleChange=async userId=>{
    try{
      const r=await api.put(`/users/${userId}/role`,{role:newRole});
      setUsers(p=>p.map(u=>u._id===userId?r.data:u));
      setEditing(null);toast('Role updated');
    }catch(err){toast(err.response?.data?.message||'Failed','error');}
  };

  const handleDelete=async(userId,name)=>{
    if(!window.confirm(`Remove ${name} from NexusCRM?`))return;
    try{
      await api.delete(`/users/${userId}`);
      setUsers(p=>p.filter(u=>u._id!==userId));toast(`${name} removed`);
    }catch(err){toast(err.response?.data?.message||'Failed','error');}
  };

  if(loading)return<div className="loading-center"><div className="spinner"/></div>;

  return (
    <div className="page-enter">
      <div style={{marginBottom:14}}>
        <h2 style={{fontFamily:'var(--font-display)',fontSize:14,fontWeight:700}}>Access Control</h2>
        <p style={{fontSize:10,color:'var(--gray-400)',marginTop:1}}>Manage team members and their permissions</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:14}}>
        {Object.entries(ROLES).map(([role,{label,desc,color}])=>(
          <div key={role} className="card" style={{borderLeft:`3px solid ${color}`}}>
            <div className="card-body">
              <span className={`role-badge ${role}`} style={{marginBottom:5,display:'inline-block'}}>{label}</span>
              <p style={{fontSize:10,color:'var(--gray-400)',lineHeight:1.5}}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">Team Members ({users.length})</span></div>
        <div className="table-wrapper" style={{borderRadius:0,border:'none',borderTop:'1px solid var(--gray-100)'}}>
          <table>
            <thead><tr><th>Member</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u=>{
                const initials=u.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
                const [bg,fg]=PAL[(u.name.charCodeAt(0)||0)%PAL.length];
                const isMe=u._id===me?.id;
                return(
                  <tr key={u._id}>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:7}}>
                        <div className="avatar avatar-sm" style={{background:bg,color:fg}}>{initials}</div>
                        <div style={{fontWeight:500}}>{u.name}{isMe&&<span style={{fontSize:9,color:'var(--gray-400)',fontWeight:400}}> (you)</span>}</div>
                      </div>
                    </td>
                    <td style={{color:'var(--gray-400)'}}>{u.email}</td>
                    <td>
                      {editing===u._id?(
                        <div style={{display:'flex',gap:4,alignItems:'center'}}>
                          <select className="form-input form-select" style={{padding:'2px 6px',fontSize:11,width:105}} value={newRole} onChange={e=>setNewRole(e.target.value)}>
                            <option value="admin">Admin</option><option value="sales_rep">Sales Rep</option><option value="viewer">Viewer</option>
                          </select>
                          <button className="btn btn-primary btn-sm" onClick={()=>handleRoleChange(u._id)}>Save</button>
                          <button className="btn btn-ghost btn-sm" onClick={()=>setEditing(null)}>✕</button>
                        </div>
                      ):(
                        <span className={`role-badge ${u.role}`}>{ROLES[u.role]?.label||u.role}</span>
                      )}
                    </td>
                    <td>
                      <span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:10,color:u.isActive?'var(--teal-600)':'var(--gray-400)'}}>
                        <span style={{width:5,height:5,borderRadius:'50%',background:u.isActive?'var(--teal-400)':'var(--gray-300)',display:'inline-block'}}/>
                        {u.isActive?'Active':'Inactive'}
                      </span>
                    </td>
                    <td style={{color:'var(--gray-400)',fontSize:10}}>{new Date(u.createdAt).toLocaleDateString('en-IN',{dateStyle:'medium'})}</td>
                    <td>
                      {!isMe&&(
                        <div style={{display:'flex',gap:4}}>
                          <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>{setEditing(u._id);setNewRole(u.role);}}><i className="ti ti-edit" style={{fontSize:12}}/></button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={()=>handleDelete(u._id,u.name)}><i className="ti ti-trash" style={{fontSize:12}}/></button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}