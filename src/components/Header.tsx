import Link from "next/link";
import HeaderTools from "@/components/HeaderTools";
import { getCategories } from "@/lib/news";

export default async function Header(){
  const categories=await getCategories();
  return <header className="header">
    <div className="container brandRow">
      <div>
        <Link href="/" className="brand" aria-label="JnU News home"><span className="brandMark">JnU</span><span>NEWS</span></Link>
        <div className="tagline">জগন্নাথ বিশ্ববিদ্যালয় থেকে বিশ্বজুড়ে</div>
      </div>
      <HeaderTools/>
    </div>
    <nav className="nav"><div className="container navScroll"><Link href="/" className="navHome">প্রচ্ছদ</Link>{categories.map(c=><Link key={c.id} href={`/#${c.slug}`}>{c.name}</Link>)}</div></nav>
  </header>;
}
