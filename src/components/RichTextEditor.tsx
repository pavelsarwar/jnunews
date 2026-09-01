'use client';

import { useCallback } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { supabase } from '@/lib/supabase';

export default function RichTextEditor({value,onChange}:{value:string;onChange:(html:string)=>void}){
  const editor=useEditor({
    immediatelyRender:false,
    extensions:[
      StarterKit,
      Link.configure({openOnClick:false,autolink:true}),
      Image.configure({HTMLAttributes:{class:'articleInlineImage'}}),
      Youtube.configure({controls:true,nocookie:true,width:800,height:450,HTMLAttributes:{class:'articleYoutube'}}),
    ],
    content:value || '<p></p>',
    editorProps:{attributes:{class:'richEditorContent'}},
    onUpdate:({editor})=>onChange(editor.getHTML()),
  });

  const addLink=useCallback(()=>{
    if(!editor)return;
    const previous=editor.getAttributes('link').href as string|undefined;
    const url=window.prompt('লিংক দিন',previous||'https://');
    if(url===null)return;
    if(!url){editor.chain().focus().extendMarkRange('link').unsetLink().run();return;}
    editor.chain().focus().extendMarkRange('link').setLink({href:url}).run();
  },[editor]);

  const addYoutube=useCallback(()=>{
    if(!editor)return;
    const url=window.prompt('YouTube ভিডিওর URL দিন');
    if(url) editor.commands.setYoutubeVideo({src:url,width:800,height:450});
  },[editor]);

  const uploadInlineImage=useCallback(async(file:File)=>{
    if(!editor)return;
    const ext=file.name.split('.').pop()||'jpg';
    const path=`inline/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const {error}=await supabase.storage.from('news-images').upload(path,file,{upsert:false});
    if(error){window.alert(error.message);return;}
    const {data}=supabase.storage.from('news-images').getPublicUrl(path);
    editor.chain().focus().setImage({src:data.publicUrl,alt:file.name}).run();
  },[editor]);

  if(!editor)return <div className="richEditorLoading">Editor loading…</div>;
  return <div className="richEditor">
    <div className="richToolbar">
      <button type="button" onClick={()=>editor.chain().focus().toggleBold().run()} className={editor.isActive('bold')?'active':''}><strong>B</strong></button>
      <button type="button" onClick={()=>editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic')?'active':''}><em>I</em></button>
      <button type="button" onClick={()=>editor.chain().focus().toggleHeading({level:2}).run()}>H2</button>
      <button type="button" onClick={()=>editor.chain().focus().toggleHeading({level:3}).run()}>H3</button>
      <button type="button" onClick={()=>editor.chain().focus().toggleBulletList().run()}>• List</button>
      <button type="button" onClick={()=>editor.chain().focus().toggleOrderedList().run()}>1. List</button>
      <button type="button" onClick={()=>editor.chain().focus().toggleBlockquote().run()}>❝ Quote</button>
      <button type="button" onClick={addLink}>🔗 Link</button>
      <label className="toolbarUpload">🖼 ছবি<input type="file" accept="image/*" hidden onChange={e=>{const f=e.target.files?.[0];if(f)uploadInlineImage(f);e.currentTarget.value='';}}/></label>
      <button type="button" onClick={addYoutube}>▶ YouTube</button>
      <button type="button" onClick={()=>editor.chain().focus().undo().run()}>↶</button>
      <button type="button" onClick={()=>editor.chain().focus().redo().run()}>↷</button>
    </div>
    <EditorContent editor={editor}/>
  </div>;
}
