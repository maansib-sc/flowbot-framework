import { cloneChatbot } from '@/apiRequests';
import React, { useState } from 'react';


const CloneChatbot = ({ id, onClose }: { id: string, onClose: (id: string) => void }) => {
    const [chatBotId, setChatBotId] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await cloneChatbot(id, chatBotId)
        onClose("created")
    }

    return (
        <form className="m-8 space-y-3" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 space-y-2 mb-4">
                <label className="text-sm font-bold text-gray-500 tracking-wide mb-2">{"Chatbot Id"}</label>
                <input
                    className="rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    type="text"
                    placeholder={"Enter the chatbot Id"}
                    value={chatBotId}
                    onChange={(e) => setChatBotId(e.target.value)}
                />
            </div>
            <button
                type='submit'
                style={{cursor: chatBotId ? "pointer": "not-allowed"}}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            >
                Submit
            </button>
        </form>
    )

}

export default CloneChatbot