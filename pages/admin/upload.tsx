import React, { useState } from "react";
import CreateChatbot from "@/modules/CreateChatbot";
import Leftarrow from "@/assets/svgs/Leftarrow";
import UploadIcon from "@/assets/svgs/UploadIcon";

const uploadTypes = ["Upload ZIP", "Upload CSS", "Upload JS"]
const config = [
    {
        title: "Upload configuration zip file",
        description: "",
        submitButtonText: "Upload",
        allowedFileType: ['application/zip', 'application/x-zip-compressed'],
        inputList: [{ label: "Chatbot Id", placeholder: "Enter chatbot Id to create", type: 'input' }]
    },
    {
        title: "Upload configuration css file",
        description: "",
        submitButtonText: "Upload",
        allowedFileType: ['text/css'],
        inputList: [{ label: "Chatbot Id", placeholder: "Enter chatbot Id to update", type: 'input' }]
    },
    {
        title: "Upload configuration js file",
        description: "",
        submitButtonText: "Upload",
        allowedFileType: ['text/javascript'],
        inputList: [
            { label: "Chatbot Id", placeholder: "Enter chatbot Id to update", type: 'input' },
            { label: "File location", placeholder: "Select file location", type: 'radioGroup', data: ["Server", "WebApp"] }
        ]
    }
];

const UploadConfig = () => {
    const [selectedIndex, setSelectedIndex] = useState<null | number>(0)
    const selectedConfig = selectedIndex !== null ? config[selectedIndex] : config[0];
    return (
        <div className="m-6">
            <button className="flex gap-2"  onClick={() => window.history.back()}>
                <Leftarrow />
                <span className="mb-16 font-bold">Back</span>
            </button>
            
            <div className="flex flex-wrap justify-center items-center w-full mb-6 gap-8">
                {uploadTypes?.map((item, index) => (
                    <div
                        key={index + 1}
                        className="relative text-white max-w-sm bg-white shadow-lg rounded-lg overflow-hidden h-24 hover:shadow-xl"
                        style={{ border: selectedIndex === index ? '2px solid black' : 'none', backgroundColor: '#CFDDFC' }}
                    >
                        <button
                            className="mr-4 p-4 h-full flex justify-center items-center gap-4"
                            onClick={() => setSelectedIndex(index)}
                        >
                            <UploadIcon />
                            <h2 className="text-xl font-bold text-gray-800">{item}</h2>
                        </button>
                    </div>
                )
                )}
            </div>
            {
                selectedConfig ? (
                    <CreateChatbot
                        title={selectedConfig.title}
                        description={selectedConfig.description}
                        submitButtonText={selectedConfig.submitButtonText}
                        allowedFileType={selectedConfig.allowedFileType}
                        inputList={selectedConfig.inputList}
                    />
                ) : (
                    <div>
                        <p>Select Upload Type</p>
                    </div>
                )
            }
        </div>
    )
}

export default UploadConfig