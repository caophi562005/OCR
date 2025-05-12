// Các hàm tiện ích để gọi API Google

// Hàm gọi Google Vision API để nhận dạng văn bản
export async function detectChineseText(
  base64Image: string,
  visionApiKey: string
) {
  const endpoint = "https://vision.googleapis.com/v1/images:annotate";

  const requestBody = {
    requests: [
      {
        image: {
          content: base64Image,
        },
        features: [
          {
            type: "TEXT_DETECTION",
            maxResults: 10,
          },
        ],
        imageContext: {
          languageHints: ["zh-CN", "zh-TW"], // Gợi ý tiếng Trung giản thể và phồn thể
        },
      },
    ],
  };

  try {
    const response = await fetch(`${endpoint}?key=${visionApiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Lỗi kết nối Vision API: " + response.status);
    }

    const data = await response.json();

    if (data.responses && data.responses[0].textAnnotations) {
      return data.responses[0].textAnnotations[0].description;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Vision API Error:", error);
    throw error;
  }
}

// Tạo prompt text cho mô hình ngôn ngữ
export function getPromptText(text: string) {
  return `Dưới đây là một văn bản được nhận dạng từ hình ảnh bằng OCR. 
    Hãy kiểm tra và sửa lại định dạng xuống dòng, đồng thời loại bỏ các ký tự nhiễu không liên quan.
    
    Nhiệm vụ cụ thể:
    1. Tìm các câu hoặc đoạn đã bị ngắt dòng không đúng vị trí.
    2. Đặt xuống dòng ở những vị trí phù hợp theo ngữ nghĩa của văn bản.
    3. Nếu có các đoạn văn, hãy tách thành các đoạn riêng biệt có ý nghĩa hoàn chỉnh.
    4. Sắp xếp lại trình tự các câu nếu cần thiết để đảm bảo nội dung hợp lý và mạch lạc.
    5. Giữ nguyên nội dung chính, không thay đổi hoặc thêm bớt từ nào trong văn bản gốc.
    
    Chỉ trả về văn bản đã định dạng và làm sạch, không thêm bất kỳ giải thích hay bình luận nào.
    
    Văn bản gốc:
    ${text}`;
}

// Hàm gọi Generative AI API để định dạng văn bản
export async function formatWithGenerativeAI(text: string, apiKey: string) {
  const endpoint =
    "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";
  const promptText = getPromptText(text);
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: promptText,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
  };

  try {
    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(
        `Lỗi kết nối API (${response.status}): ${response.statusText}`
      );
    }

    const data = await response.json();

    let formattedText = "";

    // Parse response dựa vào định dạng phản hồi của API
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      formattedText = data.candidates[0].content.parts[0].text;
    }

    return { formattedText };
  } catch (error: any) {
    // Cập nhật debug info với error
    console.error("Generative Language API Error:", error);
    throw { error };
  }
}
