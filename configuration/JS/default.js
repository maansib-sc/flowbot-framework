export const getTitle = "Professional Sign-up Channel";
export const getWelcomeMessage = "I am a Assistant. I'll assist you with any queries related to documents";
export const getInputPlaceholder = "Write Message";
export const ChatBotStep = [
    {

        "question": "Welcome to beginAProject",
        "id": 0,
        "fullWidth": true,
        "title": "Registeration with Libby",
        "description": "Libby will guide you through the registration process and willanswer any questions that you have. If you experience anyplatform issues during the registration process, click the “Chatwith Platform Support” button on the top right of the channelduring the sign-up process."
    },
    {
        "id": 1,
        "question": "What is your first Name and last Name",
        "inputType": "text",
        "options":[]
    },
    {
        "id": 2, 
        "question": "So, would you like to register using using your Google log-in ?",
        "inputType": "radioButton",
        "options": [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' }
        ]
    },
    {
        "id": 3,
        "question": "What is your email address",
        "inputType": "text",
        "options":[]
    },
    {
        "id": 4,
        "question": "Please enter your mobile number",
        "inputType": "text",
        "options":[]
    },
    {
        "id": 5,
        "question": "Please enter your preferred password. It must contain letters, numbers and symbols. It is required to have at least one letter, one number and one symbol.",
        "inputType": "password",
        "options":[]
    }
];
export const finalMessage = "Thanks for the provided information"
export const conversational = true
export const start = async (handler, question) => {
    if (conversational) {
        const answ = ChatBotStep[handler.user.lastStep]
        if (answ === undefined) return { "text": finalMessage, "src": "talkingDb" };
        if (answ.id === 1) return { "text": answ.question, "src": "talkingDb" }
        if (answ.callApi) {
            try {
                const response = await handler.axiosInstance.request(answ.apiOptions);
                return { "text": `${answ.question} - ${response.data.map((item) => item.name)}`, "src": "talkingDb" };
            } catch (error) {
                console.error(error);
            }
        }
        return { "text": answ.question, "src": "talkingDb" };
    } else {
        const response = await handler.chain.run(question)
        return response
    }
} 