import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await prisma.setting.findMany();
  const result: Record<string, string> = {};
  settings.forEach((s: { key: string, value: string }) => result[s.key] = s.value);
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const data = await req.json();
  const { key, value } = data;
  
  if (!key || !value) return NextResponse.json({ error: "Missing key or value" }, { status: 400 });

  const setting = await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  return NextResponse.json(setting);
}
