"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  copyText,
  downloadMultipleTextsAsZip,
  downloadText,
} from "@/lib/utils";
import {
  BookUp,
  CaseUpper,
  CircleCheckBig,
  Copy,
  Download,
  Eye,
  FileDown,
  LoaderCircle,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Detail from "@/app/detail";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { upload } from "@vercel/blob/client";

export default function page() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadAll, setDownloadAll] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const checkDownloadAll = () => {
      const shouldEnableDownload = images.some(
        (item) => item.text !== "" && item.status === "Completed"
      );
      setDownloadAll(shouldEnableDownload);
    };
    checkDownloadAll();
  }, [images]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return bytes + " B";
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + " KB";
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }
  };

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
      size: formatFileSize(file.size),
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
        images.map(async (item) => {
          try {
            // kiểm tra đã chuyển đổi chưa , nếu rồi thì pass qua ảnh này
            // if (item.text !== "") return item;

            // Convert image to base64
            const newBlob = await upload(item.name, item.file, {
              access: "public",
              handleUploadUrl: "/api/upload",
            });

            const imageUrl = newBlob.url;

            // Call API endpoint
            const response = await fetch("/api/detect", {
              method: "POST",
              body: JSON.stringify({ imageUrl }),
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
              text: data.formattedText ? data.formattedText : data.rawText,
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
    <div
      className="relative min-h-screen w-full"
      style={{
        background: "linear-gradient(315deg, #d99058 0%, #f8de7e 74%)",
      }}
    >
      <div
        className={`container mx-auto px-4 ${
          isLoading ? "pointer-events-none" : ""
        }`}
      >
        <div className="absolute w-full left-0 flex justify-center items-center mt-40 sm:mt-30 md:mt-50 lg:mt-10">
          <div className="bg-white w-fit py-3 sm:py-5 px-6 sm:px-10 rounded-2xl">
            <Image
              src="/ciweimao.png"
              alt="qidian"
              width="185"
              height="36"
              className="h-auto md:w-[350px]"
            />
          </div>
        </div>
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
            className="cursor-pointer w-full lg:max-w-2xl sm:max-w-lg px-4 sm:px-10 py-6 sm:py-10 border-2 border-black border-dashed flex flex-col items-center justify-center gap-3 sm:gap-5 rounded-lg"
          >
            <div className="text-[#F8DE7E] p-3 sm:p-5 bg-black rounded-full">
              <BookUp size={36} className="sm:hidden" />
              <BookUp size={60} className="hidden sm:block" />
            </div>

            <div className="text-lg sm:text-2xl text-white text-center">
              Drop your files here or{" "}
              <span className="text-black">Click to upload</span>
            </div>
            <div className="text-sm sm:text-md -mt-1 sm:-mt-2 text-white text-center">
              PNG, JPG or JPEG
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
        </div>
        <div className="mt-[-300px] md:mt-[-400px] lg:mt-[-200px] text-white flex flex-col gap-5 sm:gap-10 justify-center items-center pb-12">
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
              <button
                onClick={handleDetectText}
                className="flex gap-2 w-full sm:w-auto min-w-[160px] max-w-[480px] items-center justify-center overflow-hidden rounded-xl h-10 px-4 text-[#f0f2f4] bg-black text-sm font-bold hover:brightness-120 active:translate-y-0.5 cursor-pointer"
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
                className="cursor-pointer flex gap-2 w-full sm:w-auto min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-xl h-10 px-4 text-[#f0f2f4] bg-black text-sm font-bold hover:brightness-120 active:translate-y-0.5"
              >
                <X /> Xoá tất cả
              </button>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`border-none outline-none flex gap-2 w-full sm:w-auto min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-xl h-10 px-4 text-[#f0f2f4] bg-black text-sm font-bold ${
                      downloadAll === false
                        ? "opacity-50 pointer-events-none"
                        : "cursor-pointer hover:brightness-120 active:translate-y-0.5"
                    }`}
                  >
                    <FileDown /> Tải tất cả
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black text-white border-none">
                  <DropdownMenuItem
                    onClick={() => {
                      downloadMultipleTextsAsZip(images);
                    }}
                    className="cursor-pointer"
                  >
                    Đưa các file .txt vào folder .zip
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      let allText = "";
                      images.map((item) => {
                        if (allText !== "") allText += "\n~~~~~~~~~~~\n";
                        allText += item.text;
                      });
                      downloadText({
                        name: `${images.length} file(s)`,
                        text: allText,
                      });
                    }}
                  >
                    Gộp các file .txt thành 1
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      images.map((item) => {
                        downloadText({
                          name: item.name,
                          text: item.text,
                        });
                      });
                    }}
                  >
                    Tải tất cả file cùng lúc
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {images.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-full sm:max-w-4xl bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-lg text-black"
            >
              <div className="flex gap-3 sm:gap-5 items-center max-w-full sm:max-w-[60%] mb-2 sm:mb-0">
                <div className="relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
                  <Image
                    src={item.preview}
                    alt={item.name}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm sm:text-base truncate max-w-full">
                    {item.name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-800">
                    {item.size}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-5 w-full sm:w-auto justify-end">
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
                          className="cursor-pointer shadow-lg rounded-md text-sm font-medium w-5 h-5 sm:w-6 sm:h-6"
                        />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Xem</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Copy
                          onClick={() => {
                            copyText(item.text);
                          }}
                          className="cursor-pointer shadow-lg rounded-md text-sm font-medium w-5 h-5 sm:w-6 sm:h-6"
                        />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Copy</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Download
                          onClick={() => {
                            downloadText({ name: item.name, text: item.text });
                          }}
                          className="cursor-pointer shadow-lg rounded-md text-sm font-medium w-5 h-5 sm:w-6 sm:h-6"
                        />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Tải xuống</TooltipContent>
                    </Tooltip>

                    <CircleCheckBig className="text-green-500 font-bold w-5 h-5 sm:w-6 sm:h-6" />
                  </>
                )}

                {item.status === "Error" && (
                  <>
                    <span className="text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[200px]">
                      {item.text}
                    </span>{" "}
                    <X className="text-red-500 font-bold w-5 h-5 sm:w-6 sm:h-6" />
                  </>
                )}

                {item.status === "In Progress" && (
                  <>
                    <LoaderCircle className="animate-spin w-5 h-5 sm:w-6 sm:h-6" />
                  </>
                )}

                <Trash2
                  onClick={() => {
                    removeImage(index);
                  }}
                  className="hover:text-red-600 hover:brightness-120 cursor-pointer w-5 h-5 sm:w-6 sm:h-6"
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
