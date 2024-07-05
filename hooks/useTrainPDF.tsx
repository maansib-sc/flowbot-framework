import React, { useState } from 'react';


export const useTainPDF = () => {

    const [pdfList, setPdfList] = useState<
        { name?: string; training_id?: string; is_trained: boolean }[]
    >([]);
    const [showLoader, setShowLoader] = useState<boolean>(false);
    const [selectedFileType, setSelectedFileType] = useState<string>('PDF');
    const [selecteduploadFile, setSelecteduploadFile] = useState<File | null>(
        null,
    );
    const [trainingInProgress, setTrainingInProgress] = useState(false);



    // Function to handle PDFfile upload
    const handlePDFFileChange = (e: any) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setPdfList((prevList: any) => [...prevList, { name: selectedFile.name, is_trained: false }])
            setShowLoader(true);
            setSelectedFileType('PDF');
            setSelecteduploadFile(selectedFile);
            setTrainingInProgress(true);
        }
    };


    return {
        handlePDFFileChange
    };
}