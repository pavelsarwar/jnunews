'use client';
import { useEffect,useState } from 'react';
import { useParams } from 'next/navigation';
import AdminFrame from '@/components/AdminFrame';
import ArticleEditor from '@/components/ArticleEditor';
import { supabase } from '@/lib/supabase';
export default function EditArticle(){const params=useParams<{id:string}>();const [article,setArticle]=useState<Record<string,unknown>|null>(null);const [error,setError]=useState('');useEffect(()=>{supabase.from('articles').select('*').eq('id',Number(params.id)).single().then(({data,error})=>{if(error)setError(error.message);else setArticle(data);});},[params.id]);return <AdminFrame><div className="adminHeading"><div><p>Newsroom</p><h1>সংবাদ সম্পাদনা</h1></div></div>{error?<div className="formError">{error}</div>:article?<ArticleEditor initial={article as never}/>:<p>লোড হচ্ছে...</p>}</AdminFrame>}
