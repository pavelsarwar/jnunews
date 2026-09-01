import Link from "next/link";
import HeaderTools from "@/components/HeaderTools";
import { getCategories } from "@/lib/news";

export default async function Header(){
  const categories=await getCategories();
  return <header className="header">
    <div className="container brandRow" style={{minHeight:76,padding:"10px 0"}}>
      <Link href="/" className="brand" aria-label="JnU News home"><span className="brandMark">JnU</span><span>NEWS</span></Link>
      <HeaderTools/>
    </div>
    <nav className="nav"><div className="container navScroll"><Link href="/" className="navHome">প্রচ্ছদ</Link>{categories.map(c=><Link key={c.id} href={`/#${c.slug}`}>{c.name}</Link>)}</div></nav>
  </header>;
}
