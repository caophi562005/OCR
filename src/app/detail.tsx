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
      <DialogContent className="min-w-4xl">
        <DialogHeader>
          <DialogTitle>Xem chi tiết</DialogTitle>
          <DialogDescription>{data?.name}</DialogDescription>
        </DialogHeader>
        <div
          id="data-text"
          className="whitespace-pre-wrap h-64 md:h-80 overflow-y-auto bg-gray-100 p-4 rounded-xl shadow-lg text-gray-800"
        >
          {data?.text === ""
            ? "Chưa có dữ liệu, hãy chắc chắn rằng bạn đã chuyển đổi..."
            : data?.text}
        </div>
        <DialogFooter className="flex">
          {data?.text && (
            <>
              <div
                onClick={() => {
                  copyText(data.text);
                }}
                className="inline-flex cursor-pointer gap-2 shadow-lg items-center px-3 py-2 rounded-md text-sm font-medium bg-gray-100"
              >
                <Copy /> Sao chép
              </div>

              <div
                onClick={() => {
                  downloadText(data!);
                }}
                className="inline-flex cursor-pointer gap-2 shadow-lg items-center px-3 py-2 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
              >
                <Download /> Tải xuống
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
