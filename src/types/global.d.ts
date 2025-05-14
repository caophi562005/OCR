export {};

declare global {
  interface ImageFile {
    file: File;
    preview: string;
    name: string;
    size: string;
    type: string;
    text: string;
    status: "Completed" | "Not Started" | "In Progress" | "Error";
  }

  interface ModalData {
    name: string;
    text: string;
  }
}
