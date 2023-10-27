export const getTitle = () => "Document ChatBot";
export const getWelcomeMessage = () => "I am a Assistant. I'll assist you with any queries related to documents";
export const getInputPlaceholder = () => "How can I assist you today?";
export const start = async (handler, question) => {
    const response = await handler.chain.run(question)
    return response
} 