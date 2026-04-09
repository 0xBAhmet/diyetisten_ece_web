import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error: any) {
    console.error("Blog sayfasında veritabanı hatası:", error);
  }

  return (
    <main className="container mx-auto px-6 py-12 md:py-24 max-w-5xl min-h-[80vh]">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-anthracite-900 mb-6 tracking-tight">
          Sağlıklı Yaşam Blogu
        </h1>
        <p className="text-lg text-anthracite-600 max-w-2xl">
          Beslenme, diyet, sağlıklı tarifler ve mutlu bir yaşam için bilimsel verilere dayanan güncel yazılarımızı keşfedin.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="bg-anthracite-50 rounded-3xl p-12 text-center border border-anthracite-100 shadow-sm mt-12">
          <p className="text-anthracite-600 text-lg font-medium">Henüz bir yazı eklenmedi. Lütfen daha sonra tekrar uğrayın!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white border border-anthracite-100 shadow-sm rounded-3xl p-6 md:p-8 hover:shadow-xl hover:border-primary-200 transition-all flex flex-col h-full overflow-hidden relative">
              {post.coverImage && (
                <div className="w-full aspect-[16/9] mb-8 rounded-2xl overflow-hidden bg-anthracite-50 relative shrink-0 -mx-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              )}
              <div className="flex items-center gap-4 text-xs font-medium text-anthracite-500 mb-6 relative">
                 <span className="flex items-center gap-1.5 bg-anthracite-50 px-3 py-1.5 rounded-full border border-anthracite-100">
                   <Calendar size={14} className="text-primary-600" /> {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                 </span>
                 <span className="flex items-center gap-1.5 bg-anthracite-50 px-3 py-1.5 rounded-full border border-anthracite-100">
                   <Clock size={14} className="text-primary-600" /> {post.readingTime} dk okuma
                 </span>
              </div>
              <h2 className="text-2xl font-extrabold text-anthracite-900 mb-4 group-hover:text-primary-600 transition-colors line-clamp-3 leading-snug">
                {post.title}
              </h2>
              
              <div className="mt-auto pt-6 flex items-center text-primary-600 font-bold gap-2 group-hover:gap-3 transition-all">
                Yazıyı Oku <ArrowRight size={18} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
