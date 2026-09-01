'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminNav(){
 const router=useRouter();
 async function logout(){await supabase.auth.signOut();router.replace('/admin/login');}
 return <>
  <aside className="adminSidebar">
    <div className="adminSidebarTop"><Link href="/" className="brand adminBrand"><span className="brandMark">JnU</span><span>NEWS</span></Link><span className="adminDeskLabel">Newsroom</span></div>
    <nav className="adminDesktopNav">
      <Link href="/admin">ড্যাশবোর্ড</Link><Link href="/admin/articles">সংবাদ</Link><Link href="/admin/articles/new">+ নতুন সংবাদ</Link><Link href="/admin/categories">ক্যাটাগরি</Link><Link href="/admin/ads">বিজ্ঞাপন</Link><Link href="/admin/footer">ফুটার</Link><Link href="/admin/users">ইউজার</Link><Link href="/" target="_blank">সাইট দেখুন</Link><button className="adminLogout" onClick={logout}>লগআউট</button>
    </nav>
  </aside>
  <div className="adminMobileNav"><div className="adminMobileTop"><Link href="/" className="brand adminMobileBrand"><span className="brandMark">JnU</span><span>NEWS</span></Link><button className="adminMobileLogout" onClick={logout}>লগআউট</button></div><nav className="adminMobileScroll"><Link href="/admin">ড্যাশবোর্ড</Link><Link href="/admin/articles">সংবাদ</Link><Link href="/admin/articles/new">+ নতুন সংবাদ</Link><Link href="/admin/categories">ক্যাটাগরি</Link><Link href="/admin/ads">বিজ্ঞাপন</Link><Link href="/admin/footer">ফুটার</Link><Link href="/admin/users">ইউজার</Link><Link href="/" target="_blank">সাইট</Link></nav></div>
 </>;
}
