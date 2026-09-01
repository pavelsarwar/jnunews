import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import HomeSection from "@/components/HomeSection";
import {getCategories,getPublishedArticles} from "@/lib/news";
import "./portal.css";

export default async function Home(){
  const [articles,categories]=await Promise.all([getPublishedArticles(),getCategories()]);
  const lead=articles.find(a=>a.featured)??articles[0];
  const breaking=articles.find(a=>a.breaking);
  const side=articles.filter(a=>a.id!==lead?.id).slice(0,4);
  const latest=articles.filter(a=>a.id!==lead?.id).slice(4,10);
  const grouped=categories.slice(0,6).map(c=>({category:c,items:articles.filter(a=>a.category===c.name).slice(0,5)})).filter(g=>g.items.length);

  return <main>
    <Header/>
    {breaking&&<section className="breaking"><div className="container breakingInner"><strong>ব্রেকিং</strong><Link href={`/news/${breaking.slug}`}>{breaking.title}</Link></div></section>}

    <div className="container portalHome">
      <section className="portalLeadGrid">
        <div className="portalSideStories">{side.slice(0,2).map(a=><article key={a.id}><Link href={`/news/${a.slug}`}><Image src={a.image} alt={a.title} width={520} height={320}/></Link><span>{a.category}</span><h3><Link href={`/news/${a.slug}`}>{a.title}</Link></h3></article>)}</div>

        <article className="portalMainLead">
          <Link href={`/news/${lead.slug}`}><Image src={lead.image} alt={lead.title} width={1200} height={700} priority/></Link>
          <span className="categoryLabel">{lead.category}</span>
          <h1><Link href={`/news/${lead.slug}`}>{lead.title}</Link></h1>
          <p>{lead.excerpt}</p>
          <time>{lead.publishedAt}</time>
        </article>

        <aside className="portalLatest">
          <div className="portalTitleBar"><h2>সর্বশেষ</h2><span>JnU News</span></div>
          {latest.length?latest.map(a=><article key={a.id}><h3><Link href={`/news/${a.slug}`}>{a.title}</Link></h3><time>{a.publishedAt}</time></article>):side.slice(2).map(a=><article key={a.id}><h3><Link href={`/news/${a.slug}`}>{a.title}</Link></h3><time>{a.publishedAt}</time></article>)}
        </aside>
      </section>

      <section className="portalStrip">{articles.slice(1,5).map(a=><article key={a.id}><Link href={`/news/${a.slug}`}><Image src={a.image} alt={a.title} width={420} height={240}/></Link><h3><Link href={`/news/${a.slug}`}>{a.title}</Link></h3></article>)}</section>

      <div className="portalSections">
        {grouped.map(g=><HomeSection key={g.category.id} title={g.category.name} articles={g.items}/>) }
      </div>

      <section className="portalSection">
        <div className="portalSectionHead"><h2>আরও খবর</h2><span>সর্বশেষ আপডেট</span></div>
        <div className="portalMoreGrid">{articles.slice(6,18).map(a=><article key={a.id}><Link href={`/news/${a.slug}`}><Image src={a.image} alt={a.title} width={520} height={300}/></Link><span>{a.category}</span><h3><Link href={`/news/${a.slug}`}>{a.title}</Link></h3><time>{a.publishedAt}</time></article>)}</div>
      </section>
    </div>

    <footer><div className="container footerGrid"><div><div className="brand footerBrand"><span className="brandMark">JnU</span><span>NEWS</span></div><p>জগন্নাথ বিশ্ববিদ্যালয় থেকে বিশ্বজুড়ে।</p></div><div><strong>সম্পাদকীয়</strong><p>সত্য, নির্ভুলতা ও দায়িত্বশীল সাংবাদিকতায় অঙ্গীকারবদ্ধ।</p></div><div><strong>যোগাযোগ</strong><p>JnU News • Dhaka, Bangladesh</p></div></div></footer>
  </main>;
}
