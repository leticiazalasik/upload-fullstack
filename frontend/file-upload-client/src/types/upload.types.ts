// src/types/upload.types.ts
export interface FileUploadState {
    file: File | null;
    status: string;
    progress: number;
  }
  
  export interface UploadResponse {
    message: string;
    filename: string;
    size?: number;
    type?: string;
  }