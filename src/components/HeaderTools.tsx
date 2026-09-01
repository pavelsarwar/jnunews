'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';

function formatNow(date:Date){
  const day=new Intl.DateTimeFormat('bn-BD',{weekday:'long',timeZone:'Asia/Dhaka'}).format(date);
  const d=new Intl.DateTimeFormat('bn-BD',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Dhaka'}).format(date);
  const t=new Intl.DateTimeFormat('bn-BD',{hour:'numeric',minute:'2-digit',hour12:true,timeZone:'Asia/Dhaka'}).format(date);
  return {day,d,t};
}

export default function HeaderTools(){
  const [now,setNow]=useState<Date|null>(null);
  useEffect(()=>{setNow(new Date());const id=setInterval(()=>setNow(new Date()),30000);return()=>clearInterval(id);},[]);
  const f=now?formatNow(now):null;
  return <div className="headerTools">
    <div className="headerDateTime" aria-label="বাংলাদেশ সময়">
      <strong>{f?.day??'—'}</strong>
      <span>{f?.d??'—'} · {f?.t??'—'}</span>
    </div>
    <Link href="/search" className="searchIconBtn" aria-label="সংবাদ খুঁজুন" title="সংবাদ খুঁজুন">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    </Link>
  </div>;
}
