import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PdfIcon from '@/assets/svgs/PdfIcon';
import config from '@/config/constants';

export default function FileList({ selectedFileType, progressUrl, apiKey, filename, index, trained, setTrainingInProgress
}: { selectedFileType: string, progressUrl: string, apiKey: string, filename: string | undefined, index: number, trained: boolean, setTrainingInProgress: (value: boolean) => void  }) {
    const router = useRouter();
    const { query: { 'chat-id': chatId } } = router


    const [progress, setProgress] = useState(trained ? 100 : 0);
    const [is_shallow_trained, setIs_Shallow_Trained] = useState(false);
    const [is_trained, setIs_Trained] = useState(false);

    async function pdfProgress() {
        if (filename) {

            try {
                const response = await fetch(`${config.NEXT_PUBLIC_BACKEND_CONNECTOR_HOST}/${progressUrl}${filename}`, {
                    method: 'GET',
                    headers: {
                      'Accept': 'application/json',
                      'API-KEY': apiKey
                    },
                  });
                  
                  if (response) {
                    const responseJson = await response.json()
                    if ( typeof responseJson?.data?.deep === "string") {
                        setProgress(() => Math.ceil(Number(responseJson.data.deep.replace(/%/g, ""))))
                        let deepdataProgress = Math.ceil(Number(responseJson.data.deep.replace(/%/g, "")))

                        if (deepdataProgress === 100) {
                            setTimeout(() => {
                                setIs_Trained(true)
                            }, 10000)
                        }
                    }
                    if (typeof responseJson?.data?.shallow === "string") {
                        let shallowdataProgress = Math.ceil(Number(responseJson.data.shallow.replace(/%/g, "")))
                        if (shallowdataProgress === 100) {
                            setTimeout(() => {
                                setIs_Shallow_Trained(true)
                            }, 10000)
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        if (selectedFileType === "PDF" && !trained && progress !== 100) {
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
    }, [progress, selectedFileType]);
    if (progress !== 100) {
        return (
            <ul className="bg-white rounded-lg shadow divide-y divide-gray-200 max-w-sm mt-2">
                <li className="px-6 py-4">
                    <div className="flex w-full">
                        <div>
                            <PdfIcon />
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
    else{
        return null
    }
    
}
