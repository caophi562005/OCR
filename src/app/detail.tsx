import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { copyText, downloadText } from "@/lib/utils";
import { Copy, Download } from "lucide-react";

export default function Detail(props: {
  open: boolean;
  setOpen: (v: boolean) => void;
  data: ModalData | null;
}) {
  const { open, setOpen, data } = props;

  return (
    <Dialog
      open={open}
      onOpenChange={(open: boolean) => {
        setOpen(open);
      }}
    >
      <DialogContent className="w-[90vw] !max-w-4xl border-none p-4 sm:p-6 md:p-8">
        <DialogHeader className="mb-2 sm:mb-4">
          <DialogTitle className="text-lg sm:text-xl">Xem chi tiết</DialogTitle>
          <DialogDescription className="text-sm truncate max-w-full">
            {data?.name}
          </DialogDescription>
        </DialogHeader>
        <div
          id="data-text"
          className="whitespace-pre-wrap h-52 sm:h-64 md:h-80 overflow-y-auto bg-gray-100 p-3 sm:p-4 rounded-xl shadow-lg text-gray-800 text-sm sm:text-base"
        >
          {data?.text === ""
            ? "Chưa có dữ liệu, hãy chắc chắn rằng bạn đã chuyển đổi..."
            : data?.text}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
          {data?.text && (
            <>
              <div
                onClick={() => {
                  copyText(data.text);
                }}
                className="active:translate-y-0.5 w-full sm:w-auto inline-flex justify-center cursor-pointer gap-2 shadow-lg items-center px-3 py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Copy className="w-4 h-4 sm:w-5 sm:h-5" /> Sao chép
              </div>

              <div
                onClick={() => {
                  downloadText(data);
                }}
                className="active:translate-y-0.5 w-full sm:w-auto inline-flex justify-center cursor-pointer gap-2 shadow-lg items-center px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" /> Tải xuống
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
