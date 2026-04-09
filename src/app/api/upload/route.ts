import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Convert file to Base64 to bypass Netlify Read-Only File System restriction
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/jpeg';
    
    // Create base64 Data URI
    const base64String = `data:${mimeType};base64,${buffer.toString('base64')}`;

    // Return the base64 string directly so it can be saved in the database
    return NextResponse.json({ success: true, url: base64String });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
