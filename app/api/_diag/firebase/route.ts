import { NextResponse } from "next/server";
import { firebaseBucket, getFirebaseUploadAndPublicUrls } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const bucket = firebaseBucket().name;
    const { uploadUrl, publicUrl } = await getFirebaseUploadAndPublicUrls(
      `diagnostic/${Date.now()}.png`,
      "image/png"
    );
    return NextResponse.json({ ok: true, bucket, sample: { uploadUrl, publicUrl } });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}
