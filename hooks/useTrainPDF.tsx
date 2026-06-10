import { useContext, useEffect, useState, useRef } from 'react';
import { getPDFList, uploadPDF } from '@/apiRequests';
import { uploadDocument, getJobProgress } from '@/apiRequests/ttt';
import ThemeContext from '@/contexts/ThemeContext';
import { useRouter } from 'next/router';
import { usePolling } from '@/hooks/usePolling';
import { UploadPhase, FileUploadStatus } from '@/types/fileUploadStatus';
import { setGraphId, setJobId } from '@/utils/sessionJobs';

const pollProgress = async (
    uploads: FileUploadStatus[],
    progressRef: React.MutableRefObject<Record<string, number>>,
    cancelledRef: React.MutableRefObject<Set<string>>
): Promise<FileUploadStatus[]> => {
    return Promise.all(
        uploads.map(async (f) => {
            if (f.phase === 'done' || f.phase === 'cancelled' || f.phase === 'error' || !f.jobId || cancelledRef.current.has(f.name)) {
                return f;
            }

            try {
                const response = await getJobProgress(f?.jobId);
                
                const progressPercentage = response?.percent || 0;
                progressRef.current[f.name] = progressPercentage;

                const currentState = response?.state
                if (currentState == "FAILED" || currentState == "COMPLETED") {
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
                    progress: progressPercentage
                };
            } catch (error) {
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
    const [pdfList, setPdfList] = useState<
        { name?: string; training_id?: string; is_trained: boolean }[]
    >([]);
    const [selectedFileType, setSelectedFileType] = useState<string>('PDF');
    const [trainingInProgress, setTrainingInProgress] = useState(false);
    const [uploads, setUploads] = useState<FileUploadStatus[]>([]);
    const cancelledRef = useRef<Set<string>>(new Set());
    const progressRef = useRef<Record<string, number>>({});
    const uploadsRef = useRef<FileUploadStatus[]>([]);
    const { 'chat-id': chatId } = router.query;

    uploadsRef.current = uploads;

    useEffect(() => {
        const fetchDocuments = async () => {
            const response = await getPDFList(chatId);
            if (response) setPdfList(response);
        };
        fetchDocuments();
    }, [chatId]);

    const hasActiveFiles = uploads.some(
        f => f.phase === 'uploading' || f.phase === 'processing'
    );

    usePolling<void>({
        fn: async () => {
            const updated = await pollProgress(uploadsRef.current, progressRef, cancelledRef);
            setUploads(updated);
            // Mark newly completed files as trained
            const newlyDone = updated.filter(f => f.phase === 'done' && !uploadsRef.current.find(u => u.name === f.name && u.phase === 'done'));
            if (newlyDone.length || updated.some(f => f.phase === 'done')) {
                const doneNames = updated.filter(f => f.phase === 'done').map(f => f.name);
                setPdfList((pl) => pl.map(item =>
                    doneNames.includes(item.name || '') ? { ...item, is_trained: true } : item
                ));
            }
        },
        interval: JSModule?.pollingInterval || 400, // configurable polling interval from backend config
        enabled: hasActiveFiles,
        shouldStop: () => !uploadsRef.current.some(f => f.phase === 'uploading' || f.phase === 'processing'),
        onComplete: () => {
            setTrainingInProgress(false);
        },
    });

    const handlePDFFileChange = (e: any) => {
        const files = e.target.files;
        if (files) {
            Array.from(files as FileList).forEach((file) => addFile(file));
        }
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
        progressRef.current[file.name] = 0;
        setUploads((prev) => [...prev, entry]);
        setPdfList((prev) => [...prev, { name: file.name, is_trained: false }]);
        setTrainingInProgress(true);
    
        try {
            const {job_id, job_type, state} = await uploadDocument(file);
            setUploads(prev =>
                prev.map(f =>
                    f.name === file.name
                        ? {
                              ...f,
                              jobId: job_id,
                              phase: "processing"
                          }
                        : f
                )
            );
            // setGraphId(graphId);  → used by chat queries
            // setJobId(jobId);      → used by polling: GET /jobs/{jobId}

        } catch {
            setUploads(prev =>
                prev.map(f =>
                    f.name === file.name
                        ? {
                              ...f,
                              phase: 'error',
                          }
                        : f
                )
            );
        }
    };

    const cancelUpload = (fileName: string) => {
        cancelledRef.current.add(fileName);
        setUploads((prev) =>
            prev.map((f) => f.name === fileName ? { ...f, phase: 'cancelled', error: 'Upload cancelled', progress: 0 } : f)
        );
    };

    const retryUpload = (fileName: string) => {
        cancelledRef.current.delete(fileName);
        progressRef.current[fileName] = 0;
        setUploads((prev) =>
            prev.map((f) => f.name === fileName ? { ...f, phase: 'uploading', progress: 0, error: undefined } : f)
        );
        setTrainingInProgress(true);
    };

    const removeUpload = (fileName: string) => {
        cancelledRef.current.delete(fileName);
        delete progressRef.current[fileName];
        setUploads((prev) => prev.filter((f) => f.name !== fileName));
        setPdfList((prev) => prev.filter((item) => item.name !== fileName));
    };

    const canCancel = (fileName: string) => {
        const f = uploads.find(u => u.name === fileName);
        return f ? f.progress < 90 && (f.phase === 'uploading' || f.phase === 'processing') : false;
    };

    return {
        pdfList,
        setPdfList,
        selectedFileType,
        uploads,
        trainingInProgress,
        setTrainingInProgress,
        handlePDFFileChange,
        handleFileDrop,
        cancelUpload,
        retryUpload,
        removeUpload,
        canCancel,
    };
}