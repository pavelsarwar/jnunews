'use client';

import { useState } from 'react';
import AdminFrame from '@/components/AdminFrame';
import { supabase } from '@/lib/supabase';
import { categories, articles } from '@/lib/data';

export default function SeedPage(){
  const [running,setRunning]=useState(false);
  const [message,setMessage]=useState('');

  async function seed(){
    setRunning(true);
    setMessage('ক্যাটাগরি যোগ করা হচ্ছে...');

    const categoryRows=categories.map((c,index)=>({
      name:c.name,
      slug:c.slug,
      sort_order:index+1,
      is_active:true,
      updated_at:new Date().toISOString()
    }));

    const {error:catError}=await supabase.from('categories').upsert(categoryRows,{onConflict:'slug'});
    if(catError){setMessage(`ক্যাটাগরি যোগ করা যায়নি: ${catError.message}`);setRunning(false);return;}

    const {data:dbCategories,error:readError}=await supabase.from('categories').select('id,name,slug');
    if(readError){setMessage(`ক্যাটাগরি পড়া যায়নি: ${readError.message}`);setRunning(false);return;}

    const idByName=new Map((dbCategories??[]).map(c=>[c.name,c.id]));
    const publishDates:Record<string,string>={
      'jnunews-digital-news-journey':'2026-09-01T06:00:00.000Z',
      'fact-checking-in-campus-journalism':'2026-09-01T05:00:00.000Z',
      'future-skills-for-students-in-ai-era':'2026-08-31T10:00:00.000Z',
      'research-and-innovation-in-higher-education':'2026-08-31T09:00:00.000Z'
    };

    const articleRows=articles.map(a=>({
      title:a.title,
      slug:a.slug,
      excerpt:a.excerpt,
      content:`<p>${a.excerpt}</p>`,
      featured_image:a.image,
      reporter_name:'JnU News Desk',
      category_id:idByName.get(a.category)??null,
      status:'published',
      is_featured:Boolean(a.featured),
      is_breaking:Boolean(a.breaking),
      tags:['ডেমো'],
      meta_title:a.title,
      meta_description:a.excerpt,
      published_at:publishDates[a.slug]??new Date().toISOString(),
      updated_at:new Date().toISOString()
    }));

    setMessage('ডেমো সংবাদ যোগ করা হচ্ছে...');
    const {error:articleError}=await supabase.from('articles').upsert(articleRows,{onConflict:'slug'});
    if(articleError){setMessage(`সংবাদ যোগ করা যায়নি: ${articleError.message}`);setRunning(false);return;}

    setMessage(`সম্পন্ন। ${categories.length}টি ক্যাটাগরি এবং ${articles.length}টি ডেমো সংবাদ backend-এ sync হয়েছে।`);
    setRunning(false);
  }

  return <AdminFrame>
    <div className="adminHeading"><div><p>Newsroom Setup</p><h1>Demo Data</h1></div></div>
    <div className="adminPanel formStack" style={{maxWidth:760}}>
      <h2>Frontend data backend-এ sync করুন</h2>
      <p>Frontend-এর সব ক্যাটাগরি ও demo news Supabase-এ যোগ হবে। একই slug আগে থাকলে duplicate তৈরি হবে না। পরে সংবাদ বা ক্যাটাগরি Admin panel থেকে delete করতে পারবেন; delete করার পর এগুলো নিজে থেকে আবার তৈরি হবে না।</p>
      <div className="adminNote"><strong>যা যোগ হবে</strong><p>{categories.length}টি ক্যাটাগরি • {articles.length}টি প্রকাশিত demo news</p></div>
      <button type="button" className="primaryBtn" onClick={seed} disabled={running}>{running?'Sync হচ্ছে...':'Backend-এ Demo Data দিন'}</button>
      {message&&<div className="adminSeedMessage">{message}</div>}
    </div>
  </AdminFrame>;
}
