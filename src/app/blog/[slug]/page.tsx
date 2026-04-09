import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import type { Metadata } from 'next';

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({ where: { slug: resolvedParams.slug } });
  if (!post) return { title: "Bulunamadı" };
  return { title: `${post.title} | Uzman Diyetisyen` };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug; 
  
  const post = await prisma.post.findUnique({
    where: { slug: slug },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="container mx-auto px-6 py-12 md:py-24 max-w-4xl min-h-[90vh]">
      <Link href="/blog" className="inline-flex items-center gap-2 text-anthracite-500 hover:text-primary-600 border border-transparent hover:border-primary-100 hover:bg-primary-50 px-4 py-2 rounded-xl font-medium mb-12 transition-all">
        <ArrowLeft size={18} /> Bloglara Dön
      </Link>
      
      <header className="mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-anthracite-900 leading-[1.15] mb-8">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-anthracite-600">
           <span className="flex items-center gap-2 bg-anthracite-50 border border-anthracite-100 px-4 py-2 rounded-xl"><Calendar size={16} className="text-primary-500" /> {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric'})}</span>
           <span className="flex items-center gap-2 bg-anthracite-50 border border-anthracite-100 px-4 py-2 rounded-xl"><Clock size={16} className="text-primary-500" /> {post.readingTime} Dakika Okuma</span>
           <span className="flex items-center gap-2 bg-anthracite-50 border border-anthracite-100 px-4 py-2 rounded-xl"><User size={16} className="text-primary-500" /> Uzman Diyetisyen</span>
        </div>
      </header>

      {post.coverImage && (
        <div className="w-full aspect-[21/9] bg-anthracite-100 rounded-3xl overflow-hidden mb-16 shadow-inner relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Tiptap content rendering using Tailwind Typography */}
      <article 
        className="prose prose-lg sm:prose-xl max-w-none prose-headings:text-anthracite-900 prose-headings:font-bold prose-p:text-anthracite-700 prose-p:leading-relaxed prose-a:text-primary-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-li:text-anthracite-700 prose-strong:text-anthracite-900 pb-24"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </main>
  );
}
