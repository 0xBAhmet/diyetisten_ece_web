import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel Ayarları",
};

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-anthracite-900 mb-2">Panel Ayarları</h1>
        <p className="text-anthracite-600">Site tercihleri ve yönetici ayarları bu sayfadan yönetilir.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-anthracite-100 shadow-sm flex flex-col gap-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold text-anthracite-900 border-b border-anthracite-100 pb-4">Yönetici Şifresi</h2>
        <p className="text-anthracite-500 text-sm">Şu anki yönetici şifreniz, sunucu tarafından sağlanan yüksek güvenlikli varsayılan şifre olarak kilitli durumdadır. Gelişmiş panel fonksiyonlarında şifre yenileme özelliği eklenecektir.</p>
        <button disabled className="px-6 py-3 bg-anthracite-100 text-anthracite-400 font-medium rounded-xl cursor-not-allowed w-fit mt-2">
          Şifre Değiştir (Yakında)
        </button>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-anthracite-100 shadow-sm flex flex-col gap-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold text-anthracite-900 border-b border-anthracite-100 pb-4">Sistem Durumu</h2>
        <div className="flex flex-col gap-3">
           <div className="flex justify-between items-center bg-anthracite-50 p-4 rounded-xl border border-anthracite-100">
              <span className="font-medium text-anthracite-700">Next.js Versiyonu</span>
              <span className="text-sm font-bold font-mono text-primary-600">v16.2.2</span>
           </div>
           <div className="flex justify-between items-center bg-anthracite-50 p-4 rounded-xl border border-anthracite-100">
              <span className="font-medium text-anthracite-700">Veritabanı (Prisma)</span>
              <span className="text-sm font-bold font-mono text-green-600">Aktif (SQLite Native)</span>
           </div>
           <div className="flex justify-between items-center bg-anthracite-50 p-4 rounded-xl border border-anthracite-100">
              <span className="font-medium text-anthracite-700">Kalkan & Proxy Yönlendirmesi</span>
              <span className="text-sm font-bold font-mono text-green-600">Devrede</span>
           </div>
        </div>
      </div>
    </div>
  );
}
