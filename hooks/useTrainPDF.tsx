import { useContext, useEffect, useState } from 'react';
import { getPDFList, uploadPDF } from '@/apiRequests';
import ThemeContext from '@/contexts/ThemeContext';
import { useRouter } from 'next/router';


export const useTainPDF = () => {

    const router = useRouter();
    const [pdfList, setPdfList] = useState<
        { name?: string; training_id?: string; is_trained: boolean }[]
    >([]);
    const [selectedFileType, setSelectedFileType] = useState<string>('PDF');
    const [selecteduploadFile, setSelecteduploadFile] = useState<File | null>(
        null,
    );
    const [chatbots, setChatbots] = useState([])
    const [trainingInProgress, setTrainingInProgress] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { 'chat-id': chatId } = router.query;


    useEffect(() => {
        const fetchDocuments = async () => {
            const response = await getPDFList(chatId)
            if (response) {
                setPdfList(response)
            }
        }
        fetchDocuments()
    }, [chatId])

    // Function to handle PDFfile upload
    const handlePDFFileChange = (e: any) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setPdfList((prevList: any) => [...prevList, { name: selectedFile.name, is_trained: false }])
            setSelectedFileType('PDF');
            setSelecteduploadFile(selectedFile);
            setTrainingInProgress(true);
        }
    };

    useEffect(() => {
        const uploadPDFFile = async () => {
            setUploading(true);
            const FormData = require('form-data');
            let data = new FormData();
            data.append('file', selecteduploadFile);

            try {
                await uploadPDF(chatId, data);
            } catch (error) {
                console.log(error);
            } finally {
                setUploading(false);
            }
        }

        if (selecteduploadFile && chatId) {
            uploadPDFFile();
        }
    }, [selecteduploadFile])


    return {
        pdfList,
        setPdfList,
        chatbots,
        selectedFileType,
        uploading,
        setTrainingInProgress,
        handlePDFFileChange
    };
}