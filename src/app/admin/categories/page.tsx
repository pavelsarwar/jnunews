import AdminFrame from '@/components/AdminFrame';
import CategoryManager from '@/components/CategoryManager';

export default function Categories(){
  return <AdminFrame>
    <div className="adminHeading"><div><p>Newsroom</p><h1>ক্যাটাগরি</h1></div></div>
    <CategoryManager/>
  </AdminFrame>;
}
