import React, { useContext, useRef, useState, useCallback } from "react";
import { useRouter } from 'next/router';
import ThemeContext from "@/contexts/ThemeContext";
import { useTainPDF } from "@/hooks/useTrainPDF";
import { getPDFList, deleteDocument } from "@/apiRequests";
import UploadIcon from '@/assets/svgs/UploadIcon';
import FileTextIcon from '@/assets/svgs/FileTextIcon';
import TrashIcon from '@/assets/svgs/TrashIcon';
import Spinner from '@/components/ui/Spinner';


interface SideDrawerProps {
    open: boolean;
    setOpen: (val: boolean) => void;
}

export const SidePanel: React.FC<SideDrawerProps> = ({ open, setOpen }) => {
    const { JSModule, styles } = useContext(ThemeContext);
    const {
        pdfList, setPdfList, uploads, selectedFileType, setTrainingInProgress,
        handlePDFFileChange, handleFileDrop, cancelUpload, retryUpload, removeUpload, canCancel
    } = useTainPDF();
    const router = useRouter();
    const { 'chat-id': chatId } = router.query;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [drawerWidth, setDrawerWidth] = useState(320);
    const [dragOver, setDragOver] = useState(false);
    const isResizing = useRef(false);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        isResizing.current = true;
        const startX = e.clientX;
        const startWidth = drawerWidth;

        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing.current) return;
            const diff = startX - e.clientX;
            const newWidth = Math.min(Math.max(startWidth + diff, 250), 600);
            setDrawerWidth(newWidth);
        };

        const handleMouseUp = () => {
            isResizing.current = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [drawerWidth]);

    const handleDeleteDocument = async (documentName: string) => {
        try {
            const response = await deleteDocument(documentName, `${chatId}`);
            if (response) {
                const uploadedDocuments = await getPDFList(`${chatId}`);
                setPdfList(uploadedDocuments);
            }
        } catch (error) {
            console.log(`Error deleting doc ${documentName}: ${error}`);
        }
    };

    const formatBytes = (bytes: number) => {
        if (!bytes) return '';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${Math.round((bytes / Math.pow(1024, i)) * 10) / 10} ${sizes[i]}`;
    };

    if (!JSModule?.drawerEnabled || !open) return null;

    return (
        <div className={styles?.['HamburgerContainer']} style={{ width: drawerWidth, minWidth: 250, maxWidth: 600 }}>
            <div className={styles?.['drawerResizeHandle']} onMouseDown={handleMouseDown} />

            <div className={styles?.['HamburgerHeaderContainer']}>
                <div className={styles?.['HamburgerHeaderTop']}>
                    <div className={styles?.['HamburgerHeader']}>Documents</div>
                    <div className={styles?.['drawerCloseBtn']} onClick={() => setOpen(false)}>✕</div>
                </div>
                <p className={styles?.['drawerSubtitle']}>Upload documents and ask questions based on their content.</p>
            </div>

            <div className={styles?.['UploadContainer']}>
                <label
                    className={`${styles?.['dropZone']} ${dragOver ? styles?.['dropZoneActive'] : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        if (e.dataTransfer.files?.length) handleFileDrop(e.dataTransfer.files);
                    }}
                >
                    <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        multiple
                        onChange={handlePDFFileChange}
                        ref={fileInputRef}
                        className="hidden"
                    />
                    <div className={styles?.['dropZoneIcon']}>
                        <UploadIcon size={20} stroke="#3b82f6" />
                    </div>
                    <div className={styles?.['dropZoneTitle']}>Drag and drop files here</div>
                    <div className={styles?.['dropZoneOr']}>or click to browse</div>
                    <div className={styles?.['dropZoneHint']}>PDF, DOCX, TXT (Max 50MB)</div>
                </label>
            </div>

            {uploads.filter(f => f.phase !== 'done').length > 0 && (
                <div className={styles?.['uploadsSection']}>
                    <div className={styles?.['uploadsHeader']}>Uploads ({uploads.filter(f => f.phase !== 'done').length})</div>
                    {uploads.filter(f => f.phase !== 'done').map((file) => {
                        const isDone = file.phase === 'done';
                        const isError = file.phase === 'error' || file.phase === 'cancelled';
                        const isProcessing = file.phase === 'processing';
                        const statusLabel = isDone ? 'Upload complete'
                            : isError ? (file.error || 'Failed to upload')
                            : isProcessing ? 'Processing...'
                            : 'Uploading...';

                        return (
                            <div key={file.name} className={styles?.['fileCard']}>
                                <div className={styles?.['fileCardTop']}>
                                    <div className={styles?.['fileIcon']}>
                                        <FileTextIcon size={22} stroke={isError ? '#ef4444' : isDone ? '#10b981' : '#6b7280'} />
                                    </div>
                                    <div className={styles?.['fileMeta']}>
                                        <div className={styles?.['fileName']}>{file.name}</div>
                                        <div className={styles?.['fileSub']}>
                                            {formatBytes(file.size)}{file.type ? ` • ${file.type}` : ''}
                                        </div>
                                    </div>
                                    <div className={styles?.['fileStatusRight']}>
                                        {isDone ? (
                                            <span className={styles?.['fileDoneLabel']}>✓ Done</span>
                                        ) : isError ? (
                                            <span className={styles?.['fileErrorIcon']}>!</span>
                                        ) : (
                                            <>
                                                <span className={styles?.['filePercent']}>{file.progress}%</span>
                                                {canCancel(file.name) && (
                                                    <button className={styles?.['fileCancelX']} onClick={() => cancelUpload(file.name)}>✕</button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className={styles?.['fileProgressBg']}>
                                    <div
                                        className={`${styles?.['fileProgressFill']} ${
                                            isError ? styles?.['fileProgressError']
                                            : isDone ? styles?.['fileProgressDone']
                                            : isProcessing ? styles?.['fileProgressProcessing']
                                            : ''
                                        }`}
                                        style={{ width: isError ? '100%' : `${file.progress}%` }}
                                    />
                                </div>

                                {isError ? (
                                    <div className={styles?.['fileErrorActions']}>
                                        <button className={styles?.['fileRetryBtn']} onClick={() => retryUpload(file.name)}>↻ Retry</button>
                                        <button className={styles?.['fileRemoveBtn']} onClick={() => removeUpload(file.name)}>🗑 Remove</button>
                                    </div>
                                ) : (
                                    <div className={`${styles?.['fileStatusLabel']} ${
                                        isDone ? styles?.['fileStatusDone']
                                        : isProcessing ? styles?.['fileStatusProcessing']
                                        : styles?.['fileStatusUploading']
                                    }`}>
                                        {!isDone && <Spinner size={12} />}
                                        {statusLabel}
                                    </div>
                                )}

                                {!isDone && !isError && !canCancel(file.name) && file.progress >= 90 && (
                                    <div className={styles?.['cancelHint']}>Cancel will be disabled soon ⓘ</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <div className={styles?.['Divider']} />
            <div className={styles?.['UploaderHeader']}>Trained Documents</div>

            <div className={styles?.['DataContainer']}>
                {pdfList?.filter(d => d.is_trained).map((document, index) => (
                    <div key={index} className={styles?.['fileCard']}>
                        <div className={styles?.['fileCardTop']}>
                            <div className={styles?.['fileIcon']}>
                                <FileTextIcon size={22} stroke="#10b981" />
                            </div>
                            <div className={styles?.['fileMeta']}>
                                <div className={styles?.['fileName']}>{document?.name || document?.training_id}</div>
                            </div>
                            <span className={styles?.['fileDoneLabel']}>✓ Done</span>
                        </div>
                        <div className={styles?.['fileProgressBg']}>
                            <div className={`${styles?.['fileProgressFill']} ${styles?.['fileProgressDone']}`} style={{ width: '100%' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

