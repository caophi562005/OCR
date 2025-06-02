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

export async function detectText(base64Image: string, visionApiKey: string) {
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
  return `Dưới đây là một văn bản tiếng Trung được nhận dạng từ hình ảnh bằng OCR. 
    Hãy kiểm tra và sửa lại định dạng xuống dòng, đồng thời loại bỏ các ký tự nhiễu không liên quan.
    
    Nhiệm vụ cụ thể:
    1. Dòng đầu tiên là tiêu đề của văn bản , không xoá hay chỉnh sửa bất kì ở dòng đó.
    2. Tìm các câu hoặc đoạn đã bị ngắt dòng không đúng vị trí.
    3. Đặt xuống dòng ở những vị trí phù hợp theo ngữ nghĩa của văn bản.
    4. Nếu có các đoạn văn, hãy tách thành các đoạn riêng biệt.
    5. Loại bỏ các mã hoặc ký tự không phải tiếng Trung như "VxI", "12VXI", "12VXM", "1zvxd", "1zx", v.v. 
    6. Giữ nguyên nội dung chính, không thay đổi hoặc thêm bớt từ nào trong văn bản gốc.
    
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
