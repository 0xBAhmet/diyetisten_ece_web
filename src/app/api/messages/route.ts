import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// YENİ MESAJ OLUŞTUR (İletişim Formundan)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, surname, email, phone, subject, message } = body;

    if (!name || !surname || !email || !message) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
    }

    const newMessage = await prisma.message.create({
      data: { name, surname, email, phone, subject, message },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Message create error:", error);
    return NextResponse.json({ error: "Mesaj gönderilemedi." }, { status: 500 });
  }
}

// MESAJLARI GETİR (Admin Panel)
export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Mesajlar getirilemedi." }, { status: 500 });
  }
}

// MESAJ OKUNDU OLARAK İŞARETLE VEYA SİL
export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID eksik" }, { status: 400 });

    const updated = await prisma.message.update({
      where: { id },
      data: { isRead: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID eksik" }, { status: 400 });

    await prisma.message.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Silme işlemi başarısız" }, { status: 500 });
  }
}
