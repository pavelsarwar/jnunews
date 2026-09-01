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
    <div className="adminPageHead usersPageHead">
      <div><span className="eyebrow">Access Control</span><h1>User Management</h1><p>নতুন user তৈরি করুন এবং role ও account status manage করুন।</p></div>
    </div>

    <section className="adminPanel usersCreatePanel">
      <div className="adminPanelHead usersPanelHead"><div><h2>নতুন User</h2><p>নাম, email, temporary password এবং role সেট করুন।</p></div></div>
      <form onSubmit={createUser} className="usersFormGrid">
        <label className="usersField"><span>নাম</span><input value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} placeholder="Full name" /></label>
        <label className="usersField"><span>Email</span><input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="name@example.com" /></label>
        <label className="usersField"><span>Temporary Password</span><input type="password" minLength={8} required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Minimum 8 characters" /></label>
        <label className="usersField"><span>Role</span><select value={form.role} onChange={e=>setForm({...form,role:e.target.value as Role})}><option value="reporter">Reporter</option><option value="editor">Editor</option><option value="admin">Admin</option></select></label>
        <div className="usersFormAction"><button className="adminPrimaryBtn usersCreateBtn" type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create User'}</button></div>
      </form>
      {message && <div className="usersMessage">{message}</div>}
    </section>

    <section className="adminPanel usersListPanel">
      <div className="adminPanelHead usersPanelHead"><div><h2>Users</h2><p>Role পরিবর্তন বা account disable/enable করুন।</p></div><span className="usersCount">{users.length} user</span></div>
      {loading ? <p className="usersLoading">Loading...</p> : <div className="adminTableWrap usersTableWrap"><table className="adminTable usersTable"><thead><tr><th>User</th><th>Role</th><th>Status</th><th>Created</th></tr></thead><tbody>{users.map(user=><tr key={user.id}><td><div className="usersIdentity"><strong>{user.full_name || 'Unnamed user'}</strong><span>{user.email || '—'}</span></div></td><td><select className="usersRoleSelect" value={user.role} onChange={e=>void updateUser(user.id,{role:e.target.value as Role})}><option value="reporter">Reporter</option><option value="editor">Editor</option><option value="admin">Admin</option></select></td><td><button type="button" className={user.is_active ? 'usersStatus isActive' : 'usersStatus'} onClick={()=>void updateUser(user.id,{is_active:!user.is_active})}>{user.is_active ? 'Active' : 'Disabled'}</button></td><td><span className="usersDate">{new Date(user.created_at).toLocaleDateString('en-GB')}</span></td></tr>)}</tbody></table></div>}
    </section>
  </AdminFrame>;
}
