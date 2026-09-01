import Header from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import {searchPublishedArticles} from '@/lib/news';

export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string}>}){
  const {q=''}=await searchParams;
  const results=await searchPublishedArticles(q);
  return <main><Header/><div className="container searchPage"><div className="sectionTitle"><h1>সংবাদ খুঁজুন</h1><span>{q?`${results.length} ফলাফল`:''}</span></div><form className="searchForm" action="/search"><input name="q" defaultValue={q} placeholder="শিরোনাম বা কীওয়ার্ড লিখুন" autoFocus/><button type="submit" className="primaryBtn">খুঁজুন</button></form>{q&&<div className="searchSummary">“{q}” এর জন্য ফলাফল</div>}{results.length>0?<div className="cardGrid searchResults">{results.map(a=><NewsCard key={a.id} article={a}/>)}</div>:q?<div className="emptyState">কোনো সংবাদ পাওয়া যায়নি।</div>:null}</div></main>;
}
