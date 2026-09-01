import Link from 'next/link';
import {getFooterLinks,getSiteSettings} from '@/lib/site-content';

export default async function PublicFooter(){
 const [settings,links]=await Promise.all([getSiteSettings(),getFooterLinks()]);
 const socials=[{label:'Facebook',url:settings.facebook_url},{label:'YouTube',url:settings.youtube_url},{label:'Instagram',url:settings.instagram_url},{label:'LinkedIn',url:settings.linkedin_url},{label:'X',url:settings.x_url}].filter(item=>Boolean(item.url));
 return <footer className="refFooter"><div className="container"><div className="refFooterGrid"><div><div className="brand footerBrand"><span className="brandMark">JnU</span><span>NEWS</span></div><p>স্বাধীন ও দায়িত্বশীল ডিজিটাল সংবাদমাধ্যম।</p></div><div className="footerLinkBlock"><strong>গুরুত্বপূর্ণ লিংক</strong><nav>{links.map(link=>link.url.startsWith('/')?<Link key={link.id} href={link.url}>{link.label}</Link>:<a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>)}</nav></div><div className="footerSocialBlock"><strong>Social Media</strong><nav>{socials.length?socials.map(item=><a key={item.label} href={String(item.url)} target="_blank" rel="noopener noreferrer">{item.label}</a>):<span>Social links শিগগিরই</span>}</nav></div><div><strong>যোগাযোগ</strong><p>Dhaka, Bangladesh</p></div></div><div className="footerBottom"><span>{settings.copyright_text}</span><span>JnU News</span></div></div></footer>;
}
