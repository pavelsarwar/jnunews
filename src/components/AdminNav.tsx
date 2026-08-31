'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminNav(){
 const router=useRouter();
 async function logout(){await supabase.auth.signOut();router.replace('/admin/login');}
 return <aside className="adminSidebar"><Link href="/" className="brand adminBrand"><span className="brandMark">JnU</span><span>NEWS</span></Link><nav><Link href="/admin">ড্যাশবোর্ড</Link><Link href="/admin/articles">সংবাদ</Link><Link href="/admin/articles/new">+ নতুন সংবাদ</Link><Link href="/admin/categories">ক্যাটাগরি</Link><Link href="/" target="_blank">সাইট দেখুন</Link><button className="adminLogout" onClick={logout}>লগআউট</button></nav></aside>;
}
