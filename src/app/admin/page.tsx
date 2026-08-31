'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminFrame from '@/components/AdminFrame';
import { supabase } from '@/lib/supabase';

type Article={id:number;title:string;status:string;created_at:string;categories:{name:string}|null};
export default function AdminPage(){
 const [articles,setArticles]=useState<Article[]>([]); const [catCount,setCatCount]=useState(0); const [loading,setLoading]=useState(true);
 useEffect(()=>{(async()=>{const [{data:a},{count:c}]=await Promise.all([supabase.from('articles').select('id,title,status,created_at,categories(name)').order('created_at',{ascending:false}).limit(8),supabase.from('categories').select('*',{count:'exact',head:true})]);setArticles((a??[]) as unknown as Article[]);setCatCount(c??0);setLoading(false);})();},[]);
 const published=articles.filter(a=>a.status==='published').length; const drafts=articles.filter(a=>a.status==='draft').length;
 return <AdminFrame><div className="adminHeading"><div><p>JnU Newsroom</p><h1>ড্যাশবোর্ড</h1></div><Link className="primaryBtn" href="/admin/articles/new">+ নতুন সংবাদ</Link></div><div className="statGrid"><div className="statCard"><span>সাম্প্রতিক প্রকাশিত</span><strong>{published}</strong></div><div className="statCard"><span>ক্যাটাগরি</span><strong>{catCount}</strong></div><div className="statCard"><span>সাম্প্রতিক ড্রাফট</span><strong>{drafts}</strong></div><div className="statCard"><span>ডাটাবেস</span><strong>{loading?'…':'Live'}</strong></div></div><div className="adminPanel"><div className="sectionTitle"><h2>সাম্প্রতিক সংবাদ</h2><Link href="/admin/articles">সব দেখুন</Link></div>{!articles.length&&!loading?<p className="emptyState">এখনও কোনো সংবাদ যোগ করা হয়নি।</p>:<div className="adminTable">{articles.map(a=><div className="adminRow" key={a.id}><div><strong>{a.title}</strong><span>{a.categories?.name??'ক্যাটাগরি নেই'}</span></div><span>{a.status}</span><Link className="smallBtn" href={`/admin/articles/${a.id}/edit`}>সম্পাদনা</Link></div>)}</div>}</div></AdminFrame>;
}
