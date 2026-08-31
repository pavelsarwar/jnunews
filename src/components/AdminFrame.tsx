'use client';
import AdminGuard from './AdminGuard';
import AdminNav from './AdminNav';
export default function AdminFrame({children}:{children:React.ReactNode}){return <AdminGuard><main className="adminShell"><AdminNav/><section className="adminContent">{children}</section></main></AdminGuard>}
