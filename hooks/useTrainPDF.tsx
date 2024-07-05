import { useContext, useEffect, useState } from 'react';
import ThemeContext from '@/contexts/ThemeContext';
import config from '@/config/constants';
import { useRouter } from 'next/router';


export const useTainPDF = () => {

    const router = useRouter();
    const { JSModule } = useContext(ThemeContext);
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
        const fetchData = async (chatbotUrl: string, apiKey: string) => {
            try {
                const response = await fetch(`${config.NEXT_PUBLIC_BACKEND_CONNECTOR_HOST}/${chatbotUrl}${chatId}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'API-KEY': config.NEXT_PUBLIC_BACKEND_CONNECTOR_KEY
                    }
                });
                const jsonData = await response.json();
                console.log("data response::::::", jsonData.data)
                setChatbots(jsonData.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const uploadPDFFile = async (uploadUrl: string, apiKey: string) => {
            setUploading(true);
            const FormData = require('form-data');
            let data = new FormData();
            data.append('file', selecteduploadFile);

            try {
                const response = await fetch(`${config.NEXT_PUBLIC_BACKEND_CONNECTOR_HOST}/${uploadUrl}${chatId}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'API-KEY': config.NEXT_PUBLIC_BACKEND_CONNECTOR_KEY
                    },
                    body: data
                });
                const jsonData = await response.json();
                fetchData(JSModule?.trainedChatbotUrl as string, JSModule?.trainedChatbotAPIKey as string);
            } catch (error) {
                console.log(error);
            } finally {
                setUploading(false);
            }
        }

        if (JSModule?.documentUploadUrl && selecteduploadFile && chatId) {
            console.log("inside upload call:::::")
            uploadPDFFile(JSModule?.documentUploadUrl as string, JSModule?.trainedChatbotAPIKey as string);
        }
    }, [selecteduploadFile])


    return {
        pdfList,
        chatbots,
        selectedFileType,
        uploading,
        setTrainingInProgress,
        handlePDFFileChange
    };
}