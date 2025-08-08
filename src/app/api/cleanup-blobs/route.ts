import { list, del } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const { blobs } = await list({ token });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const oldBlobs = blobs.filter(
      (blob) => new Date(blob.uploadedAt) < sevenDaysAgo
    );

    if (oldBlobs.length > 0) {
      await del(
        oldBlobs.map((blob) => blob.url),
        { token }
      );
    }

    return NextResponse.json({ deleted: oldBlobs.length });
  } catch (error) {
    console.error("Lỗi khi cleanup:", error);
    return NextResponse.json({ error: "Lỗi cleanup." }, { status: 500 });
  }
}
