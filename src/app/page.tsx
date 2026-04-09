import Hero from "@/components/sections/Hero";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  let settings: Record<string, string> = {};
  
  try {
    const settingsDb = await prisma.setting.findMany();
    settings = settingsDb.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as Record<string, string>);
  } catch (error: any) {
    console.error("Home sayfasında veritabanı hatası:", error);
    // Hata durumunda varsayılan boş settings ile devam et
  }

  return (
    <main className="min-h-screen">
      <Hero settings={settings} />
    </main>
  );
}
