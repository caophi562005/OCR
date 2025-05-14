"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { convertToBase64 } from "@/lib/utils";
import {
  CaseUpper,
  CircleCheckBig,
  CloudUpload,
  Copy,
  Download,
  Eye,
  LoaderCircle,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Detail from "./detail";

export default function page() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFiles = Array.from(e.target.files);
    selectedFiles.reverse();

    const validFiles = selectedFiles.filter((file: any) => {
      const isValid =
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg";

      if (!isValid) {
        toast.error(`File ${file.name} không có định dạng phù hợp`);
      }

      return isValid;
    });

    if (validFiles.length === 0) {
      return;
    }

    const newImages: ImageFile[] = validFiles.map((file: any) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
      text: "",
      status: "Not Started",
    }));

    setImages((prev) => [...prev, ...newImages]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDetectText = async () => {
    if (images.length === 0) return;
    setIsLoading(true);

    try {
      setImages((prevFiles) =>
        prevFiles.map((file) => ({
          ...file,
          status: "In Progress",
        }))
      );

      // Process all images using Promise.all with map
      const processedResults: ImageFile[] = await Promise.all(
        images.map(async (item, index) => {
          try {
            // kiểm tra đã chuyển đổi chưa , nếu rồi thì pass qua ảnh này
            // if (item.text !== "") return item;

            // Convert image to base64
            const base64: any = await convertToBase64(item.file);
            const base64Image = base64.split(`data:${item.type};base64,`)[1];

            // Call API endpoint
            const response = await fetch("/api/detect", {
              method: "POST",
              body: JSON.stringify({ image: base64Image }),
            });

            if (!response.ok) {
              return {
                ...item,
                text: "Không tìm thấy văn bản",
                status: "Error",
              };
            }

            const data = await response.json();

            // Return updated image with detected text
            return {
              ...item,
              text: data.text,
              status: "Completed",
            };
          } catch (error: any) {
            console.error("Error processing image:", error);
            // Return original image with error message
            return {
              ...item,
              text: `Lỗi xử lý: ${error.message}`,
              status: "Error",
            };
          }
        })
      );

      // Update the images state with processed results
      setImages(processedResults);
    } catch (error: any) {
      console.error("Detection Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openSelecteFile = () => {
    if (!isLoading) return fileInputRef.current?.click();
    return;
  };

  return (
    <div className="relative min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center bg-fixed">
      <div className={`container ${isLoading ? "pointer-events-none" : ""}`}>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div
            onClick={openSelecteFile}
            onDrop={(e) => {
              e.preventDefault();
              if (!e.dataTransfer.files || e.dataTransfer.files.length === 0)
                return;
              handleFileChange({ target: { files: e.dataTransfer.files } });
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            className="cursor-pointer px-50 py-10 border-2 border-gray-700 border-dashed flex flex-col items-center justify-center gap-5 rounded-lg"
          >
            <CloudUpload
              className="text-primary-base bg-primary-50 rounded-full p-5"
              size={100}
            />
            <div className="text-2xl text-white">
              Drop your files here or{" "}
              <span className="text-primary-base">Click to upload</span>
            </div>
            <div className="text-md -mt-2 text-gray-400">
              SVG, PNG, JPG or GIF (max. 800x400px)
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          {/* <div className="py-3 flex gap-2 justify-center items-center w-full">
            <hr className="border border-white w-1/4" />
            <div className="text-white">OR</div>
            <hr className="border border-white w-1/4" />
          </div>
          <div className="text-white text-2xl">Import from URL</div>
          <div className="mt-2 text-lg text-primary-base w-full text-center">
            <input
              spellCheck="false"
              className="w-2/5 px-3 py-2 focus:outline-none border-2 border-r-0 border-gray-700 rounded-tl-lg rounded-bl-lg"
            />
            <button className="text-white px-3 py-2 border-2 border-l-0 border-gray-700 rounded-tr-lg rounded-br-lg">
              Upload
            </button>
          </div> */}
        </div>
        <div className="mt-[-200px] text-white flex flex-col gap-10 justify-center items-center">
          <div className="flex gap-10">
            <button
              onClick={handleDetectText}
              className="flex gap-2 min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-xl h-10 px-4 text-[#f0f2f4] bg-primary-base text-sm font-bold hover:opacity-90 active:translate-y-0.5 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin" /> Đang chuyển đổi...
                </>
              ) : (
                <>
                  <CaseUpper /> Chuyển sang chữ
                </>
              )}
            </button>
            <button
              onClick={() => {
                setImages([]);
              }}
              className="cursor-pointer flex gap-2 min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-xl h-10 px-4 text-[#f0f2f4] bg-primary-base text-sm font-bold hover:opacity-90 active:translate-y-0.5"
            >
              <X /> Xoá tất cả
            </button>
          </div>
          {images.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between w-[800px]"
            >
              <div className="flex gap-5 items-center max-w-[700px]">
                <div className="relative h-16 w-16">
                  <Image
                    src={item.preview}
                    alt={item.name}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <div>
                  <div>{item.name}</div>
                  <div>{item.size}</div>
                </div>
              </div>
              <div className="flex items-center gap-5">
                {item.status === "Completed" && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Eye
                          onClick={() => {
                            setOpenModal(true);
                            setModalData({
                              name: item.name,
                              text: item.text,
                            });
                          }}
                          className="cursor-pointer shadow-lg rounded-md text-sm font-medium text-white"
                        />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Xem</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Copy className="cursor-pointer shadow-lg rounded-md text-sm font-medium text-white" />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Copy</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Download className="cursor-pointer shadow-lg rounded-md text-sm font-medium text-white" />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Tải xuống</TooltipContent>
                    </Tooltip>

                    <CircleCheckBig className="text-green-300 font-bold" />
                  </>
                )}

                {item.status === "Error" && (
                  <>
                    {item.text} <X className="text-red-300 font-bold" />
                  </>
                )}

                {item.status === "In Progress" && (
                  <>
                    <LoaderCircle className="animate-spin" />
                  </>
                )}

                <Trash2
                  onClick={() => {
                    removeImage(index);
                  }}
                  className="hover:text-red-600 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Detail open={openModal} setOpen={setOpenModal} data={modalData} />
    </div>
  );
}
