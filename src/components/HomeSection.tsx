import Link from 'next/link';
import Image from 'next/image';
import type {Article} from '@/lib/data';

export default function HomeSection({title,articles}:{title:string;articles:Article[]}){
  if(!articles.length)return null;
  const [lead,...rest]=articles;
  return <section className="portalSection">
    <div className="portalSectionHead"><h2>{title}</h2><span>আরও পড়ুন</span></div>
    <div className="portalSectionGrid">
      <article className="portalSectionLead">
        <Link href={`/news/${lead.slug}`}><Image src={lead.image} alt={lead.title} width={900} height={520}/></Link>
        <h3><Link href={`/news/${lead.slug}`}>{lead.title}</Link></h3>
        <p>{lead.excerpt}</p>
      </article>
      <div className="portalSectionList">{rest.slice(0,4).map(a=><article key={a.id}><Link href={`/news/${a.slug}`}><Image src={a.image} alt={a.title} width={260} height={160}/></Link><div><h4><Link href={`/news/${a.slug}`}>{a.title}</Link></h4><time>{a.publishedAt}</time></div></article>)}</div>
    </div>
  </section>;
}
