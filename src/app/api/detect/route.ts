// Route API xử lý việc nhận dạng văn bản
import { NextResponse } from "next/server";
import { detectChineseText, formatWithPerplexityAI } from "@/lib/api";
import { convertUrlToBase64 } from "@/lib/utils";

// Hàm xử lý request POST đến endpoint /api/detect
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl } = body;
    const visionApiKey = process.env.VISION_API_KEY!;
    const perplexityApiKey = process.env.PERPLEXITY_API_KEY!;

    // Kiểm tra các trường bắt buộc
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Chuyển url ảnh thành base64
    const base64Image: any = await convertUrlToBase64(imageUrl);

    // Gọi Vision API để nhận dạng chữ
    const detectedText = await detectChineseText(base64Image, visionApiKey);

    // Nếu không nhận dạng được chữ
    if (!detectedText) {
      return NextResponse.json(
        {
          rawText:
            "Không tìm thấy văn bản trong hình ảnh hoặc không nhận dạng được chữ.",
          formattedText: null,
        },
        { status: 403 }
      );
    }

    let formattedText = null;

    if (perplexityApiKey) {
      try {
        const formattingResult = await formatWithPerplexityAI(
          detectedText,
          perplexityApiKey
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
        formattedText: formattedText,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "ERROR 500" }, { status: 500 });
  }
}
