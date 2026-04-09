import Link from "next/link";
import { LayoutDashboard, PenTool, Image as ImageIcon, Settings, Mail } from "lucide-react";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-anthracite-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-anthracite-100 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-anthracite-100">
          <h2 className="text-xl font-bold tracking-tight text-anthracite-900">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-anthracite-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-colors font-medium">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/blog" className="flex items-center gap-3 px-4 py-3 text-anthracite-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-colors font-medium">
            <PenTool size={20} /> Blog Yönetimi
          </Link>
          <Link href="/admin/homepage" className="flex items-center gap-3 px-4 py-3 text-anthracite-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-colors font-medium">
            <ImageIcon size={20} /> Ana Sayfa Görseller
          </Link>
          <Link href="/admin/iletisim" className="flex items-center gap-3 px-4 py-3 text-anthracite-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-colors font-medium">
            <Mail size={20} /> İletişim & Gelen Kutusu
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-anthracite-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-colors font-medium">
            <Settings size={20} /> Ayarlar
          </Link>
        </nav>
        <div className="p-4 border-t border-anthracite-100">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full">
        {/* We add high z-index header here if needed for mobile */}
        <div className="p-6 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
