"use client";

import { useEffect, useState } from "react";
import { Save, MailOpen, Trash2, MapPin, Phone, Mail, Clock, CheckCircle, RefreshCw } from "lucide-react";

export default function AdminContactPage() {
  const [activeTab, setActiveTab] = useState<"inbox" | "settings">("inbox");
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  
  // Settings States
  const [settings, setSettings] = useState({
    contact_phone: "",
    contact_email: "",
    contact_address: "",
    contact_map_url: "",
    contact_hours_week: "",
    contact_hours_weekend: ""
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [socialLinks, setSocialLinks] = useState<{ id: string, platform: string, url: string }[]>([]);

  // Veri Çekme
  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch("/api/messages");
      if (res.ok) setMessages(await res.json());
    } catch (e) {
      console.error(e);
    }
    setLoadingMessages(false);
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data }));
        if (data.social_media_links) {
          try { setSocialLinks(JSON.parse(data.social_media_links)); } catch {}
        }
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchMessages();
    fetchSettings();
  }, []);

  // Mesaj İşlemleri
  const markAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return; // Zaten okundu
    try {
      await fetch(`/api/messages?id=${id}`, { method: "PATCH" });
      setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
    } catch (e) { console.error(e); }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Bu mesajı kalıcı olarak silmek istiyor musunuz?")) return;
    try {
      const res = await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
      if (res.ok) setMessages(messages.filter(m => m.id !== id));
    } catch (e) { console.error(e); }
  };

  // Ayar İşlemleri
  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      const payload = { ...settings, social_media_links: JSON.stringify(socialLinks) };
      const promises = Object.entries(payload).map(([key, value]) => 
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value })
        })
      );
      await Promise.all(promises);
      alert("Tüm iletişim ayarları ve sosyal medya hesapları başarıyla kaydedildi!");
    } catch (error) {
      alert("Ayarlar kaydedilirken hata oluştu.");
    }
    setSavingSettings(false);
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="flex flex-col gap-8 pb-24">
      <div>
        <h1 className="text-3xl font-bold text-anthracite-900 mb-2">İletişim & Gelen Kutusu</h1>
        <p className="text-anthracite-600">Sitenizden gelen form mesajlarını okuyun ve iletişim bilgilerinizi güncelleyin.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-anthracite-200">
        <button 
          onClick={() => setActiveTab("inbox")}
          className={`pb-4 px-4 font-semibold text-lg border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'inbox' ? 'border-primary-600 text-primary-600' : 'border-transparent text-anthracite-500 hover:text-anthracite-800'}`}
        >
          Gelen Kutusu
          {unreadCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount} Yeni</span>}
        </button>
        <button 
          onClick={() => setActiveTab("settings")}
          className={`pb-4 px-4 font-semibold text-lg border-b-2 transition-colors ${activeTab === 'settings' ? 'border-primary-600 text-primary-600' : 'border-transparent text-anthracite-500 hover:text-anthracite-800'}`}
        >
          İletişim Ayarları
        </button>
      </div>

      {/* INBOX TAB */}
      {activeTab === "inbox" && (
        <div className="flex flex-col gap-4">
           {loadingMessages ? (
             <div className="text-center py-12 text-anthracite-500">Yükleniyor...</div>
           ) : messages.length === 0 ? (
             <div className="bg-white rounded-3xl p-12 text-center border border-anthracite-100 shadow-sm">
                <MailOpen size={48} className="mx-auto text-primary-200 mb-4" />
                <h3 className="text-xl font-bold text-anthracite-900 mb-2">Gelen Kutunuz Boş</h3>
                <p className="text-anthracite-500">Henüz web sitesi üzerinden gönderilen bir form mesajı bulunmuyor.</p>
             </div>
           ) : (
             messages.map((msg) => (
                <div key={msg.id} onClick={() => markAsRead(msg.id, msg.isRead)} className={`bg-white p-6 rounded-2xl border ${!msg.isRead ? 'border-primary-300 shadow-md bg-primary-50/20 cursor-pointer hover:bg-primary-50/50' : 'border-anthracite-100 shadow-sm'} transition-all relative flex flex-col gap-4`}>
                   {!msg.isRead && <div className="absolute top-6 right-6 w-3 h-3 bg-red-500 rounded-full animate-pulse" title="Okunmadı" />}
                   
                   <div className="flex items-start justify-between pr-8 border-b border-anthracite-100 pb-4">
                     <div>
                       <h3 className="font-bold text-lg text-anthracite-900">{msg.name} {msg.surname}</h3>
                       <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-anthracite-600 mt-1">
                          <span className="flex items-center gap-1.5"><Mail size={14}/> {msg.email}</span>
                          {msg.phone && <span className="flex items-center gap-1.5"><Phone size={14}/> {msg.phone}</span>}
                          <span className="text-xs ml-2 px-2 py-1 bg-anthracite-100 rounded-lg">{new Date(msg.createdAt).toLocaleString('tr-TR')}</span>
                       </div>
                     </div>
                   </div>

                   <div>
                     <p className="text-sm font-bold text-anthracite-900 mb-2">Konu: <span className="font-medium text-primary-700 bg-primary-50 px-2 py-1 rounded">{msg.subject || 'Belirtilmedi'}</span></p>
                     <p className="text-anthracite-700 whitespace-pre-wrap bg-anthracite-50 p-4 rounded-xl border border-anthracite-100 leading-relaxed">
                        {msg.message}
                     </p>
                   </div>

                   <div className="flex justify-end pt-2">
                     <button onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }} className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                       <Trash2 size={16} /> Kalıcı Olarak Sil
                     </button>
                   </div>
                </div>
             ))
           )}
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === "settings" && (
        <div className="bg-white border border-anthracite-100 p-8 rounded-3xl shadow-sm flex flex-col gap-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="flex flex-col gap-6">
                <h3 className="text-lg font-bold text-anthracite-900 flex items-center gap-2 border-b border-anthracite-100 pb-2"><Phone className="text-primary-600" size={20}/> Temel Bilgiler</h3>
                <div>
                  <label className="text-sm font-semibold text-anthracite-600 block mb-2">Telefon Numarası</label>
                  <input value={settings.contact_phone} onChange={e => handleSettingChange('contact_phone', e.target.value)} placeholder="+90 555 123 4567" className="w-full px-4 py-3 bg-anthracite-50 border border-anthracite-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-anthracite-600 block mb-2">E-Posta Adresi</label>
                  <input value={settings.contact_email} onChange={e => handleSettingChange('contact_email', e.target.value)} placeholder="merhaba@diyetisyen.com" className="w-full px-4 py-3 bg-anthracite-50 border border-anthracite-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:outline-none" />
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <h3 className="text-lg font-bold text-anthracite-900 flex items-center gap-2 border-b border-anthracite-100 pb-2"><Clock className="text-primary-600" size={20}/> Çalışma Saatleri</h3>
                <div>
                  <label className="text-sm font-semibold text-anthracite-600 block mb-2">Hafta İçi</label>
                  <input value={settings.contact_hours_week} onChange={e => handleSettingChange('contact_hours_week', e.target.value)} placeholder="09:00 - 18:00" className="w-full px-4 py-3 bg-anthracite-50 border border-anthracite-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-anthracite-600 block mb-2">Hafta Sonu (Cumartesi vb.)</label>
                  <input value={settings.contact_hours_weekend} onChange={e => handleSettingChange('contact_hours_weekend', e.target.value)} placeholder="10:00 - 14:00" className="w-full px-4 py-3 bg-anthracite-50 border border-anthracite-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:outline-none" />
                </div>
              </div>

           </div>

           <div className="flex flex-col gap-6 mt-4 pt-8 border-t border-anthracite-100">
             <h3 className="text-lg font-bold text-anthracite-900 flex items-center gap-2 border-b border-anthracite-100 pb-2"><MapPin className="text-primary-600" size={20}/> Adres ve Harita</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <label className="text-sm font-semibold text-anthracite-600 block mb-2">Klinik Açık Adresi</label>
                  <textarea value={settings.contact_address} onChange={e => handleSettingChange('contact_address', e.target.value)} placeholder="Örn: Levent Mahallesi, Büyükdere Caddesi..." className="w-full min-h-[140px] px-4 py-3 bg-anthracite-50 border border-anthracite-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:outline-none resize-y" />
               </div>
               <div>
                  <label className="text-sm font-semibold text-anthracite-600 block mb-2">Google Maps Linki <span className="text-xs font-normal text-anthracite-400 ml-2">(Yol Tarifi Al butonu için)</span></label>
                  <input value={settings.contact_map_url} onChange={e => handleSettingChange('contact_map_url', e.target.value)} placeholder="https://maps.google.com/..." className="w-full px-4 py-3 bg-anthracite-50 border border-anthracite-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:outline-none mb-4" />
                  <p className="text-xs text-anthracite-500 leading-relaxed bg-primary-50 p-4 border border-primary-100 rounded-lg">
                    <strong>Hızlı İpucu:</strong> İşletmenizi Google Haritalar&apos;da açın, Paylaş butonuna basıp linki kopyalayın ve buraya yapıştırın. Ziyaretçileriniz tek tıkla navigasyon başlatabilir.
                  </p>
               </div>
             </div>
           </div>

           <div className="flex flex-col gap-6 mt-4 pt-8 border-t border-anthracite-100">
             <h3 className="text-lg font-bold text-anthracite-900 flex items-center gap-2 border-b border-anthracite-100 pb-2">
               <svg className="text-primary-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
               Sosyal Medya Hesapları
             </h3>
             <div className="flex flex-col gap-4">
                {socialLinks.map((link, idx) => (
                  <div key={link.id} className="flex flex-wrap md:flex-nowrap items-center gap-4 bg-anthracite-50 p-4 rounded-xl border border-anthracite-100">
                    <select 
                      value={link.platform} 
                      onChange={e => {
                        const newLinks = [...socialLinks];
                        newLinks[idx].platform = e.target.value;
                        setSocialLinks(newLinks);
                      }}
                      className="w-full md:w-1/3 px-4 py-3 bg-white border border-anthracite-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:outline-none"
                    >
                       <option value="instagram">Instagram</option>
                       <option value="x">X (Twitter)</option>
                       <option value="linkedin">LinkedIn</option>
                       <option value="youtube">YouTube</option>
                       <option value="facebook">Facebook</option>
                    </select>
                    <input 
                      value={link.url}
                      onChange={e => {
                        const newLinks = [...socialLinks];
                        newLinks[idx].url = e.target.value;
                        setSocialLinks(newLinks);
                      }}
                      placeholder="https://..."
                      className="w-full md:w-2/3 px-4 py-3 bg-white border border-anthracite-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:outline-none"
                    />
                    <button 
                      onClick={() => setSocialLinks(socialLinks.filter(l => l.id !== link.id))}
                      className="p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100" title="Sil"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => setSocialLinks([...socialLinks, { id: Date.now().toString(), platform: "instagram", url: "" }])}
                  className="mt-2 px-6 py-4 border-2 border-dashed border-anthracite-200 text-anthracite-600 rounded-xl font-medium hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
                >
                   + Yeni Sosyal Medya Hesabı Ekle
                </button>
             </div>
           </div>

           <div className="flex justify-end pt-6 border-t border-anthracite-100">
              <button disabled={savingSettings} onClick={saveSettings} className="px-8 py-3 bg-primary-600 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-primary-700 transition disabled:opacity-50">
                {savingSettings ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
                {savingSettings ? "Kaydediliyor..." : "Ayarları Kaydet"}
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
