import {getAd} from '@/lib/site-content';

export default async function AdSlot({position,className=''}:{position:string;className?:string}){
 const ad=await getAd(position);
 if(!ad?.image_url)return null;
 const image=<img src={ad.image_url} alt={ad.alt_text||ad.title||'Advertisement'} loading="lazy"/>;
 return <div className={`dynamicAd ${className}`} data-position={position}>{ad.link_url?<a href={ad.link_url} target="_blank" rel="sponsored noopener noreferrer">{image}</a>:image}<span>ADVERTISEMENT</span></div>;
}
