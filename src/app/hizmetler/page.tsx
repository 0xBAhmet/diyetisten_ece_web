import type { Metadata } from "next";
import { Coffee, Apple, Users, Salad } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hizmetler | Diyetisyen",
  description: "Online diyet, kurumsal beslenme danışmanlığı ve diğer diyetisyenlik hizmetlerimiz.",
};

const services = [
  {
    icon: <Apple size={32} />,
    title: "Kilo Alma / Verme",
    description: "Sağlıklı ve sürdürülebilir bir şekilde ideal kilonuza ulaşmanız için tamamen size özel, laboratuvar bulgularına dayalı beslenme programları.",
  },
  {
    icon: <Salad size={32} />,
    title: "Hastalıklarda Beslenme",
    description: "Diyabet, insülin direnci, tiroid veya sindirim sistemi hastalıkları gibi durumlarda hastalığın seyrini iyileştiren tıbbi beslenme tedavisi.",
  },
  {
    icon: <Coffee size={32} />,
    title: "Sporcu Beslenmesi",
    description: "Antrenman performansını artırmak ve kas toparlanmasını desteklemek için profesyonel veya amatör sporculara özel beslenme planları.",
  },
  {
    icon: <Users size={32} />,
    title: "Kurumsal Danışmanlık",
    description: "Şirket çalışanlarının motivasyonunu ve verimliliğini artırmak amacıyla düzenlenen kurum içi eğitimler ve menü planlama danışmanlığı.",
  }
];

export default function ServicesPage() {
  return (
    <main className="container mx-auto px-6 py-12 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-anthracite-900 mb-6">Hizmetlerimiz</h1>
        <p className="text-lg text-anthracite-600">
          Her bedenin ve yaşam tarzının gereksinimleri farklıdır. Size en uygun çözümü bulmak için geniş bir yelpazede, bilimsel temelli hizmetler sunuyoruz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        {services.map((service, idx) => (
          <div key={idx} className="group p-8 bg-white border border-anthracite-100 rounded-3xl shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {service.icon}
            </div>
            <h3 className="text-2xl font-bold text-anthracite-900 mb-4">{service.title}</h3>
            <p className="text-anthracite-600 leading-relaxed mb-8">{service.description}</p>
            <Link href="/iletisim" className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center gap-2 group/link">
              Detaylı Bilgi Al 
              <span className="group-hover/link:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
