// TODO: Sync these states with backend API response statuses.
export type UploadPhase = 'uploading' | 'processing' | 'done' | 'error' | 'cancelled';

export type FileUploadStatus = {
    name: string;
    size: number;
    type: string;
    progress: number;
    phase: UploadPhase;
    error?: string;
};

export type ActiveJob = {
    graphId: string;
    jobId: string;
    fileName: string;
};
