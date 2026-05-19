import React, { useContext, useRef } from "react";
import { useRouter } from 'next/router';
import { Loader } from "@/components/ui";
import ThemeContext from "@/contexts/ThemeContext";
import { useTainPDF } from "@/hooks/useTrainPDF";
import FileList from "@/modules/File";
import config from '@/config/constants';
import { getPDFList, deleteDocument } from "@/apiRequests";
import UploadIcon from '@/assets/svgs/UploadIcon';
import FileTextIcon from '@/assets/svgs/FileTextIcon';
import TrashIcon from '@/assets/svgs/TrashIcon';


interface SideDrawerProps {
    open: boolean;
    setOpen: (val: boolean) => void;
}

export const SidePanel: React.FC<SideDrawerProps> = ({ open }) => {
    const { JSModule, styles } = useContext(ThemeContext);
    const { pdfList, setPdfList, uploading, selectedFileType, setTrainingInProgress, handlePDFFileChange } = useTainPDF();
    const router = useRouter();
    const { 'chat-id': chatId } = router.query;
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    if (!JSModule?.drawerEnabled || !open) return null;

    return (
        <div className={styles?.['HamburgerContainer']}>
            <div className={styles?.['HamburgerHeaderContainer']}>
                <div className={styles?.['HamburgerHeader']}>Documents</div>
                <span>{pdfList?.length || 0} trained</span>
            </div>

            <div className={styles?.['UploadContainer']}>
                {!uploading ? (
                    <label className={styles?.['uploadButton']}>
                        <input
                            type="file"
                            accept=".pdf,.docx,.txt"
                            onChange={handlePDFFileChange}
                            ref={fileInputRef}
                            className="hidden"
                        />
                        <UploadIcon size={20} stroke="#2563eb" />
                        <span>Click to upload</span>
                        <span>PDF, DOCX, TXT</span>
                    </label>
                ) : (
                    <Loader loader="https://lottie.host/d1fd738a-f930-465e-b6ff-cf2412f791db/8r36ZWTWb2.json" />
                )}
            </div>

            <div className={styles?.['Divider']} />
            <div className={styles?.['UploaderHeader']}>Trained Documents</div>

            <div className={styles?.['DataContainer']}>
                {pdfList?.map((document, index) => (
                    <div key={index} className={styles?.['DataItem']}>
                        <FileTextIcon size={20} stroke="#6b7280" />
                        <span>{document?.name || document?.training_id}</span>
                        <div className={styles?.['IconContainer']} onClick={() => handleDeleteDocument(document?.name!)}>
                            <TrashIcon size={16} stroke="#ef4444" />
                        </div>
                    </div>
                ))}
            </div>

            {pdfList?.map((item, index) => (
                <FileList
                    key={index}
                    selectedFileType={selectedFileType}
                    filename={item.name ?? item.training_id}
                    index={index}
                    progressUrl={JSModule?.trainedChatbotProgressUrl}
                    apiKey={config.NEXT_PUBLIC_BACKEND_CONNECTOR_KEY}
                    trained={item.is_trained || false}
                    setTrainingInProgress={setTrainingInProgress}
                />
            ))}
        </div>
    );
};

