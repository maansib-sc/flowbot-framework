import { useContext, useEffect, useState, useRef } from 'react';
import { uploadDocument, getJobProgress, cancelDocumentProcessing } from '@/apiRequests/ttt';
import ThemeContext from '@/contexts/ThemeContext';
import { useRouter } from 'next/router';
import { usePolling } from '@/hooks/usePolling';
import { UploadPhase, FileUploadStatus } from '@/types/fileUploadStatus';
import { setGraphId, setJobId } from '@/utils/sessionJobs';
import { toast } from 'react-toastify';

const pollProgress = async (
    uploads: FileUploadStatus[],
    cancelledRef: React.MutableRefObject<Set<string>>
): Promise<FileUploadStatus[]> => {
    return Promise.all(
        uploads.map(async (f) => {
            if (f.phase === 'done' || f.phase === 'cancelled' || f.phase === 'error' || !f.jobId || cancelledRef.current.has(f.jobId)) {
                return f;
            }

            try {
                const response = await getJobProgress(f?.jobId);
                const progressPercentage = response?.percent || f.progress || 0;

                const currentState = response?.state
                if (currentState == "CANCELLED") {
                    cancelledRef.current.add(f.jobId);
                    return {
                        ...f,
                        phase: "cancelled",
                        error: 'Upload cancelled',
                        progress: 0
                    };
                } else if (currentState == "FAILED" || currentState == "COMPLETED") {
                    return {
                        ...f,
                        phase: currentState == "FAILED"? "error": "done",
                        progress: progressPercentage
                    };
                }

                // if the current state is not of failed or completed, 
                // not changing the phase, updating the progress percentage only;
                return {
                    ...f,
                    phase: currentState === "CANCELLING"? "cancelling": "processing",
                    progress: progressPercentage
                };
            } catch (error: any) {
                console.error(`something went wrong in polling progress`, {
                    message: error?.message,
                    status: error?.response?.status,
                    responseData: error?.response?.data
                });

                return {
                    ...f,
                    phase: 'error',
                    error: 'Failed to fetch status',
                };
            }
        })
    );
};

export const useTainPDF = () => {
    const router = useRouter();
    const { JSModule } = useContext(ThemeContext);
    const [documentList, setDocumentList] = useState<FileUploadStatus[]>([]);
    const [selectedFileType, setSelectedFileType] = useState<string>('PDF');
    const [trainingInProgress, setTrainingInProgress] = useState(false);
    const [uploads, setUploads] = useState<FileUploadStatus[]>([]);
    const cancelledRef = useRef<Set<string>>(new Set());
    const uploadsRef = useRef<FileUploadStatus[]>([]);
    const { 'chat-id': chatId } = router.query;

    uploadsRef.current = uploads;
    const hasActiveFiles = uploads.some(
        (f: FileUploadStatus) => f.phase === 'uploading' || f.phase === 'processing' || f.phase === 'cancelling'
    );

    usePolling<void>({
        fn: async () => {
            const updated = await pollProgress(uploadsRef.current, cancelledRef);
            setUploads(updated);
            // Mark newly completed files as trained
            const updatedDocumentList = updated.map((item) => item.phase === "done"? { ...item, progress: 100}: item)
            setDocumentList(updatedDocumentList)
        },
        interval: JSModule?.pollingInterval || 400, // configurable polling interval from backend config
        enabled: hasActiveFiles,
        shouldStop: () => !uploadsRef.current.some((f: FileUploadStatus) => f.phase === 'uploading' || f.phase === 'processing' || f.phase === 'cancelling'),
        onComplete: () => {
            setTrainingInProgress(false);
        },
    });

    const handleFileChange = (e: any) => {
        const files = e.target.files;
        if (files) {
            Array.from(files as FileList).forEach((file) => addFile(file));
        }
        // resetting the file input value after processing
        e.target.value = '';
    };

    const handleFileDrop = (files: FileList) => {
        Array.from(files).forEach((file) => addFile(file));
    };

    const addFile = async (file: File) => {
        const entry: FileUploadStatus = {
            name: file.name,
            size: file.size,
            type: file.name.split('.').pop()?.toUpperCase() || '',
            progress: 0,
            phase: 'uploading',
            jobId: '',
            graphId: ''
        };
        setUploads((prev: FileUploadStatus[]) => [...prev, entry]);
        setTrainingInProgress(true);
        
        try {
            const {job_id, job_type, state} = await uploadDocument(file);
            setDocumentList((prev: FileUploadStatus[]) => [...prev, { name: file.name, jobId: job_id}]);
            setUploads((prev: FileUploadStatus[]) =>
                prev.map(f =>
                    f.name === file.name && !f.jobId
                        ? {
                              ...f,
                              jobId: job_id,
                              phase: f.phase === "uploading"? "processing": f.phase
                          }
                        : f
                )
            );
            // setGraphId(graphId);  → used by chat queries
            // setJobId(jobId);      → used by polling: GET /jobs/{jobId}

        } catch {
            // a unique jobId to differentiate the file
            const tempId = crypto.randomUUID();
            setUploads((prev: FileUploadStatus[]) =>
                prev.map(f =>
                    f.name === file.name && !f.jobId
                        ? {
                              ...f,
                              jobId: tempId,
                              phase: 'error',
                          }
                        : f
                )
            );
        }
    };

    const cancelUpload = async (jobId: string) => {
        // const file = uploadsRef.current.find((f: FileUploadStatus) => f.name === fileName);
        if (!jobId) return
        
        // here we are not changing the UI status directly, instead it is handled in pollprogress function;
        const response = await cancelDocumentProcessing(jobId)
        if (!response) {
            toast("Document processing cancellation failed", { type: "error" })
        } else {
            // if cancellation is successful
            setUploads((prev: FileUploadStatus[]) =>
                prev.map((f) => f.jobId === jobId ? { ...f, phase: 'cancelling', progress: 0} : f)
            );
        }
    };

    // TODO: extend this function, once the retry upload option is there;
    const retryUpload = (fileName: string) => {};

    const removeUpload = (jobId: string) => {
        cancelledRef.current.delete(jobId);
        setUploads((prev: FileUploadStatus[]) => prev.filter((f) => f.jobId !== jobId));
        setDocumentList((prev: FileUploadStatus[]) => prev.filter((item) => item.jobId !== jobId));
    };

    const canCancel = (jobId: string) => {
        const f = uploads.find((f: FileUploadStatus) => f.jobId === jobId);
        return f ? f.progress < 90 && f.phase === 'processing' : false;
    };

    return {
        documentList,
        setDocumentList,
        selectedFileType,
        uploads,
        trainingInProgress,
        setTrainingInProgress,
        handleFileChange,
        handleFileDrop,
        cancelUpload,
        retryUpload,
        removeUpload,
        canCancel,
    };
}