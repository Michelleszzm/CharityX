// app/api/proxy/[platform]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ platform: string }> }) {
  try {
    const { platform } = await params;
    console.log(`??${platform}??`)

    // const res = await fetch(`https://backend.example.com/platform/${params.platform}`, {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}customer/donors/config`, {
      method: "GET",
      headers: {
        "site": platform
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch backend" }, { status: 500 });
  }
}
