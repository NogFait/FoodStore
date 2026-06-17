import api from "../api/api";
import type { UploadResult } from "../types/upload";

export function uploadImage(file: File): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);
  return api
    .post<UploadResult>("/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
}

export function deleteImage(publicId: string): Promise<void> {
  return api.delete(`/uploads/imagen/${encodeURIComponent(publicId)}`);
}
