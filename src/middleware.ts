import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Danh sách các origin được phép truy cập API
const allowedOrigins = [
  // Chrome extension origin pattern
  /^chrome-extension:\/\/[a-z]{32}$/,
  // Firefox extension origin pattern
  /^moz-extension:\/\/[a-f0-9\-]{36}$/,
  // Edge extension origin pattern
  /^extension:\/\/[a-z]{32}$/,
  // Safari extension origin pattern
  /^safari-extension:\/\/[a-z0-9\-]+$/,
  // Cho phép local development
  /^http:\/\/localhost:[0-9]+$/,
  // OCR domain
  /^https:\/\/ocr\.hacmieu\.xyz(\/.*)?$/,
];

// Function kiểm tra xem origin có được phép không
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  return allowedOrigins.some((pattern) => pattern.test(origin));
}

export function middleware(request: NextRequest) {
  // Chỉ áp dụng middleware cho các route API
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Lấy origin từ request header
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Kiểm tra origin hoặc referer
  if (
    (origin && isOriginAllowed(origin)) ||
    (referer &&
      allowedOrigins.some((pattern) => pattern.test(new URL(referer).origin)))
  ) {
    // Origin được phép, tạo response mới với CORS headers
    const response = NextResponse.next();

    // Thêm các CORS headers
    response.headers.set("Access-Control-Allow-Origin", origin || "*");
    response.headers.set("Access-Control-Allow-Methods", "POST");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");

    return response;
  }

  // Origin không được phép
  return new NextResponse(
    JSON.stringify({
      success: false,
      message: "Origin không được phép truy cập API",
    }),
    {
      status: 403,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

// Định nghĩa cho những route nào middleware này sẽ được áp dụng
export const config = {
  matcher: "/api/:path*",
};
