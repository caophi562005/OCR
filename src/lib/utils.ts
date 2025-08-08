import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import https from "node:https";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const copyText = async (text: string) => {
  await navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success("Sao chép thành công");
    })
    .catch((err) => {
      toast.error("Sao chép không thành công : ", err);
    });
};

export const downloadText = (data: ModalData) => {
  try {
    // Tạo một đối tượng Blob với nội dung văn bản
    const blob = new Blob([data?.text!], {
      type: "text/plain;charset=utf-8",
    });

    // Tạo URL cho blob
    const url = URL.createObjectURL(blob);

    // Tạo thẻ a ẩn để tải xuống
    const link = document.createElement("a");
    link.href = url;

    //lấy dòng đầu tiên tức số chương là tên file
    const firstLine = data?.text.split("\n")[0].trim()!;
    const safeFileName =
      firstLine.replace(/[\\/:*?"<>|]/g, "_").substring(0, 100) + ".txt";

    // Đảm bảo fileName dự phòng luôn có đuôi .txt
    const fileName = data?.name.replace(/\.[^/.]+$/, "") + ".txt";

    link.download = safeFileName || fileName;

    // Thêm vào DOM, kích hoạt sự kiện click và xóa
    document.body.appendChild(link);
    link.click();
    toast.success("Tải xuống thành công");

    // Dọn dẹp
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error: any) {
    toast.error("Tải xuống thất bại : ", error);
  }
};

export const downloadMultipleTextsAsZip = async (dataArray: ModalData[]) => {
  try {
    // Nhập thư viện JSZip
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    // Thêm các file vào zip
    dataArray.forEach((data) => {
      if (!data?.text) return;

      // Lấy tên file từ dòng đầu tiên hoặc từ data.name
      const firstLine = data.text.split("\n")[0].trim();
      const safeFileName = firstLine
        ? firstLine.replace(/[\\/:*?"<>|]/g, "_").substring(0, 100) + ".txt"
        : data.name.replace(/\.[^/.]+$/, "") + ".txt";

      // Thêm text trực tiếp vào zip
      zip.file(safeFileName, data.text);
    });

    // Tạo và tải xuống zip
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const zipUrl = URL.createObjectURL(zipBlob);

    // Tạo thẻ a để tải xuống
    const link = document.createElement("a");
    link.href = zipUrl;
    link.download = "novel.zip";

    // Thêm vào DOM, kích hoạt sự kiện click và xóa
    document.body.appendChild(link);
    link.click();
    toast.success("Tải xuống folder zip thành công");

    // Dọn dẹp
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);
    }, 100);
  } catch (error: any) {
    toast.error(`Tải xuống folder zip thất bại: ${error.message}`);
  }
};
