'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminGuard({children}:{children:React.ReactNode}){
  const router=useRouter();
  const [ready,setReady]=useState(false);
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      if(!data.session) router.replace('/admin/login'); else setReady(true);
    });
    const {data:sub}=supabase.auth.onAuthStateChange((_e,session)=>{if(!session) router.replace('/admin/login');});
    return ()=>sub.subscription.unsubscribe();
  },[router]);
  if(!ready) return <div className="adminLoading">লোড হচ্ছে...</div>;
  return <>{children}</>;
}
