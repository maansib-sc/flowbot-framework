import React from 'react';

export interface SideDrawerProps {
    open: boolean;
    setOpen: (val: boolean) => void;
}

export interface UploadDropZoneProps {
    styles: any;
    dragOver: boolean;
    setDragOver: (val: boolean) => void;
    handleFileDrop: (files: FileList) => void;
    handlePDFFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

export interface UploadFileCardProps {
    styles: any;
    file: any;
    canCancel: (name: string) => boolean;
    cancelUpload: (name: string) => void;
    retryUpload: (name: string) => void;
    removeUpload: (name: string) => void;
}

export interface UploadsSectionProps {
    styles: any;
    uploads: any[];
    canCancel: (name: string) => boolean;
    cancelUpload: (name: string) => void;
    retryUpload: (name: string) => void;
    removeUpload: (name: string) => void;
}

export interface TrainedDocumentsProps {
    styles: any;
    pdfList: any[];
}
