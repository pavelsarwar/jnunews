import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

type UserRole = 'admin' | 'editor' | 'reporter';

async function requireAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };

  const admin = getSupabaseAdmin();
  const { data: userData, error: userError } = await admin.auth.getUser(token);
  if (userError || !userData.user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('role,is_active')
    .eq('id', userData.user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin' || profile.is_active === false) {
    return { error: NextResponse.json({ error: 'Admin access required' }, { status: 403 }) };
  }

  return { admin, user: userData.user };
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if ('error' in auth) return auth.error;

  const { data, error } = await auth.admin
    .from('profiles')
    .select('id,email,full_name,role,is_active,created_at,updated_at')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data || [] });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const fullName = String(body.full_name || '').trim();
  const role = String(body.role || 'reporter') as UserRole;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }
  if (!['admin', 'editor', 'reporter'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const { data: created, error: createError } = await auth.admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  });

  if (createError || !created.user) {
    return NextResponse.json({ error: createError?.message || 'Could not create user' }, { status: 400 });
  }

  const { error: profileError } = await auth.admin.from('profiles').upsert({
    id: created.user.id,
    email,
    full_name: fullName,
    role,
    is_active: true,
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    await auth.admin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, user_id: created.user.id });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin(request);
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => ({}));
  const id = String(body.id || '');
  const role = body.role ? String(body.role) as UserRole : undefined;
  const isActive = typeof body.is_active === 'boolean' ? body.is_active : undefined;

  if (!id) return NextResponse.json({ error: 'User id is required' }, { status: 400 });
  if (role && !['admin', 'editor', 'reporter'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (role) update.role = role;
  if (typeof isActive === 'boolean') update.is_active = isActive;

  const { error } = await auth.admin.from('profiles').update(update).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (typeof isActive === 'boolean') {
    const { error: authError } = await auth.admin.auth.admin.updateUserById(id, {
      ban_duration: isActive ? 'none' : '876000h',
    });
    if (authError) return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
