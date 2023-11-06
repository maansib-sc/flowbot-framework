import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { pdfFileProgress, whatsAppFileProgress } from '@/apiRequests';

export default function FileList({ selectedFileType, filename, index, trained, setTrainingInProgress
}: { selectedFileType: string, filename: string | undefined, index: number, trained: boolean, setTrainingInProgress: (value: boolean) => void }) {
    const router = useRouter();
    const { query: { 'chat-id': chatId } } = router


    const [progress, setProgress] = useState(trained ? 100 : 0);
    const [is_shallow_trained, setIs_Shallow_Trained] = useState(false);
    const [is_trained, setIs_Trained] = useState(false);

    async function pdfProgress() {
        if (filename) {
            try {
                const response = await pdfFileProgress(filename)
                if (response) {
                    setProgress(Math.ceil(Number(response.data.data.deep.replace(/%/g, ""))))
                    let deepdataProgress = Math.ceil(Number(response.data.data.deep.replace(/%/g, "")))
                    let shallowdataProgress = Math.ceil(Number(response.data.data.shallow.replace(/%/g, "")))
                    if (deepdataProgress === 100) {
                        setTimeout(() => {
                            setIs_Trained(true)
                        }, 10000)
                    }
                    if (shallowdataProgress === 100) {
                        setTimeout(() => {
                            setIs_Shallow_Trained(true)
                        }, 10000)
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    async function ConvProgress() {
        if (filename) {
            try {
                const response = await whatsAppFileProgress(filename)
                if (response) {
                    setProgress(Math.ceil(Number(response.data)))
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        if (selectedFileType === "PDF") {
            if (!trained && progress !== 100) {
                let interval: any;
                if (progress < 100) {
                    interval = setInterval(() => {
                        pdfProgress()
                    }, 1200); // 1200 milliseconds (2 minutes divided by 100 steps)
                }

                return () => {
                    clearInterval(interval);
                };
            }

            if (!trained && progress === 100) {
                setTimeout(() => {
                    setTrainingInProgress(false)
                }, 5000);
            }
        } else if (selectedFileType === "WHATSAPP") {
            if (progress !== 100) {
                let interval: any;
                if (progress < 100) {
                    interval = setInterval(() => {
                        ConvProgress()
                    }, 1200); // 1200 milliseconds (2 minutes divided by 100 steps)
                }

                return () => {
                    clearInterval(interval);
                };
            }
            if (!trained && progress === 100) {
                setTrainingInProgress(false)
            }
        }
    }, [progress, selectedFileType]);
    return (
        <ul className="bg-white rounded-lg shadow divide-y divide-gray-200 max-w-sm mt-2">
            <li className="px-6 py-4">
                <div className="flex w-full">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 50 50">
                            <path d="M 7 2 L 7 48 L 43 48 L 43 14.59375 L 42.71875 14.28125 L 30.71875 2.28125 L 30.40625 2 Z M 9 4 L 29 4 L 29 16 L 41 16 L 41 46 L 9 46 Z M 31 5.4375 L 39.5625 14 L 31 14 Z M 15 22 L 15 24 L 35 24 L 35 22 Z M 15 28 L 15 30 L 31 30 L 31 28 Z M 15 34 L 15 36 L 35 36 L 35 34 Z"></path>
                        </svg>
                    </div>
                    <div className='flex flex-col  ml-2 ' style={{ width: "230px" }}>

                        <span className=" font-semibold text-lg w-56 truncate">{filename}</span>
                        <div className='flex  ml-2 w-full mt-2 mb-2'>
                            <ol className="flex items-center w-full text-xs font-medium text-center text-gray-500 dark:text-gray-400 xs:text-base">
                                <li className={`flex md:w-full items-center ${is_shallow_trained ? "text-blue-600 dark:text-blue-500" : ""} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}>
                                    <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        Shallow Trained
                                    </span>
                                </li>
                                <li className={`${is_trained ? "text-blue-600 dark:text-blue-500 " : ""}flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-70`}>
                                    <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                        Deep Trained
                                    </span>
                                </li>
                            </ol>

                        </div>

                        {
                            progress !== 100 ?
                                <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                                    <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${progress}%` }}> {progress}%</div>
                                </div> :
                                null

                        }

                        {/* <p className="text-gray-700">{progress === 100 ? "AI Trained" : "Training AI ..."}</p> */}
                    </div>
                </div>
            </li >
        </ul >
    );
}
