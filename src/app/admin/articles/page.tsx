'use client';
import { useEffect,useState } from 'react';
import Link from 'next/link';
import AdminFrame from '@/components/AdminFrame';
import { supabase } from '@/lib/supabase';
type A={id:number;title:string;slug:string;status:string;published_at:string|null;categories:{name:string}|null};
export default function Articles(){const [items,setItems]=useState<A[]>([]);async function load(){const {data}=await supabase.from('articles').select('id,title,slug,status,published_at,categories(name)').order('created_at',{ascending:false});setItems((data??[]) as unknown as A[]);}useEffect(()=>{load();},[]);async function remove(id:number){if(!confirm('এই সংবাদটি মুছে ফেলবেন?'))return;await supabase.from('articles').delete().eq('id',id);load();}return <AdminFrame><div className="adminHeading"><div><p>Newsroom</p><h1>সংবাদ</h1></div><Link href="/admin/articles/new" className="primaryBtn">+ নতুন সংবাদ</Link></div><div className="adminPanel"><div className="adminTable">{items.map(a=><div className="adminRow adminRowWide" key={a.id}><div><strong>{a.title}</strong><span>{a.categories?.name??'ক্যাটাগরি নেই'} · {a.status}</span></div><Link className="smallBtn" href={`/admin/articles/${a.id}/edit`}>সম্পাদনা</Link><button className="dangerBtn" onClick={()=>remove(a.id)}>Delete</button></div>)}{!items.length&&<p className="emptyState">এখনও কোনো সংবাদ নেই।</p>}</div></div></AdminFrame>}
