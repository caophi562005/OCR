import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertToBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

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
