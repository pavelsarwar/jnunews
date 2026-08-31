'use client';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminLogin(){
 const router=useRouter(); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
 useEffect(()=>{supabase.auth.getSession().then(({data})=>{if(data.session) router.replace('/admin');});},[router]);
 async function submit(e:FormEvent){e.preventDefault();setLoading(true);setError('');const {error}=await supabase.auth.signInWithPassword({email,password});setLoading(false);if(error){setError('ইমেইল বা পাসওয়ার্ড সঠিক নয়।');return;}router.replace('/admin');router.refresh();}
 return <main className="loginPage"><form className="loginCard" onSubmit={submit}><Link href="/" className="brand"><span className="brandMark">JnU</span><span>NEWS</span></Link><p>Newsroom Admin</p><h1>অ্যাডমিন লগইন</h1><label>ইমেইল<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label><label>পাসওয়ার্ড<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} /></label>{error&&<div className="formError">{error}</div>}<button disabled={loading}>{loading?'লগইন হচ্ছে...':'লগইন'}</button><small>শুধু অনুমোদিত newsroom user-এর জন্য।</small></form></main>;
}
