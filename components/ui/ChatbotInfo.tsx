import { deletePDFList, getDefaultPromptTemplate, deleteConvList, getPDFList, getConvList, uploadPDF, uploadConv } from '@/apiRequests';
import styles from '@/custom/CSSFile/default/Home.module.css';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import FileList from '../fileList';
import { Oval } from 'react-loader-spinner'

const ChatbotInfo = ({
    chatBotId
}: {
    chatBotId: string;
}) => {

    const [trainingInProgress, setTrainingInProgress] = useState(false);
    const [showLoader, setShowLoader] = useState<boolean>(false)
    const [selectedFileType, setSelectedFileType] = useState<string>("PDF")
    const [selecteduploadFile, setSelecteduploadFile] = useState<File | null>(null);
    const [pdfList, setPdfList] = useState<{ name?: string; training_id?: string; is_trained: boolean }[]>([]);
    const [selectedConvUploadFile, setSelectedConvUploadFile] = useState<FileList | null>(null);
    const [uploading, setUploading] = useState(false);


    const fileInputRef = useRef(null);

    const handlePDFFileChange = (e: any) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setShowLoader(true);
            setSelectedFileType('PDF')
            setSelecteduploadFile(selectedFile)
            setTrainingInProgress(true)
        }
    };

    async function fetchPdfList() {
        try {
            setPdfList([])
            const pdfData = await getPDFList(chatBotId)
            const conList = await getConvList(chatBotId)
            setPdfList([...pdfData, ...conList]);
            setSelecteduploadFile(null)
        } catch (error) {
            console.log(error);
        }
    }

    async function clearAllPdfList() {
        setShowLoader(true);
        setPdfList([])
        await handleUntrain()
        await handleDeleteNameSpace()
    }

    async function handleUntrain() {
        try {
            await deletePDFList(chatBotId)
            // Call the fetchPdfList function here
            await fetchPdfList();
        } catch (error) {
            console.log(error);
        } finally {
            setShowLoader(false)
        }
    }

    async function handleDeleteNameSpace() {
        try {
            await deleteConvList(chatBotId)
            // Call the fetchPdfList function here
            await fetchPdfList();
        } catch (error) {
            console.log(error);
        } finally {
            setShowLoader(false)
        }
    }
    // JS file change

    const handleJSFileChange = async (event: any) => {
        const file = event.target.files[0];
        try {
            const data = new FormData()
            data.set('chatBotId', chatBotId)
            data.set('file', file)

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data
            })
        } catch (error) {
            console.log("error from handleJSFileChange ==> ", error)
        }
    };


    async function uploadPDFFile() {
        setUploading(true);
        const FormData = require('form-data');
        let data = new FormData();
        data.append('file', selecteduploadFile);

        try {
            await uploadPDF(chatBotId, data)
            // console.log("upload file response ==>", response.data);
            setTimeout(async () => {
                await fetchPdfList();
                setShowLoader(false)
            }, 2000)
        } catch (error) {
            console.log(error);
        } finally {
            setUploading(false); // Training process complete
        }
    }

    async function uploadConvToApi() {
        setUploading(true);
        setShowLoader(true)
        const FormData = require('form-data');

        let data = new FormData();
        if (selectedConvUploadFile) {

            [...selectedConvUploadFile].forEach((file, i) => {
                data.append(`training_files`, file, file.name)
            })
        }

        try {
            await uploadConv(chatBotId, data)
            setSelectedConvUploadFile(null);
            setTimeout(async () => {
                await fetchPdfList();
                setShowLoader(false)
            }, 2000)
        } catch (error) {
            console.log(error);
        } finally {
            setUploading(false); // Training process complete
        }
    }

    useEffect(() => {
        if (selectedFileType === "PDF" && selecteduploadFile) {
            uploadPDFFile()
        } else if (selectedFileType === "WHATSAPP" && selectedConvUploadFile) {
            uploadConvToApi()
        }
    }, [selectedFileType, selecteduploadFile, selectedConvUploadFile])


    useEffect(() => {
        fetchPdfList()
    }, [chatBotId])


    return (
        <div style={{ padding: "1rem", display: "flex", flexDirection: "column", maxWidth: "355px" }}>
            <h1 className={styles.title}>TRAIN AI</h1>
            <p>from the options below.</p>
            <div className="mt-4 mb-4 flex flex-col">
                <div className='flex mb-6'>

                    <label className="w-64 flex justify-between items-center px-2 py-2 text-blue rounded-lg  tracking-wide  border border-blue  cursor-pointer">
                        <input type='file' accept='.pdf' className="hidden" onChange={handlePDFFileChange} ref={fileInputRef} />
                        <span className="mt-2 text-base leading-normal">Upload a Doc</span>
                        <svg className="w-8 h-8 pt-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                        </svg>
                    </label>
                    <label className="w-64 flex justify-between  ml-2 items-center px-2 py-2 text-blue rounded-lg  tracking-wide  border border-blue  cursor-pointer">
                        <input type='file' className="hidden" accept='.txt' placeholder={"Upload conv."} onChange={(e) => { setSelectedConvUploadFile(e.target.files); setSelectedFileType("WHATSAPP") }} multiple />
                        <span className="mt-2 text-base leading-normal">Upload Conv.</span>
                        <svg className="w-8 h-8 pt-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                        </svg>
                    </label>
                </div>
                <div className='flex'>

                    <label className="w-64 flex justify-between items-center px-2 py-2 text-blue rounded-lg  tracking-wide  border border-blue  ">
                        <input type="file" accept='.js' className="hidden" onChange={handleJSFileChange} />
                        <span className="mt-2 text-base leading-normal">Upload JS</span>
                        <svg className="w-8 h-8 pt-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                        </svg>
                    </label>
                    <label className="w-64 flex justify-between  ml-2 items-center px-2 py-2 text-blue rounded-lg  tracking-wide  border border-blue  ">
                        <input type="file" accept='.css' className="hidden" onChange={handleJSFileChange} />
                        <span className="mt-2 text-base leading-normal">Upload CSS</span>
                        <svg className="w-8 h-8 pt-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                        </svg>
                    </label>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", borderTop: "1px solid black", paddingTop: "2rem" }} className='mt-10'>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%"
                }}>

                    <h1 className={styles.title}>Uploaded Doc</h1>
                    {pdfList.length !== 0 && !trainingInProgress
                        ?
                        <p onClick={() => clearAllPdfList()} className='cursor-pointer font-semibold '>Clear All</p>
                        :
                        <p className='font-semibold text-gray-400'>Clear All</p>
                    }
                </div>
                <div style={{
                    display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", height: "100%",
                    minHeight: "250px"
                }}>
                    {
                        pdfList?.length > 0 && !showLoader ?

                            <div style={{ width: "100%" }}>
                                {
                                    pdfList.map((item, index) => {
                                        return (
                                            <FileList selectedFileType={selectedFileType} filename={item.name || item.training_id} index={index} trained={item.is_trained} setTrainingInProgress={setTrainingInProgress} />
                                        )
                                    }
                                    )
                                }
                            </div>
                            :
                            showLoader ?
                                <div style={{ display: "flex", width: "100%", height: "100%", justifyContent: "center", position: "absolute", top: "50%" }}>
                                    <Oval
                                        height={40}
                                        width={40}
                                        color="#338bff"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                        visible={true}
                                        ariaLabel='oval-loading'
                                        secondaryColor="#338bff"
                                        strokeWidth={4}
                                        strokeWidthSecondary={4}

                                    />
                                </div>
                                :
                                <>
                                    <Image
                                        src="/pdf_upload.png"
                                        alt="AI"
                                        width="55"
                                        height="55"
                                        priority
                                        className='mt-2'
                                    />
                                    <div className='p-8'>Please upload a Doc to train the AI automatically</div>
                                </>
                    }

                </div>

            </div>
        </div>
    );
};

export default ChatbotInfo;

