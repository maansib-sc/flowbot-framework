import React, { useContext, useRef, useState, useCallback } from "react";
import { useRouter } from 'next/router';
import ThemeContext from "@/contexts/ThemeContext";
import { useTainPDF } from "@/hooks/useTrainPDF";
import UploadIcon from '@/assets/svgs/UploadIcon';
import FileTextIcon from '@/assets/svgs/FileTextIcon';
import Spinner from '@/components/ui/Spinner';
import { ToastContainer } from 'react-toastify';
import { MoreVertical } from 'lucide-react';
import { SideDrawerProps, UploadDropZoneProps, UploadFileCardProps, UploadsSectionProps, TrainedDocumentsProps } from '@/types/sideDrawer';

const formatBytes = (bytes: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round((bytes / Math.pow(1024, i)) * 10) / 10} ${sizes[i]}`;
};

const UploadDropZone: React.FC<UploadDropZoneProps> = ({
    styles, dragOver, setDragOver, handleFileDrop, handleFileChange, fileInputRef
}) => (
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
                onChange={handleFileChange}
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
);

const UploadFileCard: React.FC<UploadFileCardProps> = ({
    styles, file, canCancel, cancelUpload, retryUpload, removeUpload
}) => {
    const isDone = file.phase === 'done';
    const isError = file.phase === 'error' || file.phase === 'cancelled';
    const isProcessing = file.phase === 'processing';
    const isCancelling = file.phase === 'cancelling'
    const statusLabel = isDone ? 'Upload complete'
        : isError ? (file.error || 'Failed to upload')
        : isProcessing ? (file.stage || 'Processing...')
        : isCancelling ? 'Cancelling...'
        : 'Uploading...';

    return (
        <div className={styles?.['fileCard']}>
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
                            {(canCancel(file.jobId) && file.phase !== "cancelling") && (
                                <button className={styles?.['fileCancelX']} onClick={() => cancelUpload(file.jobId)}>✕</button>
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
                        : isCancelling ? styles?.['fileProgressCancelling']
                        : ''
                    }`}
                    style={{ width: isError ? '100%' : `${file.progress}%` }}
                />
            </div>

            {isError ? (
                <div className={styles?.['fileErrorActions']}>
                    {/* <button className={styles?.['fileRetryBtn']} onClick={() => retryUpload(file.name)}>↻ Retry</button> */}
                    {
                        file.jobId && (
                            <button className={styles?.['fileRemoveBtn']} onClick={() => removeUpload(file.jobId)}>🗑 Remove</button>
                        )
                    }
                </div>
            ) : (
                <div className={`${styles?.['fileStatusLabel']} ${
                    isDone ? styles?.['fileStatusDone']
                    : isProcessing ? styles?.['fileStatusProcessing']
                    : isCancelling ? styles?.['fileStatusCancelling']
                    : styles?.['fileStatusUploading']
                }`}>
                    {!isDone && <Spinner size={12} />}
                    {statusLabel.toUpperCase()}
                </div>
            )}

            {!isDone && !isError && !canCancel(file.jobId) && file.progress >= 90 && (
                <div className={styles?.['cancelHint']}>Cancel will be disabled soon ⓘ</div>
            )}
        </div>
    );
};

const UploadsSection: React.FC<UploadsSectionProps> = ({
    styles, uploads, canCancel, cancelUpload, retryUpload, removeUpload
}) => {
    const activeUploads = uploads.filter(f => f.phase !== 'done');
    if (activeUploads.length === 0) return null;

    return (
        <div className={styles?.['uploadsSection']}>
            <div className={styles?.['uploadsHeader']}>Uploads ({activeUploads.length})</div>
            {activeUploads.map((file) => (
                <UploadFileCard
                    key={file.jobId}
                    styles={styles}
                    file={file}
                    canCancel={canCancel}
                    cancelUpload={cancelUpload}
                    retryUpload={retryUpload}
                    removeUpload={removeUpload}
                />
            ))}
        </div>
    );
};

const TrainedDocuments: React.FC<TrainedDocumentsProps> = ({ styles, documentList, switchTab }) => {
    const [openMenu, setOpenMenu] = useState<number | null>(null);

    return (
        <>
            <div className={styles?.['Divider']} />
            <div className={styles?.['UploaderHeader']}>Trained Documents</div>
            <div className={styles?.['DataContainer']}>
                {documentList?.filter(d => d.phase == "done").map((document, index) => (
                    <div key={index} className={styles?.['fileCard']}>
                        <div className={styles?.['fileCardTop']}>
                            <div className={styles?.['fileIcon']}>
                                <FileTextIcon size={22} stroke="#10b981" />
                            </div>
                            <div className={styles?.['fileMeta']}>
                                <div className={styles?.['fileName']}>{document?.name || document?.jobId}</div>
                            </div>
                            <span className={styles?.['fileDoneLabel']}>✓ Done</span>
                            
                            {/* More Button */}
                            <div style={{ position: 'relative', marginLeft: '8px' }}>
                                <button
                                    onClick={() => setOpenMenu(openMenu === index ? null : index)}
                                    style={{
                                        border: 'none',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                    }}
                                >
                                    <MoreVertical size={18} />
                                </button>

                                {openMenu === index && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            right: 0,
                                            top: '100%',
                                            background: '#fff',
                                            border: '1px solid #ddd',
                                            borderRadius: '6px',
                                            boxShadow:
                                                '0 2px 8px rgba(0,0,0,0.1)',
                                            zIndex: 100,
                                            minWidth: '140px',
                                        }}
                                    >
                                        <button
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                textAlign: 'left',
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => {
                                                switchTab('documentTree', document?.graphId);
                                                setOpenMenu(null);
                                            }}
                                        >
                                            View Tree
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles?.['fileProgressBg']}>
                            <div className={`${styles?.['fileProgressFill']} ${styles?.['fileProgressDone']}`} style={{ width: '100%' }} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export const SidePanel: React.FC<SideDrawerProps> = ({ open, setOpen, switchTab }) => {
    const { JSModule, styles } = useContext(ThemeContext);
    const {
        documentList, setDocumentList, uploads, selectedFileType, setTrainingInProgress,
        handleFileChange, handleFileDrop, cancelUpload, retryUpload, removeUpload, canCancel
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

            <UploadDropZone
                styles={styles}
                dragOver={dragOver}
                setDragOver={setDragOver}
                handleFileDrop={handleFileDrop}
                handleFileChange={handleFileChange}
                fileInputRef={fileInputRef}
            />

            <UploadsSection
                styles={styles}
                uploads={uploads}
                canCancel={canCancel}
                cancelUpload={cancelUpload}
                retryUpload={retryUpload}
                removeUpload={removeUpload}
            />

            <TrainedDocuments switchTab={switchTab} styles={styles} documentList={documentList} />
            <ToastContainer />
        </div>
    );
};
