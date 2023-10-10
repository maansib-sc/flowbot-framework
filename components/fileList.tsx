import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { pdfFileProgress, whatsAppFileProgress } from '@/apiRequests';

export default function FileList({ selectedFileType, filename, index, trained, setTrainingInProgress
}: { selectedFileType: string, filename: string | undefined, index: number, trained: boolean, setTrainingInProgress: (value: boolean) => void }) {
    const router = useRouter();
    const { query: { 'chat-id': chatId } } = router


    const [progress, setProgress] = useState(trained ? 100 : 0);

    async function pdfProgress() {
        if (filename) {
            try {
                const response = await pdfFileProgress(filename)
                if (response) {
                    setProgress(Math.ceil(Number(response.data.data.replace(/%/g, ""))))
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

    async function trainAI() {
        try {
            const response = await axios.get(`https://${process.env.NEXT_PUBLIC_BACKEND_CONNECTOR_HOST}/chatbot/train?chatbot_id=${chatId}`, {
                headers: {
                    'API-KEY': process.env.NEXT_PUBLIC_BACKEND_CONNECTOR_KEY || "",
                },
            });
            setTrainingInProgress(false)

        } catch (error) {
            console.log(error);
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
                    trainAI()
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
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 50 50">
                        <path d="M 7 2 L 7 48 L 43 48 L 43 14.59375 L 42.71875 14.28125 L 30.71875 2.28125 L 30.40625 2 Z M 9 4 L 29 4 L 29 16 L 41 16 L 41 46 L 9 46 Z M 31 5.4375 L 39.5625 14 L 31 14 Z M 15 22 L 15 24 L 35 24 L 35 22 Z M 15 28 L 15 30 L 31 30 L 31 28 Z M 15 34 L 15 36 L 35 36 L 35 34 Z"></path>
                    </svg>
                    <div className='flex flex-col  ml-2 w-full'>

                        <span className=" font-semibold text-lg w-56 truncate">{filename}</span>
                        {
                            progress !== 100 ?
                                <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                                    <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${progress}%` }}> {progress}%</div>
                                </div> :
                                null

                        }
                        <p className="text-gray-700">{progress === 100 ? "AI Trained" : "Training AI ..."}</p>
                    </div>
                </div>
            </li >
        </ul >
    );
}
