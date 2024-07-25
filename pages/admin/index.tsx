import React, { useState, useEffect } from 'react';
import TrashIcon from '@/assets/svgs/TrashIcon';
import { deleteChatbot, getChatbots } from '@/apiRequests';
import { LiveChatbot } from '@/types/chat';
import CustomModal from '@/components/ui/customModal';
import {useRouter} from 'next/router';

const AdminPage: React.FC = () => {

    const [liveChatbots, setLiveChatbots] = useState<LiveChatbot[] | null>(null);
    const [modalStatus, setModalStatus] = useState(false);
    const [deleteChatbotKey, setDeleteChatbotKey] = useState<string>('');
    const router = useRouter();
    const { key } = router.query;


    const fetchLiveChatbots = async () => {
        let allChatbots = await getChatbots()
        setLiveChatbots(allChatbots)
    }

    useEffect(() => {
        fetchLiveChatbots()
    }, [])

    const deleteLiveChatbot = async (Id?: string) => {
        if (Id) {
            await deleteChatbot(Id)
            await fetchLiveChatbots()
        }
        setModalStatus(false)
        setDeleteChatbotKey('')
    }

    return (
        <>
            {key !== process.env.NEXT_PUBLIC_ADMIN_KEY ? (
                <div className='m-8 flex justify-center items-center h-screen'>
                    <h1>You don't have access of this page <br/> Please contact admin for access. </h1>
                </div>
            ) : (
                <div className='m-6'>
                    <div className='flex justify-between  mb-12'>
                        <div className='flex gap-x-2'>
                            <h1 className='text-red-500 font-bold'>* Live</h1>
                            <h1 className='font-bold'>Chatbots</h1>
                        </div>
                        <div>
                            <button
                                className='px-4 py-2 bg-green-500 text-white rounded'
                                onClick={() => router.push('/admin/upload')}
                            >
                                Create new Chatbot
                            </button>
                        </div>

                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                        {liveChatbots?.map((item, index) => (
                            <div
                                key={index + 1}
                                className="relative max-w-sm bg-white shadow-lg rounded-lg overflow-hidden h-24 hover:shadow-xl"
                            >
                                <button
                                    className="mr-4 p-4 h-full flex flex-col justify-center items-center"
                                    onClick={() => window.open(item?.url, '_blank')}
                                >
                                    <h2 className="text-xl font-bold text-gray-800">{item?.file}</h2>
                                </button>
                                <button
                                    onClick={() => {
                                        setModalStatus(true)
                                        setDeleteChatbotKey(item?.file)
                                    }}
                                    className="absolute top-2 right-2 text-gray-500 focus:outline-none hover:bg-gray-200 rounded p-1"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        )
                        )}
                        {modalStatus && <CustomModal id={deleteChatbotKey} title={`Do you want to delete chatbot - ${deleteChatbotKey}?`} status={modalStatus} onClose={deleteLiveChatbot} />}
                    </div>
                </div>
            )}
        </>
    )

}


export default AdminPage;