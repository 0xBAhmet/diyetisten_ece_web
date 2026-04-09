import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    
    // Şifre .env dosyasındaki ADMIN_PASSWORD değişkeninden okunur
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ success: false, error: "Sunucu hatası: şifre tanımlanmamış." }, { status: 500 });
    }
    if (password === adminPassword) {
      const cookieStore = await cookies();
      cookieStore.set("admin_token", "authenticated", { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 hafta
        path: "/",
      });
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, error: "Hatalı şifre!" }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "İstek işlenemedi." }, { status: 500 });
  }
}
