"use client";

import {
  CaseUpper,
  CircleAlert,
  CircleCheck,
  Copy,
  Download,
  Eye,
  LoaderCircle,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { useState } from "react";
import Detail from "./detail";
import { convertToBase64, copyText, downloadText } from "@/lib/utils";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Page() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [isArrange, setIsArrange] = useState<CheckedState>(false);

  // const textTest =
  //   "银微微点头,说道:“螺旋树一直对自己很自信……………这边,自然也不可能退。”\n\n“不如说神秘结社都是如此,就事实而言,他们也的确很有实力。”琴休道,“就像是亚特人\n一样,精神力都远远高于平均水准。并不是他们有特殊的能力,只是,在这样的环境下还要违逆大\n势,生活在暗处也要完成自己的目的,可不就是‘意志’和‘梦想’的双重特化吗。”\n\n这也是亚特人和神秘结社容易出高手的原因,正因为是唯我的偏执狂,所以精神力才更强大。\n反观正经的人类阵营,‘意志力’方面有不少能跟上的,这没什么说的,大家都是人,意志力\n纯看个人经历和心性,从平均值而言,基本没什么明显的差距。\n\n但‘梦想’这块,鲜少有人能跟上亚特人和神秘结社。\n大多数人类高手都没有什么‘改变社会结构’之类的远大梦想,而诸如‘成为最强’ ‘天下无\n敌’之类的战狂梦想,肯定比不上亚特人和神秘结社的‘改变世界’类梦想,而一旦有了后边的那\n种梦想,那么就距离遁入神秘结社不远了……………………\n\n或者说,‘改变世界’这一类的梦想几乎就是最高判定、食物链的最顶层了,仅次于穷究一\n切真理,至于往哪方面去改变,至高裁决并不在乎。\n\n琴休顿了顿,询问道:“什么时间,需要我做什么辅助?”\n\n银说道:“十二月九日,至于具体什么辅助,你到时候看着做吧……拥有因果战法和\n那颗清晰的头脑,你到时的判断和选择,一定比在现在胡乱指派任务的家伙靠谱多了,当然,双方\n的战力和装备,一切我知道的情报,到时候都会传给你的,唯有一点要注意,一切以保存自己为先\n即便修穆被夺走,螺旋树获得无尽的力量统治世界,你也要活下来。”\n\n“………………我知道。”\n\n因果战法,返还一切的希望之光,没什么比活下来更重要了,当年初代和亚特帝皇的决战也是\n拖得实在没办法了,这才开战的。\n\n琴休说道:“但是,院长您说得太夸张了吧,忽然就跳到螺旋树统治世界什么的…………………\n\n“这不是不可能的事。”银有些无奈地笑笑,“当然,能不发生就最好了……………十二月九\n日,我也会辅助你的,但是,能力有限,别抱太多期望为好。”\n\n琴休从以前开始就很在意了,银的能力好像是有什么使用限制一样,当初无色区那场大战,三\n方高手轮番上阵,修穆、姬裳、王牌,别的不算,就这三加一块,都够下厚土或莫斯特这样的超级\n副本了,而且打穿的概率还不小。\n\n要知道,这三随便拎一个出来,杀头衔持有者就跟杀鸡一样,琴历劫这样的极端特化特攻上去\n都不是对手,险些给人打死。\n\n战局激烈成那样,可以说脑浆子都要打出来了,也没见银跳出来装个逼,最后还得是修穆收割\n残局………………加上银如今的这番话语,琴休可以肯定银的出手有各种限制。\n\n【“说起来,亚特人和神秘结社的成员就算混进了恒光,也几乎不会在恒光里动手,翻看往年\n的新闻,几乎找不到恒光里发生特殊事件的新闻,莫非……………”】\n\n琴休没有多想下去。\n\n今天是十二月七日…………还有两天,琴休停止了一切多余活动,全身心投入精神力的增长\n修行中。\n\n“这个表………………..是好的。”\n\n与此同时,四处奔波的秋雪相终于找到了一位手艺过人的老工匠,后者随意拆掉了那块造型古\n朴的怀表,其后给出这样一个有些离奇的回答。\n\n“是好的…………………?”秋雪相微微一怔,“但是,它不动了啊。”\n\n“关于这点,我也正在思考原因。”老工匠抽了口十五伊布一条的劣质香烟,吐出浓烈的气味\n“但是,它的内部结构完全是完好的,唯有这点我可以肯定……………这个表,是好的,至于\n为什么忽然不动了,我想是有些其他的理由。\n\n秋雪相道:“比如说?”\n\n“比如说……………….外部环境出了问题之类的。”老工匠眉头拧成一块,想要找些理由出来\n“比如说素子场域之类的………………\n\n很显然,这位老人对素子场域的了解仅限于‘知道这个单词’而已,这话外行到秋雪相连反驳\n科普的欲望都没有。\n\n不过,老工匠的话语的确对秋雪相有一定提醒。\n\n他若有所思:“外部环境导致的不动’………………..\n\n纯白一片的世界,没有任何色彩,没有方向、时间、亦没有空间、重力,更别说声音,图像。\n向上或是向下、向前或是向后,世界都不会有任何变化,连自己的存在都不会出现。\n\n【“这就是假人格的世界。”】\n\n【“无论看到几次,都叫人觉得………………真是不像样。”】\n\n修穆的意识在其中波动开来。\n\n没错,他被银的手段‘封印’在这里面了,只不过有一点他误会了,甚至连银本身都没搞清楚\n一正常的假人格在被封印时,是无意识的,不会被困在这样的空间中。\n\n因为,若是被困在这样的地方,即便意志坚韧如琴历劫、黑泽诗穂,也会很快崩溃,大部分假\n人格也都是撑不住的。\n\n一个什么都没有的世界,连‘自我’都不存在。\n\n而修穆的意识之所以会在这,完全是因为他的自我绝对不灭,无论处于怎样的环境中,都\n拥有“绝对本我’,世界上没有任何力量能让修穆停止思考,所以,他的意识便处于这个灵与肉的\n夹缝之中………….绝对虚无空白的世界。\n\n也就是说,这个夹缝世界其实是被他的本我硬生生开辟出来的………………\n\n这是银的失误,但她也没有办法,这个魔法,她使用的次数本就不多,而修穆更是全世界最特\n殊的存在之一………………不过,修穆也不怪银,因为这种足以将任何人逼疯的折磨,对他而言微\n不足道。\n\n只是,想起某些事,他心中还是生出几分深沉而急迫的叹息。\n\n【“快点到来吧....”】\n";

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openSelecteFile = () => {
    if (!isLoading) return fileInputRef.current?.click();
    return;
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
            const base64: any = await convertToBase64(item.file);
            const base64Image = base64.split(`data:${item.type};base64,`)[1];

            // Call API endpoint
            const response = await fetch("/api/detect", {
              method: "POST",
              body: JSON.stringify({ image: base64Image, arrange: isArrange }),
            });

            if (!response.ok) {
              return {
                ...item,
                text: "Không tìm thấy văn bản trong hình ảnh hoặc không nhận dạng được chữ",
                status: "Error",
              };
            }

            const data = await response.json();

            // Return updated image with detected text
            return {
              ...item,
              text:
                data.formattedText || "Không tìm thấy văn bản trong hình ảnh.",
              status: "Completed",
            };
          } catch (error: any) {
            console.error("Error processing image:", error);
            // Return original image with error message
            return {
              ...item,
              text: `Lỗi xử lý: ${error.message}`,
              rawText: `Lỗi xử lý: ${error.message}`,
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

  const scrollToSection = () => {
    const section = document.getElementById("all-images");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="mx-auto max-w-[1000px] container">
      <div className="flex flex-col">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight">
              OCR Image
            </p>
            <p className="text-[#637588] text-sm font-normal leading-normal">
              Click vào để tải ảnh lên
            </p>
          </div>
        </div>
        <div
          className={`flex flex-col p-4 ${
            isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={openSelecteFile}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[#dce0e5] px-6 py-14">
            <div className="flex max-w-[480px] flex-col items-center gap-2">
              <p className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
                Tải ảnh
              </p>
              <p className="text-[#111418] text-sm font-normal leading-normal max-w-[480px] text-center">
                Bạn có thể chọn nhiều ảnh cùng lúc
              </p>
              <p className="text-[#111418] text-sm font-normal leading-normal max-w-[480px] text-center">
                Định dạng ảnh cho phép là{" "}
                <span className="text-black font-bold">.PNG .JPG .JPEG</span>
              </p>
            </div>
            <button className="flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">Upload image</span>
            </button>
          </div>
        </div>
      </div>
      {images.length > 0 && (
        <>
          <div className="flex gap-2 items-center w-full justify-end">
            <Checkbox
              className="cursor-pointer"
              id="merge"
              onCheckedChange={(checked) => {
                setIsArrange(checked);
              }}
            />
            <label
              htmlFor="merge"
              className="text-sm font-medium select-none cursor-pointer"
            >
              Sắp xếp text gọn gàng
            </label>
          </div>
          <div className="flex justify-center items-center gap-5">
            <button
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  scrollToSection();
                }, 50);
                handleDetectText();
              }}
              disabled={isLoading}
              className={`flex gap-2 min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-xl h-10 px-4 text-[#f0f2f4] bg-[#111418] text-sm font-bold leading-normal tracking-[0.015em] ${
                isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin" /> Đang chuyển đổi...
                </>
              ) : (
                <>
                  <CaseUpper /> Chuyển đổi
                </>
              )}
            </button>

            <button
              onClick={() => {
                setImages([]);
              }}
              className={`flex gap-2 min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-xl h-10 px-4 text-[#f0f2f4] bg-[#111418] text-sm font-bold leading-normal tracking-[0.015em] ${
                isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <X /> Xoá tất cả
            </button>
          </div>
        </>
      )}
      <div
        id="all-images"
        className={`flex flex-wrap gap-4 p-4 ${
          isLoading
            ? "opacity-50 cursor-not-allowed pointer-events-none select-none"
            : ""
        }`}
      >
        {images.map((image, index) => (
          <div
            className="flex items-center gap-4 px-4 py-3 justify-between container"
            key={index}
          >
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16">
                <Image
                  src={image.preview}
                  alt={image.name}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <p className="text-[#111418] text-base font-normal leading-normal flex-1 truncate">
                {image.name}
              </p>
            </div>
            <div className="flex gap-5 items-center">
              {image.text !== "" && image.status === "Completed" && (
                <>
                  {/* <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        onClick={() => {
                          setImages((prevArray) =>
                            prevArray.map((item, i) =>
                              i === index ? { ...item, loading: true } : item
                            )
                          );
                          setTimeout(() => {
                            setImages((prevArray) =>
                              prevArray.map((item, i) =>
                                i === index ? { ...item, loading: false } : item
                              )
                            );
                          }, 1000);
                        }}
                        className="inline-flex cursor-pointer gap-2 shadow-lg items-center px-3 py-2 rounded-md text-sm font-medium bg-gray-100"
                      >
                        <RotateCw
                          className={image.loading ? "animate-spin" : ""}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Tải lại</TooltipContent>
                  </Tooltip> */}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        onClick={() => {
                          copyText(image.text);
                        }}
                        className="inline-flex cursor-pointer gap-2 shadow-lg items-center px-3 py-2 rounded-md text-sm font-medium bg-gray-100"
                      >
                        <Copy />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Copy</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        onClick={() => {
                          downloadText({
                            name: image.name,
                            text: image.text,
                          });
                        }}
                        className="inline-flex cursor-pointer gap-2 shadow-lg items-center px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        <Download />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Tải file .txt</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        onClick={() => {
                          setOpenModal(true);
                          setModalData({
                            name: image.name,
                            text: image.text,
                          });
                        }}
                        className="inline-flex cursor-pointer gap-2 shadow-lg items-center px-3 py-2 rounded-md text-sm font-medium bg-gray-100"
                      >
                        <Eye />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Xem</TooltipContent>
                  </Tooltip>
                </>
              )}

              {image.status === "Not Started" && (
                <div className="inline-flex gap-2 items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                  <CircleAlert />
                  Chưa chuyển đổi
                </div>
              )}

              {image.status === "In Progress" && (
                <div className="inline-flex gap-2 items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                  <LoaderCircle className="animate-spin" />
                  Đang chuyển đổi
                </div>
              )}

              {image.status === "Completed" && (
                <div className="inline-flex gap-2 items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800">
                  <CircleCheck /> Đã chuyển đổi
                </div>
              )}

              {image.status === "Error" && (
                <>
                  <div className="inline-flex gap-2 items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-800">
                    <X /> Không tìm thấy văn bản
                  </div>
                </>
              )}

              <button
                onClick={() => removeImage(index)}
                disabled={isLoading}
                className={`text-gray-600 ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:text-red-600"
                }`}
              >
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
        <Detail open={openModal} setOpen={setOpenModal} data={modalData} />
      </div>
    </div>
  );
}
