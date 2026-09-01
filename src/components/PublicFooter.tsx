import Link from 'next/link';
import {getFooterLinks,getSiteSettings} from '@/lib/site-content';

export default async function PublicFooter(){
 const [settings,links]=await Promise.all([getSiteSettings(),getFooterLinks()]);
 const socials=[['Facebook',settings.facebook_url],['YouTube',settings.youtube_url],['Instagram',settings.instagram_url],['LinkedIn',settings.linkedin_url],['X',settings.x_url]].filter(([,url])=>Boolean(url));
 return <footer className="refFooter"><div className="container"><div className="refFooterGrid"><div><div className="brand footerBrand"><span className="brandMark">JnU</span><span>NEWS</span></div><p>স্বাধীন ও দায়িত্বশীল ডিজিটাল সংবাদমাধ্যম।</p></div><div className="footerLinkBlock"><strong>গুরুত্বপূর্ণ লিংক</strong><nav>{links.map(link=>link.url.startsWith('/')?<Link key={link.id} href={link.url}>{link.label}</Link>:<a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>)}</nav></div><div className="footerSocialBlock"><strong>Social Media</strong><nav>{socials.length?socials.map(([label,url])=><a key={label} href={String(url)} target="_blank" rel="noopener noreferrer">{label}</a>):<span>Social links শিগগিরই</span>}</nav></div><div><strong>যোগাযোগ</strong><p>Dhaka, Bangladesh</p></div></div><div className="footerBottom"><span>{settings.copyright_text}</span><span>JnU News</span></div></div></footer>;
}
