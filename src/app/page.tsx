import Hero from "@/components/sections/Hero";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const settingsDb = await prisma.setting.findMany();
  const settings = settingsDb.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as Record<string, string>);

  return (
    <main className="min-h-screen">
      <Hero settings={settings} />
    </main>
  );
}
