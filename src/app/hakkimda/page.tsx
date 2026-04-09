import type { Metadata } from "next";
import { Award, BookOpen, Heart, Quote } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Hakkımda | Diyetisyen",
  description: "Uzman diyetisyenimizin profesyonel geçmişi ve vizyonu hakkında bilgi alın.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  let settings: Record<string, string> = {};
  
  try {
    const settingsDb = await prisma.setting.findMany();
    settings = settingsDb.reduce((acc: any, s: any) => ({ ...acc, [s.key]: s.value }), {} as Record<string, string>);
  } catch (error: any) {
    console.error("Hakkimda sayfasında veritabanı hatası:", error);
  }

  const aboutHeadline = settings.about_headline || "Sağlık için Bilim ve\nDoğayı Buluşturuyorum.";
  const aboutText = settings.about_text || "Merhaba! Ben, beslenme alışkanlıklarınızı kısıtlayıcı diyetlerle değil, size özel sürdürülebilir yöntemlerle iyileştirmeyi hedefleyen bir Uzman Diyetisyenim.\n\nYıllar süren eğitimim ve vaka tecrübelerimle, her bedenin farklı bir hikayesi olduğuna inanıyorum. Hedefimiz sadece yaza hazırlanmak değil, tüm bir ömrü enerjik ve mutlu geçirmek.";
  const aboutCover = settings.about_cover || null;

  return (
    <main className="container mx-auto px-6 py-12 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        {/* Image / Portrait side */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary-200/30 rounded-3xl -rotate-3 blur-sm scale-105" />
          <div className="aspect-[3/4] bg-anthracite-100 rounded-3xl overflow-hidden relative shadow-2xl flex items-center justify-center">
            {aboutCover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={aboutCover} alt="Diyetisyen Portre" className="w-full h-full object-cover" />
            ) : (
              <span className="text-anthracite-400 font-medium">[Diyetisyen Portresi Yükleyin]</span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-anthracite-900/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6">
              <Quote className="text-primary-300 mb-2" size={32} />
              <p className="text-white text-lg font-medium">
                "Sağlıklı yaşam bir varış noktası değil, keyifli bir yolculuktur."
              </p>
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="flex flex-col gap-8">
          <div>
            <div className="text-primary-600 font-semibold mb-2">Ben Kimim?</div>
            <h1 className="text-4xl md:text-5xl font-bold text-anthracite-900 mb-6 leading-tight whitespace-pre-line">
              {aboutHeadline}
            </h1>
            <div className="text-lg text-anthracite-600 leading-relaxed space-y-4 whitespace-pre-line">
              {aboutText}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-anthracite-100">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="font-bold text-anthracite-900 mb-1">Eğitim</h3>
                <p className="text-sm text-anthracite-500">Beslenme ve Diyetetik Lisans & Yüksek Lisans</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                <Award size={24} />
              </div>
              <div>
                <h3 className="font-bold text-anthracite-900 mb-1">Tecrübe</h3>
                <p className="text-sm text-anthracite-500">5+ Yıl Klinik ve Online Danışmanlık</p>
              </div>
            </div>
            
            <div className="flex gap-4 md:col-span-2">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                <Heart size={24} />
              </div>
              <div>
                <h3 className="font-bold text-anthracite-900 mb-1">Uzmanlık Alanlarım</h3>
                <p className="text-sm text-anthracite-500">Kilo Kontrolü, Sporcu Beslenmesi, Hastalıklarda Tıbbi Beslenme Tedavisi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
