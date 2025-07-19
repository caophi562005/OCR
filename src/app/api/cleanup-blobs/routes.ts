import { list, del } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Lấy danh sách tất cả blobs
    const { blobs } = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const urlsToDelete = blobs.map((blob) => blob.url);
    await del(urlsToDelete, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Lọc blobs cũ hơn 30 ngày (thay đổi theo nhu cầu)
    // const thirtyDaysAgo = new Date();
    // thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // const oldBlobs = blobs.filter(
    //   (blob) => new Date(blob.uploadedAt) < thirtyDaysAgo
    // );

    // // Xóa blobs cũ (nếu có)
    // if (oldBlobs.length > 0) {
    //   const urlsToDelete = oldBlobs.map((blob) => blob.url);
    //   await del(urlsToDelete, {
    //     token: process.env.BLOB_READ_WRITE_TOKEN,
    //   });
    //   console.log(`Đã xóa ${oldBlobs.length} file cũ.`);
    // } else {
    //   console.log("Không có file cũ để xóa.");
    // }

    return NextResponse.json({ message: "Cleanup hoàn tất." });
  } catch (error) {
    console.error("Lỗi khi cleanup:", error);
    return NextResponse.json({ error: "Lỗi cleanup." }, { status: 500 });
  }
}
