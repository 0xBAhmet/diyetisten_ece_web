"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AdminContentManagement() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [isSavingTexts, setIsSavingTexts] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => {
        if (data) setSettings(data);
      })
      .catch();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(prev => ({ ...prev, [key]: true }));
    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      
      if (uploadData.success && uploadData.url) {
        await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value: uploadData.url }),
        });
        setSettings(prev => ({ ...prev, [key]: uploadData.url }));
        alert("Görsel başarıyla güncellendi!");
      } else {
        alert("Yükleme başarısız: " + uploadData.error);
      }
    } catch (err) {
      alert("Bir bağlantı hatası oluştu.");
    }
    setIsUploading(prev => ({ ...prev, [key]: false }));
  };

  const handleSaveTexts = async () => {
    setIsSavingTexts(true);
    const keysToSave = ["hero_headline", "hero_subheadline", "about_headline", "about_text"];
    try {
      for (const key of keysToSave) {
        if (settings[key] !== undefined) {
          await fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, value: settings[key] }),
          });
        }
      }
      alert("Metin içerikleri başarıyla kaydedildi!");
    } catch(err) {
      alert("Bağlantı hatası.");
    }
    setIsSavingTexts(false);
  };

  return (
    <div className="flex flex-col gap-12 pb-24">
      <div>
        <h1 className="text-3xl font-bold text-anthracite-900 mb-2">Site İçerik Yönetimi</h1>
        <p className="text-anthracite-600">Ana sayfa ve Hakkımda sayfasındaki görselleri ve yazıları buradan güncelleyin.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Texts Panel */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-anthracite-100 shadow-sm flex flex-col gap-6">
          <h2 className="text-xl font-bold text-anthracite-900 border-b border-anthracite-100 pb-4">Yazı İçerikleri</h2>
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-anthracite-600 mb-2">Ana Sayfa Büyük Başlık</label>
              <textarea 
                value={settings.hero_headline || ""} 
                onChange={(e) => handleChange("hero_headline", e.target.value)}
                placeholder="Bedeninize\nİyi Bakmanın\nTam Zamanı."
                className="w-full px-4 py-3 rounded-xl border border-anthracite-200 focus:outline-none focus:border-primary-400 min-h-[100px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-anthracite-600 mb-2">Ana Sayfa Alt Açıklama</label>
              <textarea 
                value={settings.hero_subheadline || ""} 
                onChange={(e) => handleChange("hero_subheadline", e.target.value)}
                placeholder="Sağlıklı beslenmeyi bir diyet değil yaşam tarzı haline getirin..."
                className="w-full px-4 py-3 rounded-xl border border-anthracite-200 focus:outline-none focus:border-primary-400 min-h-[100px]"
              />
            </div>
            
            <div className="w-full h-px bg-anthracite-100 my-4" />

            <div>
              <label className="block text-sm font-medium text-anthracite-600 mb-2">Hakkımda Büyük Başlık</label>
              <textarea 
                value={settings.about_headline || ""} 
                onChange={(e) => handleChange("about_headline", e.target.value)}
                placeholder="Sağlık için Bilim ve Doğayı Buluşturuyorum."
                className="w-full px-4 py-3 rounded-xl border border-anthracite-200 focus:outline-none focus:border-primary-400 min-h-[80px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-anthracite-600 mb-2">Hakkımda Uzun Yazı</label>
              <textarea 
                value={settings.about_text || ""} 
                onChange={(e) => handleChange("about_text", e.target.value)}
                placeholder="Merhaba! Ben..."
                className="w-full px-4 py-3 rounded-xl border border-anthracite-200 focus:outline-none focus:border-primary-400 min-h-[200px]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-anthracite-100 mt-2">
            <button 
              onClick={handleSaveTexts}
              disabled={isSavingTexts}
              className="w-full px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition duration-200"
            >
              {isSavingTexts ? "Kaydediliyor..." : "Tüm Yazıları Kaydet"}
            </button>
          </div>
        </div>

        {/* Media Panel */}
        <div className="flex flex-col gap-8">
          
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-anthracite-100 shadow-sm flex flex-col gap-6">
            <h2 className="text-xl font-bold text-anthracite-900 border-b border-anthracite-100 pb-4">Ana Sayfa Kapak Görseli</h2>
            <div className="w-full aspect-[4/3] rounded-2xl bg-anthracite-100 border border-anthracite-200 overflow-hidden flex items-center justify-center relative">
              {settings.hero_cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={settings.hero_cover} alt="Hero" className="w-full h-full object-cover" />
              ) : (
                <span className="text-anthracite-400 font-medium text-sm">Görsel Yüklenmemiş</span>
              )}
            </div>
            <label className="block w-full text-center px-6 py-4 border-2 border-dashed border-primary-300 bg-primary-50 text-primary-700 rounded-xl cursor-pointer hover:bg-primary-100 transition-colors font-medium">
              {isUploading["hero_cover"] ? "Yükleniyor..." : "Görsel Seç ve Değiştir"}
              <input type="file" accept="image/*" className="hidden" 
                onChange={(e) => handleUpload(e, "hero_cover")} disabled={isUploading["hero_cover"]} />
            </label>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-anthracite-100 shadow-sm flex flex-col gap-6">
            <h2 className="text-xl font-bold text-anthracite-900 border-b border-anthracite-100 pb-4">Hakkımda Portre Görseli</h2>
            <div className="w-full aspect-[3/4] rounded-2xl bg-anthracite-100 border border-anthracite-200 overflow-hidden flex items-center justify-center relative max-w-[300px] mx-auto">
              {settings.about_cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={settings.about_cover} alt="About" className="w-full h-full object-cover" />
              ) : (
                <span className="text-anthracite-400 font-medium text-sm">Portre Yüklenmemiş</span>
              )}
            </div>
            <label className="block w-full text-center px-6 py-4 border-2 border-dashed border-primary-300 bg-primary-50 text-primary-700 rounded-xl cursor-pointer hover:bg-primary-100 transition-colors font-medium">
              {isUploading["about_cover"] ? "Yükleniyor..." : "Portre Seç ve Değiştir"}
              <input type="file" accept="image/*" className="hidden" 
                onChange={(e) => handleUpload(e, "about_cover")} disabled={isUploading["about_cover"]} />
            </label>
          </div>

        </div>

      </div>
    </div>
  );
}
