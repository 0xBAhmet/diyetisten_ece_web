"use client";

import { motion } from "framer-motion";
import { ArrowRight, Activity, Apple, HeartPulse } from "lucide-react";
import Link from "next/link";

export default function Hero({ settings }: { settings: Record<string, string> }) {
  const headline = settings.hero_headline || "Bedeninize\nİyi Bakmanın\nTam Zamanı.";
  const subheadline = settings.hero_subheadline || "Sağlıklı beslenmeyi bir diyet değil, yaşam tarzı haline getirin. Size özel beslenme programları ile hedeflerinize kalıcı olarak ulaşın.";
  const heroCover = settings.hero_cover || null;

  return (
    <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary-200/20 blur-3xl" />
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary-300/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-anthracite-900 tracking-tight leading-[1.1] whitespace-pre-line">
              {headline}
            </h1>
            <p className="text-lg md:text-xl text-anthracite-600 max-w-xl leading-relaxed whitespace-pre-line">
              {subheadline}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4">
              <Link href="/iletisim" className="group px-8 py-4 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-all flex items-center gap-2 hover:shadow-lg hover:shadow-primary-600/30">
                Randevu Al
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/hizmetler" className="px-8 py-4 bg-white text-anthracite-800 rounded-full font-medium border border-anthracite-200 hover:border-anthracite-400 hover:bg-anthracite-50 transition-all">
                Hizmetlerimizi İncele
              </Link>
            </div>

            {/* Micro Features */}
            <div className="flex items-center gap-8 mt-8 pt-8 border-t border-anthracite-100">
              <div className="flex flex-col gap-2">
                <Activity className="text-primary-500" size={24} />
                <span className="font-semibold text-anthracite-800">Kişiye Özel</span>
                <span className="text-sm text-anthracite-500">Analiz ve planlama</span>
              </div>
              <div className="flex flex-col gap-2">
                <Apple className="text-primary-500" size={24} />
                <span className="font-semibold text-anthracite-800">Sürdürülebilir</span>
                <span className="text-sm text-anthracite-500">Kalıcı sonuçlar</span>
              </div>
              <div className="flex flex-col gap-2">
                <HeartPulse className="text-primary-500" size={24} />
                <span className="font-semibold text-anthracite-800">Sağlıklı</span>
                <span className="text-sm text-anthracite-500">Yaşam tarzı</span>
              </div>
            </div>
          </motion.div>

          {/* Visual Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative hidden lg:block h-[600px] w-full"
          >
            {/* Main Image from DB */}
            <div className="absolute inset-0 bg-anthracite-100 rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100/40 to-primary-300/40 mix-blend-multiply z-10 pointer-events-none" />
              {heroCover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={heroCover} alt="Uzman Diyetisyen" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-anthracite-400 bg-anthracite-200">
                  <span className="text-lg">[Diyetisyen Kapak Görseli Yükleyin]</span>
                </div>
              )}
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-anthracite-100 flex items-center gap-4 z-20"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl">
                +1K
              </div>
              <div>
                <p className="font-bold text-anthracite-900">Mutlu Danışan</p>
                <p className="text-sm text-anthracite-500">Başarı hikayesi</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
