// Route API xử lý việc nhận dạng văn bản
import { NextResponse } from "next/server";
import { detectChineseText, formatWithGenerativeAI } from "@/lib/api";

// Hàm xử lý request POST đến endpoint /api/detect
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const image = body.image;
    const visionApiKey = process.env.VISION_API_KEY!;
    const genaiApiKey = process.env.GEMINI_API_KEY!;

    // Kiểm tra các trường bắt buộc
    if (!image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Gọi Vision API để nhận dạng chữ
    const detectedText = await detectChineseText(image, visionApiKey);

    // Nếu không nhận dạng được chữ
    if (!detectedText) {
      return NextResponse.json(
        {
          rawText: "Không tìm thấy văn bản",
          formattedText: null,
        },
        { status: 403 }
      );
    }

    let formattedText = null;

    if (genaiApiKey && body.isArrange) {
      try {
        const formattingResult = await formatWithGenerativeAI(
          detectedText,
          genaiApiKey
        );
        formattedText = formattingResult.formattedText;
      } catch (e: any) {
        console.log(e);
      }
    }

    // Trả về kết quả
    return NextResponse.json(
      {
        rawText: detectedText,
        formattedText: formattedText !== null ? formattedText : detectedText,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
