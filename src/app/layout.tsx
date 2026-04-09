import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import Navbar from "@/components/layout/Navbar";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diyetisyen | Profesyonel Beslenme Danışmanlığı",
  description: "Bireysel beslenme danışmanlığı ile daha sağlıklı bir yaşama adım atın. Online ve yüz yüze görüşme imkanı.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Uzman Diyetisyen",
  "jobTitle": "Diyetisyen",
  "url": "https://yourwebsite.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${outfit.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col selection:bg-primary-200 selection:text-anthracite-900">
        <CustomCursor />
        <Navbar />
        <div className="pt-24 flex-grow flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
