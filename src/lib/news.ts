import { createClient } from '@supabase/supabase-js';
import { articles as fallbackArticles, categories as fallbackCategories, type Article, type Category } from './data';

const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const db=url&&key?createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}}):null;

const bnDate=(value:string|null)=>value?new Intl.DateTimeFormat('bn-BD',{year:'numeric',month:'long',day:'numeric',timeZone:'Asia/Dhaka'}).format(new Date(value)):'';

export async function getCategories():Promise<Category[]>{if(!db)return fallbackCategories;const {data,error}=await db.from('categories').select('id,name,slug').eq('is_active',true).order('sort_order');if(error||!data?.length)return fallbackCategories;return data as Category[];}

export async function getPublishedArticles():Promise<Article[]>{if(!db)return fallbackArticles;const {data,error}=await db.from('articles').select('id,title,slug,excerpt,featured_image,published_at,is_featured,is_breaking,categories(name)').eq('status','published').lte('published_at',new Date().toISOString()).order('published_at',{ascending:false}).limit(30);if(error||!data?.length)return fallbackArticles;return data.map((row:any)=>({id:row.id,title:row.title,slug:row.slug,excerpt:row.excerpt??'',category:row.categories?.name??'সংবাদ',image:row.featured_image||'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',publishedAt:bnDate(row.published_at),featured:row.is_featured,breaking:row.is_breaking}));}

export async function searchPublishedArticles(query:string):Promise<Article[]>{const q=query.trim();if(!q)return [];if(!db)return fallbackArticles.filter(a=>(a.title+' '+a.excerpt).toLowerCase().includes(q.toLowerCase()));const safe=q.replace(/[%_,]/g,' ');const {data,error}=await db.from('articles').select('id,title,slug,excerpt,featured_image,published_at,is_featured,is_breaking,categories(name)').eq('status','published').lte('published_at',new Date().toISOString()).or(`title.ilike.%${safe}%,excerpt.ilike.%${safe}%`).order('published_at',{ascending:false}).limit(30);if(error||!data)return [];return data.map((row:any)=>({id:row.id,title:row.title,slug:row.slug,excerpt:row.excerpt??'',category:row.categories?.name??'সংবাদ',image:row.featured_image||'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',publishedAt:bnDate(row.published_at),featured:row.is_featured,breaking:row.is_breaking}));}

export async function getPublishedArticle(slug:string){if(!db)return null;const {data,error}=await db.from('articles').select('*,categories(name)').eq('slug',slug).eq('status','published').maybeSingle();if(error||!data)return null;return data as any;}

export function formatBanglaDate(value:string|null){return bnDate(value);}
