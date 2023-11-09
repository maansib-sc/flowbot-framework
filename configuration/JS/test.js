export const getTitle = "Professional Sign-up Channel";
export const getWelcomeMessage = "I am a Assistant. I'll assist you with any queries related to documents";
export const getInputPlaceholder = "Write Message";
export const Navbar = true;
export const botName = "Libby";
export const testProject = true;
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
        "header": {
            "step": "1",
            "text": "Contact Information"
        },
        "inputType": "text",
        "options": []
    },
    {
        "id": 2,
        "question": "So, would you like to register using using your Google log-in ?",
        "inputType": "googleLogin",
        "options": [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' }
        ],
        "default": "Yes"
    },
    {
        "id": 3,
        "question": "What is your email address",
        "inputType": "text",
        "options": []
    },
    {
        "id": 4,
        "question": "Please enter your mobile number",
        "inputType": "text",
        "options": []
    },
    {
        "id": 5,
        "question": "Please check your phone for the SMS verification code. Once you receive it, please type it into the chat box. If you fail to receive it, please type in please resend into the chatbox.",
        "inputType": "text",
        "options": []
    },
    {
        "id": 6,
        "question": "Please enter your preferred password. It must contain letters, numbers and symbols. It is required to have at least one letter, one number and one symbol.",
        "inputType": "password",
        "options": [],
        "disabled": true
    },
    {
        "id": 7,
        "question": "Please re-enter your password",
        "inputType": "password",
        "options": []
    },
    {
        "id": 8,
        "question": "Okay, now please enter your company name",
        "inputType": "",
        "options": []
    },
    {
        "id": 9,
        "question": "The next step is for you to enter the primary contact name for the business",
        "inputType": "",
        "options": []
    },
    {
        "id": 10,
        "question": "Thank you, now can you please enter your primary address",
        "inputType": "address",
        "options": []
    },
    {
        "id": 11,
        "question": "What best describes your primary occupation from the list below your occupation from the list below?",
        "header": {
            "step": "2",
            "text": "Services Offered"
        },
        "inputType": "cardRadio",
        "options": [
            { label: 'Appliance Professional', value: 'Appliance Professional' },
            { label: 'Carpenter', value: 'Carpenter' },
            { label: 'Concrete/Masonry Pro', value: 'Concrete/Masonry Pro' },
            { label: 'Deck Builder', value: 'Deck Builder' },
            { label: 'Electrician', value: 'Electrician' },
            { label: 'General Contractor', value: 'General Contractor' },
            { label: 'Handyman', value: 'Handyman' },
            { label: 'House Cleaner', value: 'House Cleaner' },
            { label: 'Lawn and Landscape Pro', value: 'Lawn and Landscape Pro' },
            { label: 'Painter', value: 'Painter' },
            { label: 'Plumber', value: 'Plumber' }
        ]
 
    },
    {
        "id": 12,
        "question": "Alright, now tell me what state you provide these services in?",
        "inputType": "select",
        "options": [
            { label: 'Florida', value: 'Florida' },
            { label: 'New York', value: 'New York' },
        ]
 
    },
    {
        "id": 13,
        "question": "Please select the license that applies to your business.",
        "inputType": "radioButton",
        "options": [
            { label: 'Certified General Contractor', value: 'Certified General Contractor' },
            { label: 'Certified Residental Contractor', value: 'Certified Residental Contractor' },
            { label: 'Certified Building Contractor', value: 'Certified Building Contractor' },
 
        ],
        "default": "Certified Building Contractor"
 
    },
    {
        "id": 14,
        "question": "The next step is for you to provide your Certified General Contractor license number from the state of Florida",
        "inputType": "text",
        "options": [],
 
    },
    {
        "id": 15,
        "question": "Please hold on for a minute or two while we validate your license...",
        "inputType": "bottext",
        "options": [],
    },
    {
        "id": 16,
        "question": "Here is the listing that we found. Please review and validate..",
        "inputType": "constructiondetails",
        "options": [],
    },
    {
        "id": 17,
        "question": "Is this your listing?",
        "inputType": "radioButton",
        "options": [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' }
        ],
        "default": "Yes"
    },
    {
        "id": 18,
        "question": "Now tell me which city will be your primary city?",
        "inputType": "text",
        "options": []
    },
    {
        "id": 19,
        "question": "So, tell us how far you will go to perform your services in miles",
        "inputType": "text",
        "options": []
    },
    {
        "id": 20,
        "question": "What services do you want to provide from the list below. Please select or deselect the services that apply or do not apply.",
        "inputType": "checkboxButton",
        "options": [
            { label: 'Bard/Shed Repair', value: 'Bard/Shed Repair' },
            { label: 'Brick, Stone, Block Wall Inst.', value: 'Brick, Stone, Block Wall Inst.' },
            { label: 'Crown Molding Instalation', value: 'Crown Molding Instalation' },
            { label: 'Decorative Wall Panel Inst.', value: 'Decorative Wall Panel Inst.' },
            { label: 'Driveway Repair', value: 'Driveway Repair' },
            { label: 'Exterior Awning Inst.', value: 'Exterior Awning Inst.' }
        ]
    },
    {
        "id": 21,
        "question": "What services do you want to provide from the list below. Please select or deselect the services that apply or do not apply.",
        "inputType": "checkboxButton",
        "options": [
            { label: 'Bard/Shed Repair', value: 'Bard/Shed Repair' },
            { label: 'Brick, Stone, Block Wall Inst.', value: 'Brick, Stone, Block Wall Inst.' },
            { label: 'Crown Molding Instalation', value: 'Crown Molding Instalation' },
            { label: 'Decorative Wall Panel Inst.', value: 'Decorative Wall Panel Inst.' },
            { label: 'Driveway Repair', value: 'Driveway Repair' },
            { label: 'Exterior Awning Inst.', value: 'Exterior Awning Inst.' }
        ]
    },
    {
        "id": 22,
        "question": "We are getting close to the end of the sign-up process.Provide a copy of your certificate of general liability insurance. Use the upload button below to upload it into the system.",
        "header": {
            "step": "3",
            "text": "Documents"
        },
        "inputType": "fileUploader",
        "options": []
    },
    {
        "id": 23,
        "question": "Do you have a rewards number with us?",
        "inputType": "radioButton",
        "options": [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' }
        ],
        "default": "Yes"
    },
    {
        "id": 24,
        "question": "Please enter your rewards number",
        "inputType": "text",
        "options": []
    },
    {
        "id": 25,
        "question": "One final thing, please upload your driver’s license using the upload box below",
        "inputType": "fileUploader",
        "options": []
    },
 
 
];
export const leftPanelHtml = `<!DOCTYPE html>
<html>
  <head>
    <title>Sandbox</title>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="./Sidebar.css" />
    <style>
            /* Apply the background SVG using CSS */
            .container-body {
        background-size: auto;
        background-repeat: no-repeat;
        width: 416px;
        height: 704px;
        padding: 20px;
        padding-top: 20px;
        box-sizing: border-box;
        padding-top: 64px;
        font-family: 'Aspekta';
        position: relative;
      }
      h3 {
        color: var(--white, #fff);
 
        /* 24px/medium */
        font-family: 'Aspekta';
        font-size: 28px;
        font-style: normal;
        font-weight: 500;
        margin-bottom: 20px;
        line-height: normal;
      }
      span {
        color: var(--grey-40-stroke, #e1e4ea);
 
        /* 15px/regular */
        font-family: 'Aspekta';
        font-size: 15px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 133.333% */
      }
 
   
.stepper {
    display: flex;
  flex-direction: column;
  margin-top: 17px;
}
 
.step {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative; /* Add relative positioning for the line */
  color: var(--white, #FFF);
 
/* 18px/medium */
font-family: Aspekta;
font-size: 18px;
font-style: normal;
font-weight: 600;
line-height: 35px; /* 155.556% */
}
 
.step-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid var(--grey-80, #AAB1BA);   color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  margin-right: 10px;
  color: var(--white, #FFF);
 
/* 11px/semibold */
font-family: Aspekta;
font-size: 11px;
font-style: normal;
font-weight: 600;
line-height: normal;
letter-spacing: 0.55px;
text-transform: uppercase;
}
 
.step-text {
  font-size: 14px;
}
 
.active .step-circle {
border: 1px solid var(--orange-100, #FF6900);
}
 
.completed .step-circle {
    background: var(--orange-100, #FF6900);   border: 1px solid var(--orange-100, #FF6900); ;
  color: white;
}
 
.upcoming .step-circle {
  border: 2px solid #ccc;
}
 
.upcoming .step-text{
    color: var(--grey-80, #AAB1BA);
}
 
.step:not(:last-child)::before {
    content: '';
  width: 2px;
  height: 100%;
  background: #ccc;
  position: absolute;
  left: 3%;
  top: 24px;
  transform: translateX(-50%);
  z-index: -2;
}
 
.sidebar-login{
    position: absolute;
    bottom: 20px;
    text-align: center;
    color: var(--white, #FFF);
 
/* 14px/regular */
font-family: Aspekta;
font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: normal;
width: 100%;
}
 
.sidebar-login .text{
    text-align: center;
}
.sidebar-login .login{
 
    cursor: pointer;
    color: var(--orange-100, #FF6900);
 }
    </style>
  </head>
 
  <body class="container-body">
    <h3>Welcome to the Professional Sign-up channel</h3>
    <span
      >We make it simple to walk through the registration process. Just click
      the “Get started” button and Libby will walk you through every step.
      Welcome aboard!</span
    >
    <div class="stepper">
      <div class="step completed">
        <div class="step-circle">1</div>
        <div class="step-text">Contact Information</div>
      </div>
      <div class="step active">
        <div class="step-circle">2</div>
        <div class="step-text">Services Offered</div>
      </div>
      <div class="step upcoming">
        <div class="step-circle">3</div>
        <div class="step-text">Documents</div>
      </div>
      <div class="step upcoming">
        <div class="step-circle">4</div>
        <div class="step-text">Summary</div>
      </div>
    </div>
    <div class="sidebar-login">
        <span class="text">
            Have an account? <span class="login">Log In</span>
        </span>
    </div>
    <script src="src/index.js"></script>
  </body>
</html>
`
export const finalMessage = "Thanks for the provided information"
export const conversational = true
export const start = async (handler, question) => {
    if (conversational) {
        const answ = ChatBotStep[handler.user.lastStep]
        if (answ === undefined) return { "text": finalMessage, "src": "talkingDb" };
        if (answ.id === 1) return { "text": answ.question, "src": "talkingDb", currentStep: answ }
        if (answ.callApi) {
            try {
                const response = await handler.axiosInstance.request(answ.apiOptions);
                return { "text": `${answ.question} - ${response.data.map((item) => item.name)}`, "src": "talkingDb" };
            } catch (error) {
                console.error(error);
            }
        }
        return { "text": answ.question, "src": "talkingDb", currentStep: answ };
    } else {
        const response = await handler.chain.run(question)
        return response
    }
}