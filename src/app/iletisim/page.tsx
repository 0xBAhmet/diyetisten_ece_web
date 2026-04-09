"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "", surname: "", email: "", phone: "", subject: "", message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => setSettings(data));
  }, []);

  const infoCards = [
    {
      icon: <Phone className="text-primary-600" size={28} />,
      title: "Telefon",
      details: settings.contact_phone || "Henüz Belirtilmedi",
      sub: "Bizi arayabilirsiniz",
    },
    {
      icon: <Mail className="text-primary-600" size={28} />,
      title: "E-Posta",
      details: settings.contact_email || "Henüz Belirtilmedi",
      sub: "7/24 mesaj bırakın",
    },
    {
      icon: <MapPin className="text-primary-600" size={28} />,
      title: "Klinik Adresi",
      details: settings.contact_address || "Henüz Belirtilmedi",
      sub: settings.contact_map_url ? (
        <a href={settings.contact_map_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Haritada Yol Tarifi Al</a>
      ) : "Google Haritalar linki yakında.",
    },
    {
      icon: <Clock className="text-primary-600" size={28} />,
      title: "Çalışma Saatleri",
      details: `Hafta İçi: ${settings.contact_hours_week || "-"}`,
      sub: `H. Sonu: ${settings.contact_hours_weekend || "-"}`,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");
    
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSuccessMsg("Mesajınız bize başarıyla ulaştı! En kısa sürede dönüş yapacağız.");
        setFormData({ name: "", surname: "", email: "", phone: "", subject: "", message: "" });
      } else {
        alert("Mesaj gönderilirken bir hata oluştu.");
      }
    } catch {
       alert("Bağlantı hatası.");
    }
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen pt-12 pb-24 bg-background">
      {/* Header Section */}
      <div className="container mx-auto px-6 mb-16 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-800 w-fit">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
            </span>
            <span className="text-sm font-medium">İletişime Geçin</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-anthracite-900 tracking-tight">
            Size Özel Bir Program <br />
            <span className="text-primary-600">İçin Hazır mısınız?</span>
          </h1>
          
          <p className="text-lg text-anthracite-600">
            Sağlıklı yaşam hedeflerinize ulaşmak, randevu almak veya aklınıza takılan soruları sormak için aşağıdaki formu doldurabilir veya doğrudan klinik adresimizden bize ulaşabilirsiniz.
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Left Column - Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {infoCards.map((card, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-anthracite-100 shadow-sm hover:border-primary-200 hover:shadow-md transition-all flex items-start gap-4 cursor-default">
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center shrink-0">
                    {card.icon}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-anthracite-900 text-lg">{card.title}</h3>
                    <p className="font-medium text-anthracite-700 mt-1 whitespace-pre-line">{card.details}</p>
                    <p className="text-sm text-anthracite-500 mt-1">{card.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media Links */}
            <div className="bg-anthracite-900 rounded-3xl p-8 text-white mt-auto">
              <h3 className="text-xl font-bold mb-6">Sosyal Medyadan Takip Edin</h3>
              <div className="flex gap-4 flex-wrap">
                {(() => {
                  let parsedLinks: {id: string, platform: string, url: string}[] = [];
                  try {
                     if (settings.social_media_links) parsedLinks = JSON.parse(settings.social_media_links);
                  } catch {}

                  if (parsedLinks.length === 0) {
                     return <p className="text-anthracite-400 text-sm">Henüz sosyal medya hesabı eklenmedi.</p>
                  }

                  const getIcon = (platform: string) => {
                    switch(platform) {
                      case "instagram": return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
                      case "x": return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
                      case "linkedin": return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
                      case "youtube": return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>;
                      case "facebook": return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
                      default: return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"/>;
                    }
                  }

                  return parsedLinks.map(link => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-anthracite-800 hover:bg-primary-600 flex items-center justify-center transition-colors shadow-sm cursor-pointer" title={link.platform}>
                      {getIcon(link.platform)}
                    </a>
                  ));
                })()}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-3 bg-white p-8 md:p-12 rounded-[2.5rem] border border-anthracite-100 shadow-xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-bl-full -z-0 opacity-50 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-bold text-anthracite-900 mb-2">Mesaj Gönderin</h2>
                <p className="text-anthracite-600">Formu doldurduğunuzda en kısa sürede size geri dönüş sağlayacağız.</p>
              </div>

              {successMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl font-medium">
                  {successMsg}
                </div>
              )}

              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-anthracite-700 ml-1">Adınız</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Ahmet" 
                      className="w-full px-5 py-4 bg-anthracite-50/50 border border-anthracite-200 text-anthracite-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow placeholder:text-anthracite-400"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-anthracite-700 ml-1">Soyadınız</label>
                    <input 
                      type="text" 
                      required
                      value={formData.surname} onChange={e => setFormData({...formData, surname: e.target.value})}
                      placeholder="Yılmaz" 
                      className="w-full px-5 py-4 bg-anthracite-50/50 border border-anthracite-200 text-anthracite-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow placeholder:text-anthracite-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-anthracite-700 ml-1">E-Posta Adresiniz</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="ahmet@example.com" 
                      className="w-full px-5 py-4 bg-anthracite-50/50 border border-anthracite-200 text-anthracite-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow placeholder:text-anthracite-400"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-anthracite-700 ml-1">Telefon Numaranız</label>
                    <input 
                      type="tel" 
                      value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="0555 123 45 67" 
                      className="w-full px-5 py-4 bg-anthracite-50/50 border border-anthracite-200 text-anthracite-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow placeholder:text-anthracite-400"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-anthracite-700 ml-1">Konu</label>
                  <select 
                    value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-5 py-4 bg-anthracite-50/50 border border-anthracite-200 text-anthracite-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow appearance-none"
                  >
                    <option value="">Lütfen Bir Konu Seçin</option>
                    <option value="Kilo Verme Programı">Kilo Verme Programı</option>
                    <option value="Kilo Alma Programı">Kilo Alma Programı</option>
                    <option value="Hastalıklarda Beslenme">Hastalıklarda Beslenme</option>
                    <option value="Sporcu Beslenmesi">Sporcu Beslenmesi</option>
                    <option value="Genel Soru">Diğer / Genel Soru</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-anthracite-700 ml-1">Mesajınız</label>
                  <textarea 
                    required
                    value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="Size nasıl yardımcı olabilirim?" 
                    className="w-full px-5 py-4 bg-anthracite-50/50 border border-anthracite-200 text-anthracite-900 rounded-2xl min-h-[160px] resize-y focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow placeholder:text-anthracite-400"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full flex items-center justify-center gap-3 px-8 py-5 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30 transition-all group disabled:opacity-50"
                >
                  {isSubmitting ? "Gönderiliyor..." : "Mesajı Gönder"}
                  {!isSubmitting && <Send className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />}
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
