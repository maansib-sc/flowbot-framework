export const getTitle = 'Project Posting Channel';
export const getWelcomeMessage =
  "I am a Assistant. I'll assist you with any queries related to documents";
export const getInputPlaceholder = 'Write Message';
export const Navbar = true;
export const botName = 'Libby';
export const testProject = true;
export const ChatBotStep = [
  {
    question: 'Welcome to beginAProject',
    id: 0,
    fullWidth: true,
    title: 'Hi! Welcome to the Project Posting Channel',
    description: '',
    callBack: (event, response) => {
      return { nextStep: 1, toast: '', error: false, hideAnswer: true };
    },
  },
  {
    id: 1,
    question:
      'Before we start on the project post, let me ask you a quick question. Are you already registered on the platform? If you are, then please type “yes” below and we will get you logged in. If the answer is no, then we will get you registered and help you get your project posted.',
    header: {
      step: '1',
      text: 'Personal Information',
    },
    inputType: 'radioButton',
    options: [
      {
        label: 'yes',
        value: 'yes',
      },
      {
        label: 'no',
        value: 'no',
      },
    ],
    callBack: (event, response) => {
      return { nextStep: 2, toast: '', error: false };
    },
  },
  {
    id: 2,
    question:
      'Please enter your login and password below and then type submit in the text box',
    inputType: 'loginPasswordAsk',
    options: [],
    callBack: (event, response) => {
      return { nextStep: 3, toast: '', error: false };
    },
  },
  {
    id: 3,
    question:
      'Which of the following options do you want to choose?',
    inputType: 'columnCards',
    header: {
        step: '2',
        text: 'Project Details',
      },
    options: [
        {
            label:"If you have a project that you need done around your home or business, then you can use our Project Posting option to find professionals who can perform those services for you at a great price. Begin A Project can find you the right professional for the job and help you get your job done with the help of our Project Managers.",
            header:"Create Your Own Project Posting",
            value:1
        },
        {
            label:"We have many projects that include pre-negotiated and competitive service rates with many of our qualified service professionals. See the list below to determine if your project includes the packaged price.",
            header:"Packaged Projects",
            value:2
        },
        {
            label:"If you prefer, one of our Project Concierge team members can manage your entire project for you from project posting to professional selection to project payments all the way to project completion for you. This option makes your life easy and your project runs smoothly. We just add 15% on top of the project costs to cover our time.",
            header:"Project Concierge",
            value:3
        },
        {
            label:"It is important to be proactive when it comes to maintaining the health of all of your appliances and systems. It is also time-consuming and requires some level of expertise. Our Service Concierge will come and perform a health evaluation on all of your appliances and systems. After the initial visit, they will come by your home two additional times during the year to perform any preventative maintenance and will provide you a complete health summary. After the Service Concierge has completed their health checks and preventative maintenance, then you will be provided a sim month warranty on your products in case anything goes wrong.  So three yearly visits and the warranty for only $500 a year plus the cost of preventative maintenance supplies.",
            header:"Service Concierge",
            value:4
        }
    ],
    callBack: (event, response) => {
      return { nextStep: 4, toast: '', error: false };
    },
  },
  {
    id: 4,
    question:
      'I am excited to help you with the Packaged Project option. Please select which project that you need help with.',
    inputType: 'radioButton',
    options: [
      {
        label: 'Garbage Disposal and Installation',
        value: 'Garbage Disposal and Installation',
      },
      {
        label: 'Dishwasher and Installation',
        value: 'Dishwasher and Installation',
      },
      {
        label: 'Fan and Installation',
        value: 'Fan and Installation',
      },
      {
        label: 'Oven and Installation',
        value: 'Oven and Installation',
      },
    ],
    callBack: (event, response) => {
      return { nextStep: 5, toast: '', error: false };
    },
  },
  {
    id: 5,
    question:
      'Have you already purchased your new dishwasher?',
    inputType: 'radioButton',
    options: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      {
        label: 'No',
        value: 'No',
      }
    ],
    callBack: (event, response) => {
      return { nextStep: 6, toast: '', error: false };
    },
  },
  {
    id: 6,
    question:
      'Great, I am excited to get your dishwasher delivered and installed. The first thing to do is to select the dishwasher that you want installed. Please click the list of options below and select the dishwasher that meets your needs. Once you select it, the packaged price will update.',
    inputType: 'tableComponent',
    options: [
        { id: 1, brand: 'General Electric', description: '24 in. Built-In Tall Tub Top Control Stainless Steel Dishwasher w/Sanitize, Dry Boost, 52 dBA', price: '$428.00',model:"GDT550PYRFS" },
        { id: 2, brand: 'Samsung', description: '24 in. Top Control Tall Tub Dishwasher in Stainless Steel with Stainless Steel Interior Door, 55 dBA', price: '$578.00',model:"DW80R2031US" },
        { id: 3, brand: 'Frigidaire', description: '24 In. in. Front Control Built-In Tall Tub Dishwasher in Stainless Steel with 3-Cycles, 55 dBA', price: '$398.00',model:"FFCD2413US" },
        { id: 4, brand: 'Samsung', description: '2Fingerprint Resistant 53 dBA Dishwasher with Adjustable Rack in Stainless Steel', price: '$428.00',model:"DW80CG4021SR" },
        { id: 5, brand: 'Whirlpool', description: '24 in. Fingerprint Resistant Stainless Steel Top Control Built-In Tall Tub Dishwasher with Third Level Rack, 47 dBA', price: '$548.00',model:"WDTA50SAKZ" },
        { id: 6, brand: 'Samsung', description: '24 in. Fingerprint Resistant Stainless Steel Top Control Smart Built-In Tall Tub Dishwasher with AutoRelease, 42dBA', price: '$698.00',model:"DW80B7070US" },
      ]
      ,
    callBack: (event, response) => {
      return { nextStep: 7, toast: '', error: false };
    },
  },
  {
    id: 7,
    question:
      'Thanks for the selection!The cost of this packaged project will be',
    inputType: 'costCards',
    options: [
        { id: 1, text: "Cost of the dishwasher:",price:"$428.00" },
        { id: 2, text: "Installation:",price:"$175.00" },
        { id: 3, text: "Tax:",price:"$36.18" },
        { id: 4, text: "Total:",price:"$639.18" },
      ]
      ,
    callBack: (event, response) => {
      return { nextStep: 8, toast: '', error: false };
    },
  },
  {
    id: 8,
    question:
      '',
    inputType: 'InstallationInfo',
    options: [],
    callBack: (event, response) => {
      return { nextStep: 9, toast: '', error: false };
    },
  },
  {
    id: 9,
    question:
      'Will you be using a credit card or ACH?',
    inputType: 'radioButton',
    default:null,
    header: {
        step: '3',
        text: 'Payment',
      },
    options: [
        {label:"Credit Card",value:"Credit Card"},
        {label:"ACH",value:"ACH"},
    ],
    callBack: (event, response) => {
      if(response !== "ACH"){
        return { nextStep: 10, toast: '', error: false };
      }else{
        return { nextStep: 16, toast: '', error: false };
      }
    },
  },
  {
    id: 10,
    question:
      'Enter card number:',
    inputType: 'text',
    options: [],
    callBack: (event, response) => {
      return { nextStep: 11, toast: '', error: false };
    },
  },
  {
    id: 11,
    question:
      'Alright, now enter the expiration date for the credit card',
    inputType: 'text',
    options: [],
    callBack: (event, response) => {
      return { nextStep: 12, toast: '', error: false };
    },
  },
  {
    id: 12,
    question:
      'Perfect! Now enter the three digit CVV from the back of the card',
    inputType: 'text',
    options: [],
    callBack: (event, response) => {
      return { nextStep: 13, toast: '', error: false };
    },
  },
  {
    id: 13,
    question:
      'Finally, please enter the zip code associated with this credit card',
    inputType: 'text',
    options: [],
    callBack: (event, response) => {
      return { nextStep: 14, toast: '', error: false };
    },
  },
  {
    id: 14,
    question:
      '',
    inputType: 'text',
    options: [],
    callBack: (event, response) => {
      return { nextStep: 15, toast: '', error: false };
    },
  },
  {
    "id": 15,
    "header": {
        "step": "4",
        "text": "Summary"
    },
    "question": "Here is a summary of the information that you provided, please review",
    "inputType": "summary",
    "options": [],
    "callBack": (event, response) => {
        return { "nextStep": 20, "toast": "", "error": false, "hideAnswer": true }
    }
},  {
  id: 16,
  question:
    'What is the name on the account?',
  inputType: 'text',
  options: [],
  callBack: (event, response) => {
    return { nextStep: 17, toast: '', error: false };
  },
},
{
  id: 17,
  question:
    'What is the name on the account?',
  inputType: 'text',
  options: [],
  callBack: (event, response) => {
    return { nextStep: 18, toast: '', error: false };
  },
},
{
  id: 18,
  question:
    'What is your routing number?',
  inputType: 'text',
  options: [],
  callBack: (event, response) => {
    return { nextStep: 19, toast: '', error: false };
  },
},
{
  id: 19,
  question:
    'What is your account number?',
  inputType: 'text',
  options: [],
  callBack: (event, response) => {
    return { nextStep: 15, toast: '', error: false };
  },
},
{
  id: 20,
  question:
    'If you are good with the information above, please type submit.',
  inputType: 'text',
  options: [],
  callBack: (event, response) => {
    return { nextStep: 21, toast: '', error: false };
  },
},
{
  id: 21,
  question:
    'Thank you so much for posting your project! We are assigning your project manager now and we look forward to getting this project done! You will be receiving updates via text or you can visit your dashboard to get updates. Feel free to reach out to us via chat if you have any additional questions. Thank you for using Begin A Project and remember us when you have any other project or service that you need around the house or at your business.',
  inputType: 'text',
  options: [],
  callBack: (event, response) => {
    return { nextStep: 21, toast: '', error: false };
  },
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
`;

export const showUserEnteredPasssword = false;
export const finalMessage = 'Thanks for the provided information';
export const conversational = true;
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
          if (answ.inputType === "summary") {
              answ["data"] = handler.user.getUserData()
          }
          if (answ.inputType === "await") {
              answ["await"] = 4000
          }
          if (answ.inputType === "costCards" || answ.inputType === "InstallationInfo") {
            answ["await"] = 1000
        }
          return { "text": answ.question, "src": "talkingDb", currentStep: answ, "error": error, "errorMessage": toast || "", hideAnswer: hideAnswer || false };
      }
      return { "text": answ.question, "src": "talkingDb", currentStep: answ, "error": error, "errorMessage": toast || "", hideAnswer: hideAnswer || false };
  } else {
      const response = await handler.chain.run(question)
      return response
  }
} 