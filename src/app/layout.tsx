import type {Metadata} from "next"; import {Anek_Bangla} from "next/font/google"; import "./globals.css"; import "./rich-editor.css";
const anek=Anek_Bangla({subsets:["bengali"],display:"swap",weight:["400","500","600","700","800"]});
export const metadata:Metadata={title:{default:"JnU News | জগন্নাথ বিশ্ববিদ্যালয় থেকে বিশ্বজুড়ে",template:"%s | JnU News"},description:"জগন্নাথ বিশ্ববিদ্যালয়, ক্যাম্পাস, শিক্ষা, প্রযুক্তি, জাতীয় ও আন্তর্জাতিক সংবাদ।",metadataBase:new URL("https://jnunews.com")};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="bn"><body className={anek.className}>{children}</body></html>}
