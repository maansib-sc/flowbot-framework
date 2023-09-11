import styles from '@/styles/Home.module.css';
import { useState, useEffect } from 'react';

export default function FileList({ filename, removefilefromfileList, index
}: { filename: string, removefilefromfileList: (index: number) => void, index: number }) {


    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval: any;
        if (progress < 100) {
            interval = setInterval(() => {
                setProgress(prevProgress => prevProgress + 1);
            }, 100); // 1200 milliseconds (2 minutes divided by 100 steps)
        }

        return () => {
            clearInterval(interval);
        };
    }, [progress]);
    return (
        <ul className="bg-white rounded-lg shadow divide-y divide-gray-200 max-w-sm mt-2">
            <li className="px-6 py-4">
                <div className="flex justify-between">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 50 50">
                        <path d="M 7 2 L 7 48 L 43 48 L 43 14.59375 L 42.71875 14.28125 L 30.71875 2.28125 L 30.40625 2 Z M 9 4 L 29 4 L 29 16 L 41 16 L 41 46 L 9 46 Z M 31 5.4375 L 39.5625 14 L 31 14 Z M 15 22 L 15 24 L 35 24 L 35 22 Z M 15 28 L 15 30 L 31 30 L 31 28 Z M 15 34 L 15 36 L 35 36 L 35 34 Z"></path>
                    </svg>
                    <div className='flex flex-col items-center'>

                        <span className="font-semibold text-lg">{filename}</span>
                        {
                            progress !== 100 ?
                                <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                                    <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${progress}%` }}> {progress}%</div>
                                </div> :
                                null

                        }
                        <p className="text-gray-700">{progress === 100 ? "AI Trained" : "Taining AI ..."}</p>
                    </div>
                    <span className="text-gray-500 text-xs"><button className={styles.crossiconButton} onClick={() => removefilefromfileList(index)}  >
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={styles.crossicon}><path fillRule="evenodd" clipRule="evenodd" d="M6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793Z"></path></svg>
                    </button></span>
                </div>
            </li>
        </ul>
    );
}
