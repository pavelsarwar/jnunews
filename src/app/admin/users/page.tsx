'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import AdminFrame from '@/components/AdminFrame';
import { supabase } from '@/lib/supabase';

type Role = 'admin' | 'editor' | 'reporter';
type UserRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: Role;
  is_active: boolean;
  created_at: string;
};

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'reporter' as Role });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const headers = await authHeaders();
    const res = await fetch('/api/admin/users', { headers });
    const json = await res.json();
    if (!res.ok) setMessage(json.error || 'User list load failed');
    else setUsers(json.users || []);
    setLoading(false);
  }, []);

  useEffect(() => { void loadUsers(); }, [loadUsers]);

  async function createUser(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const headers = await authHeaders();
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (!res.ok) setMessage(json.error || 'User create failed');
    else {
      setMessage('User successfully created.');
      setForm({ full_name: '', email: '', password: '', role: 'reporter' });
      await loadUsers();
    }
    setSaving(false);
  }

  async function updateUser(id: string, changes: Partial<Pick<UserRow, 'role' | 'is_active'>>) {
    setMessage('');
    const headers = await authHeaders();
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ id, ...changes }),
    });
    const json = await res.json();
    if (!res.ok) setMessage(json.error || 'Update failed');
    else await loadUsers();
  }

  return <AdminFrame>
    <div className="adminPageHead">
      <div><span className="eyebrow">Access Control</span><h1>User Management</h1><p>নতুন user তৈরি করুন এবং role/active status manage করুন।</p></div>
    </div>

    <section className="adminPanel" style={{marginBottom:20}}>
      <div className="adminPanelHead"><h2>নতুন User</h2></div>
      <form onSubmit={createUser} className="cmsFormGrid">
        <label>নাম<input value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} placeholder="Full name" /></label>
        <label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="name@example.com" /></label>
        <label>Temporary Password<input type="password" minLength={8} required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Minimum 8 characters" /></label>
        <label>Role<select value={form.role} onChange={e=>setForm({...form,role:e.target.value as Role})}><option value="reporter">Reporter</option><option value="editor">Editor</option><option value="admin">Admin</option></select></label>
        <div><button className="adminPrimaryBtn" type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create User'}</button></div>
      </form>
      {message && <p style={{marginTop:12}}>{message}</p>}
    </section>

    <section className="adminPanel">
      <div className="adminPanelHead"><h2>Users</h2><span>{users.length} user</span></div>
      {loading ? <p>Loading...</p> : <div className="adminTableWrap"><table className="adminTable"><thead><tr><th>User</th><th>Role</th><th>Status</th><th>Created</th></tr></thead><tbody>{users.map(user=><tr key={user.id}><td><strong>{user.full_name || '—'}</strong><br/><span>{user.email || '—'}</span></td><td><select value={user.role} onChange={e=>void updateUser(user.id,{role:e.target.value as Role})}><option value="reporter">Reporter</option><option value="editor">Editor</option><option value="admin">Admin</option></select></td><td><button type="button" className={user.is_active ? 'adminStatus live' : 'adminStatus'} onClick={()=>void updateUser(user.id,{is_active:!user.is_active})}>{user.is_active ? 'Active' : 'Disabled'}</button></td><td>{new Date(user.created_at).toLocaleDateString('en-GB')}</td></tr>)}</tbody></table></div>}
    </section>
  </AdminFrame>;
}
