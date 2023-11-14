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
        "description": "Libby will guide you through the registration process and willanswer any questions that you have. If you experience anyplatform issues during the registration process, click the “Chatwith Platform Support” button on the top right of the channelduring the sign-up process.",
        "callBack": (event, response) => {
            return { "nextStep": 1, "toast": "", "error": false, "hideAnswer": true }
        }
    },
    {
        "id": 1,
        "question": "What is your first Name and last Name",
        "header": {
            "step": "1",
            "text": "Contact Information"
        },
        "inputType": "text",
        "options": [],
        "callBack": (event, reponse) => {
            let name = reponse
            const validate = (name) => {
                const nameRegex = /^[a-zA-Z ]+$/;
                const minLength = 2;
                const maxLength = 50;

                if (!name || typeof name !== 'string') {
                    return "Please enter a valid name.";
                }

                if (!nameRegex.test(name)) {
                    return "Names can only contain letters.";
                }

                if (name.length < minLength || name.length > maxLength) {
                    return `Name must be between ${minLength} and ${maxLength} characters long.`;
                }

                return null; // Indicates no validation errors
            }
            const validationResult = validate(name);
            if (validationResult) {
                return { "nextStep": 1, "toast": validationResult, "error": true }
            } else {
                return { "nextStep": 2, "toast": "", "error": false }
            }
        }
    },
    {
        "id": 2,
        "question": "So, would you like to register using using your Google log-in ?",
        "inputType": "googleLogin",
        "options": [
            // { label: 'Yes', value: 'Yes' },
            // { label: 'No', value: 'No' }
        ],
        "callBack": (event, response) => {
            if (response === "No") {
                return { "nextStep": 3, "toast": "", "error": false, "hideAnswer": true }
            }
            // return { "nextStep": 5, "toast": "", "error": false, "hideAnswer": true }
        },
        "hideAnswer": false
    },
    {
        "id": 3,
        "question": "What is your email address",
        "inputType": "text",
        "options": [],
        "callBack": (event, response) => {
            let email = response
            function validateEmail(email) {
                // Regular expression for a simple email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!email || typeof email !== 'string') {
                    return "Please enter a valid email address.";
                }

                if (!emailRegex.test(email)) {
                    return "Please enter a valid email address format.";
                }

                return null; // Indicates no validation errors
            }
            const emailValidationResult = validateEmail(email);
            if (emailValidationResult) {
                return { "nextStep": 3, "toast": emailValidationResult, "error": true }
            } else {
                return { "nextStep": 4, "toast": "", "error": false }
            }
        }
    },
    {
        "id": 4,
        "question": "Please check your email inbox for the verification code. Once you receive it, please type it into the chat box. If you fail to receive it, please type in please resend into the chatbox.",
        "inputType": "text",
        "options": [],
        "callBack": (event, response) => {
            function validateNumber(input) {
                input = Number(input)
                const isNumeric = /^\d+$/;

                if (!input || typeof input !== 'number') {
                    return "Please enter a valid number.";
                }

                const inputString = input.toString();

                if (inputString.length === 6 && isNumeric.test(inputString)) {
                    return null; // Indicates no validation errors
                }

                return "Number must be exactly 6 digits long.";
            }
            const numberValidation = validateNumber(response);
            if (numberValidation) {
                return { "nextStep": 4, "toast": numberValidation, "error": true }
            } else {
                return { "nextStep": 5, "toast": "", "error": false }
            }
        }

    },
    {
        "id": 5,
        "question": "Please enter your mobile number",
        "inputType": "text",
        "options": [],
        "callBack": (event, response) => {
            return { "nextStep": 6, "toast": "", "error": false }
        }
    },
    {
        "id": 6,
        "question": "Please check your phone for the SMS verification code. Once you receive it, please type it into the chat box. If you fail to receive it, please type in please resend into the chatbox.",
        "inputType": "text",
        "options": [],
        "callBack": (event, response) => {
            return { "nextStep": 7, "toast": "", "error": false }
        }
    },
    {
        "id": 7,
        "question": "Please enter your preferred password. It must contain letters, numbers and symbols. It is required to have at least one letter, one number and one symbol.",
        "inputType": "password",
        "error":"",
        "options": [],
        "disabled": true,
        "callBack": (event, response) => {
            function validatePassword(input) {
                // Minimum 12 characters
                if (input.length < 12) {
                    return "Password must be at least 12 characters long.";
                }
    
                // Should have one letter, one number, one special symbol
                const hasLetter = /[a-zA-Z]/.test(input);
                const hasNumber = /\d/.test(input);
                const hasSymbol = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(input);
    
                if (!(hasLetter && hasNumber && hasSymbol)) {
                    return "Password must contain at least one letter, one number, and one special symbol.";
                }
    
                return null; // Indicates no validation errors
            }
    
            const passwordValidation = validatePassword(response);
    
            if (passwordValidation) {
                return { "nextStep": 7, "toast": passwordValidation, "error": true };
            } else {
                return { "nextStep": 8, "toast": "", "error": false };
            }
        }
    }
,    
    {
        "id": 8,
        "question": "Please re-enter your password",
        "inputType": "password",
        "options": [],
        "callBack": (event, response) => {
            return { "nextStep": 9, "toast": "", "error": false, "hideAnswer": true }
        }
    },
    {
        "id": 9,
        "question": "Okay, now please enter your company name",
        "inputType": "text",
        "options": [],
        "callBack": (event, response) => {
            return { "nextStep": 10, "toast": "", "error": false }
        }
    },
    {
        "id": 10,
        "question": "The next step is for you to enter the primary contact name for the business",
        "inputType": "text",
        "options": [],
        "callBack": (event, response) => {
            return { "nextStep": 11, "toast": "", "error": false }
        }
    },
    {
        "id": 11,
        "question": "Thank you, now can you please enter your primary address",
        "inputType": "address",
        "options": [],
        "callBack": (event, response) => {
            return { "nextStep": 12, "toast": "", "error": false }
        }
    },
    {
        "id": 12,
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
        ],
        "callBack": (event, response) => {
            return { "nextStep": 13, "toast": "", "error": false, "hideAnswer": true }
        }

    },
    {
        "id": 13,
        "question": "Alright, now tell me what state you provide these services in?",
        "inputType": "select",
        "options": [
            { label: 'Florida', value: 'Florida' },
            { label: 'New York', value: 'New York' },
        ],
        "callBack": (event, response) => {
            return { "nextStep": 14, "toast": "", "error": false, "hideAnswer": true }
        }
    },
    {
        "id": 14,
        "question": "Please select the license that applies to your business.",
        "inputType": "radioButton",
        "options": [
            { label: 'Certified General Contractor', value: 'Certified General Contractor' },
            { label: 'Certified Residental Contractor', value: 'Certified Residental Contractor' },
            { label: 'Certified Building Contractor', value: 'Certified Building Contractor' },

        ],
        "default": "Certified Building Contractor",
        "callBack": (event, response) => {
            return { "nextStep": 15, "toast": "", "error": false, "hideAnswer": true }
        }

    },
    {
        "id": 15,
        "question": "The next step is for you to provide your Certified General Contractor license number from the state of Florida",
        "inputType": "text",
        "options": [],
        "callBack": (event, response) => {
            return { "nextStep": 16, "toast": "", "error": false }
        }

    },
    {
        "id": 16,
        "question": "Please hold on for a minute or two while we validate your license...",
        "inputType": "text",
        "options": [],
        "callBack": (event, response) => {
            return { "nextStep": 17, "toast": "", "error": false, "hideAnswer": true }
        }
    },
    {
        "id": 17,
        "question": "Here is the listing that we found. Please review and validate..",
        "inputType": "constructiondetails",
        "options": [],
        "callBack": (event, response) => {
            return { "nextStep": 18, "toast": "", "error": false, "hideAnswer": true }
        }
    },
    {
        "id": 18,
        "question": "Is this your listing?",
        "inputType": "radioButton",
        "options": [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' }
        ],
        "default": "Yes",
        "callBack": (event, response) => {
            return { "nextStep": 19, "toast": "", "error": false, "hideAnswer": true }
        }
    },
    {
        "id": 19,
        "question": "Now tell me which city will be your primary city?",
        "inputType": "text",
        "options": [],
        "callBack": (event, response) => {
            return { "nextStep": 20, "toast": "", "error": false }
        }
    },
    {
        "id": 20,
        "question": "So, tell us how far you will go to perform your services in miles",
        "inputType": "text",
        "options": [],
        "callBack": (event, response) => {
            return { "nextStep": 21, "toast": "", "error": false }
        }
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
        ],
        "callBack": (event, response) => {
            return { "nextStep": 22, "toast": "", "error": false, "hideAnswer": true }
        }
    },
    {
        "id": 22,
        "question": "We are getting close to the end of the sign-up process.Provide a copy of your certificate of general liability insurance. Use the upload button below to upload it into the system.",
        "header": {
            "step": "3",
            "text": "Documents"
        },
        "inputType": "fileUploader",
        "options": [],
        "callBack": (event, response) => {
            return { "nextStep": 23, "toast": "", "error": false, "hideAnswer": true }
        }
    },
    {
        "id": 23,
        "question": "Do you have a rewards number with us?",
        "inputType": "radioButton",
        "options": [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' }
        ],
        "default": "Yes",
        "callBack": (event, response) => {
            return { "nextStep": 24, "toast": "", "error": false, "hideAnswer": true }
        }
    },
    {
        "id": 24,
        "question": "Please enter your rewards number",
        "inputType": "text",
        "options": [],
        "callBack": (event, response) => {
            return { "nextStep": 25, "toast": "", "error": false }
        }
    },
    {
        "id": 25,
        "question": "One final thing, please upload your driver’s license using the upload box below",
        "inputType": "fileUploader",
        "options": [],
        "callBack": (event, response) => {
            return { "nextStep": 26, "toast": "", "error": false, "hideAnswer": true }
        }
    },
    {
        "id": 26 ,
        "header": {
            "step": "4",
            "text": "Summary"
        },
        "inputType": "summary",
        "options": [],
        "callBack": (event, reponse) => {

        }
    }

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
      .h3 {
        color: var(--white, #fff);
 
        /* 24px/medium */
        font-family: 'Aspekta';
        font-size: 28px;
        font-style: normal;
        font-weight: 500;
        margin-bottom: 20px;
        line-height: normal;
        padding-right:33px;
      }
      .span {
        color: var(--grey-40-stroke, #e1e4ea);
 
        /* 15px/regular */
        font-family: 'Aspekta';
        font-size: 17px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 133.333% */
        padding-right:47px;

      }
 
   
.stepper {
    display: flex;
  flex-direction: column;
  margin-top: 7px;
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
  width: 24px;
  z-index:21212;
  height: 24px;
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
  font-size: 18px;
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
  left: 2.33%;
  top: 28px;
  transform: translateX(-50%);
  z-index: 0;
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
    <h3 class="h3">Welcome to the Professional Sign-up channel</h3>
    <span
    class="span"
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

export const showUserEnteredPasssword = false
export const finalMessage = "Thanks for the provided information"
export const conversational = true

export const start = async (handler, question) => {
    if (conversational) {
        let currentStep = await handler.user.getlastStep()
        let answ = ChatBotStep[currentStep]
        if (answ === undefined) return { "text": finalMessage, "src": "talkingDb" };
        if (answ.callBack) {
            const { nextStep, toast, error, hideAnswer } = answ.callBack(handler, question)
            handler.user.setlastStep(nextStep)
            await handler.user.save()
            answ = ChatBotStep[nextStep]
            return { "text": answ.question, "src": "talkingDb", currentStep: answ, "error": error, "errorMessage": toast || "", hideAnswer: hideAnswer || false };
        }
        return { "text": answ.question, "src": "talkingDb", currentStep: answ, "error": error, "errorMessage": toast || "", hideAnswer: hideAnswer || false };
    } else {
        const response = await handler.chain.run(question)
        return response
    }
}