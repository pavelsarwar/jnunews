'use client';

import { FormEvent,useEffect,useState } from 'react';
import { supabase } from '@/lib/supabase';

type Cat={id:number;name:string;slug:string;is_active:boolean;sort_order:number|null};
const slugify=(s:string)=>s.normalize('NFKC').toLowerCase().trim().replace(/\s+/g,'-').replace(/[^\p{L}\p{N}-]/gu,'').replace(/-+/g,'-');

export default function CategoryManager(){
 const [items,setItems]=useState<Cat[]>([]);
 const [name,setName]=useState('');const [slug,setSlug]=useState('');const [msg,setMsg]=useState('');
 const [editing,setEditing]=useState<Cat|null>(null);const [saving,setSaving]=useState(false);
 async function load(){const {data,error}=await supabase.from('categories').select('id,name,slug,is_active,sort_order').order('sort_order');if(error){setMsg(error.message);return;}setItems((data??[]) as Cat[]);}
 useEffect(()=>{load();},[]);
 async function add(e:FormEvent){e.preventDefault();setMsg('');const finalSlug=slug||slugify(name);const {error}=await supabase.from('categories').insert({name,slug:finalSlug,sort_order:items.length+1,is_active:true});if(error){setMsg(error.message);return;}setName('');setSlug('');setMsg('ক্যাটাগরি যোগ হয়েছে।');load();}
 function startEdit(c:Cat){setEditing({...c});setMsg('');}
 async function saveEdit(e:FormEvent){e.preventDefault();if(!editing)return;setSaving(true);setMsg('');const finalSlug=editing.slug||slugify(editing.name);const {error}=await supabase.from('categories').update({name:editing.name,slug:finalSlug,is_active:editing.is_active,sort_order:editing.sort_order??0,updated_at:new Date().toISOString()}).eq('id',editing.id);setSaving(false);if(error){setMsg(error.message);return;}setEditing(null);setMsg('ক্যাটাগরি আপডেট হয়েছে।');load();}
 async function remove(id:number){if(!confirm('এই ক্যাটাগরি মুছে ফেলবেন?'))return;const {error}=await supabase.from('categories').delete().eq('id',id);if(error){setMsg(error.message);return;}load();}
 return <div className="twoColAdmin">
   <form className="adminPanel formStack" onSubmit={add}><h2>নতুন ক্যাটাগরি</h2><label>নাম<input required value={name} onChange={e=>setName(e.target.value)}/></label><label>Slug<input placeholder="campus-news" value={slug} onChange={e=>setSlug(e.target.value)}/></label><button className="primaryBtn">যোগ করুন</button>{msg&&<small>{msg}</small>}</form>
   <div className="adminPanel"><h2>সব ক্যাটাগরি</h2><div className="adminTable">{items.map(c=><div className="adminRow categoryAdminRow" key={c.id}><div><strong>{c.name}</strong><span>{c.slug} · Sort {c.sort_order??0} · {c.is_active?'Active':'Hidden'}</span></div><div className="adminRowActions"><button type="button" className="smallBtn" onClick={()=>startEdit(c)}>Edit</button><button type="button" className="dangerBtn" onClick={()=>remove(c.id)}>Delete</button></div></div>)}{!items.length&&<p className="emptyState">এখনও কোনো ক্যাটাগরি নেই।</p>}</div></div>
   {editing&&<div className="adminModalBackdrop" onClick={()=>setEditing(null)}><form className="adminModalCard formStack" onSubmit={saveEdit} onClick={e=>e.stopPropagation()}><div className="adminModalHead"><h2>ক্যাটাগরি সম্পাদনা</h2><button type="button" className="adminModalClose" onClick={()=>setEditing(null)}>×</button></div><label>নাম<input required value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})}/></label><label>Slug<input value={editing.slug} onChange={e=>setEditing({...editing,slug:e.target.value})}/></label><label>Sort order<input type="number" min="0" value={editing.sort_order??0} onChange={e=>setEditing({...editing,sort_order:Number(e.target.value)})}/></label><label className="checkRow"><input type="checkbox" checked={editing.is_active} onChange={e=>setEditing({...editing,is_active:e.target.checked})}/> Active / menu-তে দেখাবে</label><div className="adminModalActions"><button type="button" className="dangerBtn" onClick={()=>setEditing(null)}>Cancel</button><button className="primaryBtn" disabled={saving}>{saving?'সেভ হচ্ছে...':'Update Category'}</button></div></form></div>}
 </div>;
}
