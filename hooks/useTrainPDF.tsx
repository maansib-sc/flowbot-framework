import { useContext, useEffect, useState, useRef } from 'react';
import { getPDFList, uploadPDF } from '@/apiRequests';
import ThemeContext from '@/contexts/ThemeContext';
import { useRouter } from 'next/router';
import { usePolling } from '@/hooks/usePolling';
import { UploadPhase, FileUploadStatus } from '@/types/fileUploadStatus';
import { setGraphId, setJobId } from '@/utils/sessionJobs';

// TODO: Replace mock data with API response when backend endpoint is available.
const mockPollProgress = (
    uploads: FileUploadStatus[],
    progressRef: React.MutableRefObject<Record<string, number>>,
    cancelledRef: React.MutableRefObject<Set<string>>
): FileUploadStatus[] => {
    return uploads.map((f) => {
        if (f.phase === 'done' || f.phase === 'cancelled' || f.phase === 'error') return f;
        if (cancelledRef.current.has(f.name)) return f;

        let p = progressRef.current[f.name] || 0;
        p += Math.random() * 8 + 2;

        if (p >= 100) {
            p = 100;
            progressRef.current[f.name] = 100;
            return { ...f, progress: 100, phase: 'done' as UploadPhase };
        }

        progressRef.current[f.name] = p;
        const phase: UploadPhase = p >= 50 ? 'processing' : 'uploading';
        return { ...f, progress: Math.round(p), phase };
    });
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
        fn: () => {
            const updated = mockPollProgress(uploadsRef.current, progressRef, cancelledRef);
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

    const addFile = (file: File) => {
        const entry: FileUploadStatus = {
            name: file.name,
            size: file.size,
            type: file.name.split('.').pop()?.toUpperCase() || '',
            progress: 0,
            phase: 'uploading',
        };
        progressRef.current[file.name] = 0;
        setUploads((prev) => [...prev, entry]);
        setPdfList((prev) => [...prev, { name: file.name, is_trained: false }]);
        setTrainingInProgress(true);

        // TODO: Call upload API, then store IDs in session:
        // const { graphId, jobId } = await uploadPDF(file, chatId);
        // setGraphId(graphId);  → used by chat queries
        // setJobId(jobId);      → used by polling: GET /jobs/{jobId}
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