"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import { Bold, Italic, Strikethrough, List, ListOrdered, Link2 } from "lucide-react";
import { useEffect } from "react";

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border-b border-anthracite-200 bg-anthracite-50 rounded-t-xl">
      <button 
        type="button"
        title="Kalın"
        onClick={() => editor.chain().focus().toggleBold().run()} 
        className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-primary-100 text-primary-700' : 'hover:bg-anthracite-200 text-anthracite-600'}`}
      >
        <Bold size={18} />
      </button>
      <button 
        type="button"
        title="İtalik"
        onClick={() => editor.chain().focus().toggleItalic().run()} 
        className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-primary-100 text-primary-700' : 'hover:bg-anthracite-200 text-anthracite-600'}`}
      >
        <Italic size={18} />
      </button>
      <button 
        type="button"
        title="Üstü Çizili"
        onClick={() => editor.chain().focus().toggleStrike().run()} 
        className={`p-2 rounded-lg transition-colors ${editor.isActive('strike') ? 'bg-primary-100 text-primary-700' : 'hover:bg-anthracite-200 text-anthracite-600'}`}
      >
        <Strikethrough size={18} />
      </button>

      <div className="w-px h-6 bg-anthracite-200 mx-1" />

      <button 
        type="button"
        title="Maddeli Liste"
        onClick={() => editor.chain().focus().toggleBulletList().run()} 
        className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-primary-100 text-primary-700' : 'hover:bg-anthracite-200 text-anthracite-600'}`}
      >
        <List size={18} />
      </button>
      <button 
        type="button"
        title="Numaralı Liste"
        onClick={() => editor.chain().focus().toggleOrderedList().run()} 
        className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-primary-100 text-primary-700' : 'hover:bg-anthracite-200 text-anthracite-600'}`}
      >
        <ListOrdered size={18} />
      </button>

      <div className="w-px h-6 bg-anthracite-200 mx-1" />

      <button 
        type="button"
        title="Bağlantı (Link)"
        onClick={() => {
           const url = window.prompt('Site Bağlantısı:');
           if(url) editor.chain().focus().setLink({ href: url }).run();
           else if (url === "") editor.chain().focus().unsetLink().run();
        }} 
        className={`p-2 rounded-lg transition-colors ${editor.isActive('link') ? 'bg-primary-100 text-primary-700' : 'hover:bg-anthracite-200 text-anthracite-600'}`}
      >
        <Link2 size={18} />
      </button>
    </div>
  )
}

export default function RichTextEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none p-4 min-h-[300px]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="border border-anthracite-200 rounded-xl bg-white focus-within:border-primary-400 focus-within:ring-1 focus-within:ring-primary-400 transition-all shadow-sm">
      <MenuBar editor={editor} />
      <div className="p-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
