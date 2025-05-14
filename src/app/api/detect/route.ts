// Route API xử lý việc nhận dạng văn bản
import { NextResponse } from "next/server";
import { detectText } from "@/lib/api";

// Hàm xử lý request POST đến endpoint /api/detect
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const image = body.image;
    const visionApiKey = process.env.VISION_API_KEY!;

    // Kiểm tra các trường bắt buộc
    if (!image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Gọi Vision API để nhận dạng chữ
    const detectedText = await detectText(image, visionApiKey);

    // Nếu không nhận dạng được chữ
    if (!detectedText) {
      return NextResponse.json(
        {
          text: "Không tìm thấy văn bản trong hình ảnh hoặc không nhận dạng được chữ.",
        },
        { status: 403 }
      );
    }

    // Trả về kết quả
    return NextResponse.json(
      {
        text: detectedText,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
