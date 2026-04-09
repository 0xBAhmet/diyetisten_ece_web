"use client";

import { useEffect, useState } from "react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Image as ImageIcon } from "lucide-react";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/blog");
      if(res.ok) setPosts(await res.json());
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchPosts();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!editingId) {
      setSlug(
        val.toLowerCase()
          .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
          .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (uploadData.success && uploadData.url) setCoverImage(uploadData.url);
      else alert("Hata: " + uploadData.error);
    } catch { alert("Bağlantı hatası"); }
    setIsUploading(false);
  };

  const handleSave = async () => {
    if (!title || !slug || !content) return alert("Lütfen tüm zorunlu alanları doldurun.");
    setIsSubmitting(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const body = JSON.stringify({ id: editingId, title, slug, content, coverImage });
      
      const res = await fetch("/api/blog", {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (res.ok) {
        handleCancel();
        fetchPosts();
      } else {
        const data = await res.json();
        alert(data.error || "Bir hata oluştu.");
      }
    } catch (err) {
      alert("Bağlantı hatası!");
    }
    setIsSubmitting(false);
  };

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setCoverImage(post.coverImage || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setContent("");
    setCoverImage(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu yazıyı kalıcı olarak silmek istediğinize emin misiniz? (Geri alınamaz)")) return;
    try {
      const res = await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        if (editingId === id) handleCancel();
        fetchPosts();
      } else {
        alert("Silme işlemi başarısız.");
      }
    } catch (err) {
      alert("Bağlantı hatası.");
    }
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col gap-12 pb-24">
      <div>
        <h1 className="text-3xl font-bold text-anthracite-900 mb-2">Blog Yönetimi</h1>
        <p className="text-anthracite-600">Yeni yazılar ekleyin, kapak görselleri belirleyin ve yönetin.</p>
      </div>

      {/* Editor Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-anthracite-100 shadow-sm flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-anthracite-100 pb-4">
          <h2 className="text-xl font-bold text-anthracite-900">
             {editingId ? "Yazıyı Düzenle" : "Yeni Yazı Ekle"}
          </h2>
          {editingId && (
            <button onClick={handleCancel} className="text-sm font-medium text-anthracite-500 hover:text-anthracite-800 transition">Düzenlemeden Çık</button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Kolon - Başlık & Slug & Editor */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-anthracite-600 mb-2">Yazı Başlığı</label>
                <input 
                  value={title} onChange={handleTitleChange} 
                  placeholder="Örn: Şekersiz Beslenmenin Yolları" 
                  className="w-full px-4 py-3 rounded-xl border border-anthracite-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-anthracite-600 mb-2">URL (Slug)</label>
                <input 
                  value={slug} onChange={(e) => setSlug(e.target.value)} 
                  placeholder="sekersiz-beslenmenin-yollari" 
                  className="w-full px-4 py-3 rounded-xl border border-anthracite-200 bg-anthracite-50 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-anthracite-600 mb-2">İçerik</label>
              <div className="prose-reset border border-anthracite-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-400">
                <RichTextEditor value={content} onChange={setContent} />
              </div>
            </div>
          </div>

          {/* Sağ Kolon - Resim */}
          <div className="flex flex-col gap-4">
             <label className="block text-sm font-medium text-anthracite-600 mb-2">Kapak Görseli</label>
             <div className="w-full aspect-[4/3] rounded-2xl bg-anthracite-50 border-2 border-dashed border-anthracite-200 overflow-hidden flex flex-col items-center justify-center relative group">
                {coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover group-hover:opacity-50 transition" />
                ) : (
                  <div className="text-anthracite-400 flex flex-col items-center gap-2">
                    <ImageIcon size={32} />
                    <span className="text-sm font-medium">Görsel Seç</span>
                  </div>
                )}
                
                {/* Overlay for re-uploading */}
                <label className={`absolute inset-0 cursor-pointer flex items-center justify-center ${coverImage ? 'opacity-0 group-hover:opacity-100 bg-anthracite-900/40 text-white' : ''} transition-all`}>
                   <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={isUploading} />
                   {isUploading ? <span className="font-bold">Yükleniyor...</span> : (coverImage && <span className="font-medium bg-anthracite-900/80 px-4 py-2 rounded-lg">Görseli Değiştir</span>)}
                </label>
             </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-anthracite-100 gap-3">
          {editingId && (
            <button 
              onClick={handleCancel}
              className="px-6 py-3 bg-anthracite-100 text-anthracite-700 font-medium rounded-xl hover:bg-anthracite-200 transition"
            >
              Vazgeç
            </button>
          )}
          <button 
            disabled={isSubmitting}
            onClick={handleSave} 
            className="px-8 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Kaydediliyor..." : (editingId ? "Değişiklikleri Kaydet" : "Yeni Gönderiyi Yayınla")}
          </button>
        </div>
      </div>

      {/* List Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-anthracite-900">Mevcut Yazılar ({posts.length})</h2>
        {posts.map((post) => (
          <div key={post.id} className={`p-4 border ${editingId === post.id ? 'border-primary-400 bg-primary-50' : 'border-anthracite-100 bg-white'} rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between shadow-sm gap-4 transition-all`}>
            
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-xl bg-anthracite-100 overflow-hidden shrink-0 hidden md:block">
                 {post.coverImage ? (
                   // eslint-disable-next-line @next/next/no-img-element
                   <img src={post.coverImage} alt="Kapak" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-anthracite-300"><ImageIcon size={20} /></div>
                 )}
               </div>
               <div>
                 <h3 className="font-bold text-anthracite-900 text-lg mb-1">{post.title}</h3>
                 <p className="text-sm text-anthracite-500 font-mono flex items-center gap-2">
                    <span className="bg-anthracite-50 w-fit px-2 py-0.5 rounded border border-anthracite-100">/{post.slug}</span>
                 </p>
               </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-700 hidden lg:block">Yayında</span>
              <button onClick={() => handleEdit(post)} className="text-primary-600 hover:bg-primary-100 px-4 py-2 rounded-lg font-medium text-sm transition">Düzenle</button>
              <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg font-medium text-sm transition">Sil</button>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-12 bg-anthracite-50 rounded-2xl border border-anthracite-100 border-dashed">
            <p className="text-anthracite-500 font-medium">Henüz panelde yazı bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
