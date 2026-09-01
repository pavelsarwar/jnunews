import {createClient} from '@supabase/supabase-js';

const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const db=url&&key?createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}}):null;

export type SiteSettings={footer_description:string;copyright_text:string;facebook_url:string|null;youtube_url:string|null;instagram_url:string|null;linkedin_url:string|null;x_url:string|null};
export type FooterLink={id:number;label:string;url:string;sort_order:number;is_active:boolean};
export type Ad={id:number;title:string|null;position:string;image_url:string|null;link_url:string|null;alt_text:string|null;is_active:boolean;sort_order:number};

const defaultSettings:SiteSettings={footer_description:'স্বাধীন ও দায়িত্বশীল ডিজিটাল সংবাদমাধ্যম।',copyright_text:'© 2026 JnU News. All rights reserved.',facebook_url:null,youtube_url:null,instagram_url:null,linkedin_url:null,x_url:null};
const defaultLinks:FooterLink[]=[
{id:1,label:'আমাদের সম্পর্কে',url:'/about',sort_order:1,is_active:true},
{id:2,label:'বিজ্ঞাপন',url:'/advertise',sort_order:2,is_active:true},
{id:3,label:'সার্কুলেশন',url:'/circulation',sort_order:3,is_active:true},
{id:4,label:'নীতি ও শর্ত',url:'/terms',sort_order:4,is_active:true},
{id:5,label:'যোগাযোগ',url:'/contact',sort_order:5,is_active:true},
{id:6,label:'নিউজলেটার',url:'/newsletter',sort_order:6,is_active:true}
];

export async function getSiteSettings():Promise<SiteSettings>{if(!db)return defaultSettings;const {data,error}=await db.from('site_settings').select('footer_description,copyright_text,facebook_url,youtube_url,instagram_url,linkedin_url,x_url').eq('id',1).maybeSingle();return error||!data?defaultSettings:{...defaultSettings,...data} as SiteSettings;}
export async function getFooterLinks():Promise<FooterLink[]>{if(!db)return defaultLinks;const {data,error}=await db.from('footer_links').select('id,label,url,sort_order,is_active').eq('is_active',true).order('sort_order');return error||!data?.length?defaultLinks:data as FooterLink[];}
export async function getAd(position:string):Promise<Ad|null>{if(!db)return null;const {data,error}=await db.from('ads').select('id,title,position,image_url,link_url,alt_text,is_active,sort_order').eq('position',position).eq('is_active',true).order('sort_order').limit(1).maybeSingle();return error||!data?null:data as Ad;}
