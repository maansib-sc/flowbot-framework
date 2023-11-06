import Button from '@/components/ui/Buttons/Button';
import styles from './Signup.module.css';
import ChatIcon from '@/assets/svgs/ChatIcon';
import { useEffect, useState, useRef } from 'react';
import Signupform from '@/subcomponents/SignupForm/Signupform';
import RegisterationGuy from '@/assets/svgs/RegisterationGuy';
import { Message } from '@/types/chat';
import LoadingDots from '@/components/ui/LoadingDots';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { generateRandomString } from '@/utils/generateRandomeString';
import RadioGroup from '@/components/ui/Radio/RadioGroup';
import Libby from '@/assets/svgs/Libby';
import You from '@/assets/svgs/You';
import Pencil from '@/assets/svgs/Pencil';
import PasswordInput from '@/components/ui/Input/PasswordInput';
import Address from '@/components/ui/Address/Address';
import CardRadioGroup from '@/components/ui/Radio/CardRadioGroup';
import Generate from '@/assets/svgs/icons/Generate';
import CheckboxGroup from '@/components/ui/Checkbox/CheckboxGroup';

const cityOptions = [
  { value: 'new-york', label: 'New York' },
  { value: 'los-angeles', label: 'Los Angeles' },
  { value: 'chicago', label: 'Chicago' },
  // Add more city options as needed
];

const stateOptions = [
  { value: 'new-york', label: 'New York' },
  { value: 'california', label: 'California' },
  { value: 'illinois', label: 'Illinois' },
  // Add more state options as needed
];


const Signup = () => {
  const [step, setStep] = useState(1);
  const [isSignupPage, setIsSignupPage] = useState(false);
  const [JSModule, setJSModule] = useState<any>(null);
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [registrationMessage, setRegistrationMessage] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [currentSession, setCurrentSession] = useState<string>("")
  const [selectedValues, setSelectedValues] = useState([]); // Initial empty array

  const handleCheckboxChange = (values:any) => {
    setSelectedValues(values);
  };


  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [
      {
        message: JSModule?.ChatBotStep[activeIndex]?.question,
        type: 'apiMessage',
        src: ''
      },
    ],
    history: [],
  });
  const [homestyles, setStyle] = useState<any>(null);
  const { messages, history } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCurrentSession(generateRandomString("session_", 9))
    import(`@/configuration/JS/default`).then(module => {
      setJSModule(module)
    });
    import(`@/styles/Home.module.css`).then(module => {
      setStyle(module)
    });
  }, [])

  useEffect(() => {
    if (JSModule && JSModule?.ChatBotStep[activeIndex]?.fullWidth) {
      setRegistrationMessage(JSModule?.ChatBotStep[activeIndex])
      setIsSignupPage(true)
    }
  }, [JSModule])

  async function nextStep() {
    setActiveIndex(1)
  }

  useEffect(() => {
    if (activeIndex && activeIndex === 1) {
      setIsSignupPage(false)
      setMessageState({
        messages: [],
        history: [],
      })
      handleSubmit()
    }
  }, [activeIndex])

  //handle form submission
  async function handleSubmit() {

    const question = query.trim();
    if (query) {
      setMessageState((state) => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'userMessage',
            message: question,
            src: "test",
            id:Math.random()
          },
        ],
      }));
    }
    setLoading(true);
    setQuery('');

    try {
      const response = await fetch(`/api/chat?pinecone_name_space=${"test"}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          history,
          session: currentSession
        }),
      });
      const data = await response.json();

      if (data.error) {
      } else {
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: data.text,
              src: data.src,
              sourceDocs: data.sourceDocuments,
              id:Math.random()
            },
          ],
          history: [...state.history, [question, data.text]],
        }));
        setActiveIndex(activeIndex + 1)
      }

      setLoading(false);

      //scroll to bottom
      messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  }

  //prevent empty submissions
  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && query) {
      handleSubmit();
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };

  console.log(messages,"messagez",activeIndex)


  return (
    <div className={styles['signup']}>
      <div className={styles['sidebar']}>sidebar</div>
      <div className={styles['main-content']}>
        <div className={styles['main-header']}>
          <span>{JSModule?.getTitle}</span>
          <Button variant="link">
            <ChatIcon />
            Chat with Platform Support
          </Button>
        </div>
        <div className={styles['main']}>
          {isSignupPage ? (
            <div className={styles['registerguy']}>
              <RegisterationGuy />
              <h3>{registrationMessage?.title}</h3>
              <span>{registrationMessage?.description}
              </span>
              {/* <Button> */}
              <Button onClick={() => nextStep()}>{`Get Started →`} </Button>
              {/* </Button> */}
            </div>
          ) : (
            // <Signupform />
            <>
              <div className={homestyles?.cloud}>
                <div ref={messageListRef} className={homestyles?.messagelist}>
                  {messages.map((message, index) => {
                    let currentJSModule = JSModule?.ChatBotStep[activeIndex - 1]
                    console.log("==>", activeIndex, index, message.message, currentJSModule)
                    let icon;
                    let className;
                    if (message.type === 'apiMessage') {
                      icon = (
                        <div className={homestyles?.libby}>
                          <Libby/>
                          </div>
                      );
                      className = homestyles?.apimessage;
                    } else {
                      icon = (
                          <div className={homestyles?.libby}>
                          <You/>
                          </div>
                      );
                      // The latest message sent by the user will be animated while waiting for a response
                      className =
                        loading && index === messages?.length - 1
                          ? homestyles?.usermessagewaiting
                          : homestyles?.usermessage;
                    }
                    return (
                      <>
                        <div key={`chatMessage-${index}`} className={className}>
                          <div className={homestyles?.container}>
                          {icon}
                          <div style={{ display: "flex", flexDirection: "column" ,width:"100%"}}>
                            {message?.type=="apiMessage"?<span>Libby</span>
                            :<span>
                              You
                              </span>}
                            <div className={homestyles?.markdownanswer}>
                              <span className={homestyles?.markdownanswerspan}>
                              {message.message}
                              </span>
                              <div className={homestyles?.extraContainer}>
                              {
                                currentJSModule?.inputType === "radioButton" && (index === activeIndex) ?
                                  <RadioGroup
                                    options={currentJSModule?.options}
                                    selectedValue={"Yes"}
                                    onChange={() => console.log("selected output")}
                                  /> : null
                              }
                              {
                                currentJSModule?.inputType === "password" && (index === activeIndex) ?
                                  <PasswordInput
                                  /> : null
                              }
                              {
                                currentJSModule?.inputType === "address"  ?
                                  <Address
                                  cities={cityOptions}
                                  states={stateOptions}
                                  zip={""}
                                  street={""}
                                  /> : null
                              }
                              {
                                currentJSModule?.inputType === "cardRadio"  ?
                                  <CardRadioGroup
                                  options={[{
                                    label:"label",
                                    value:"value",
                                    icon:Generate,
                                  },
                                  {
                                    label:"label",
                                    value:"value",
                                    icon:Generate,
                                  }]}
                                  selectedValue={"value"}
                                  onChange={() => console.log("selected output")}
                                  /> : null
                              }
                              {
                                currentJSModule?.inputType === "checkboxButton" ?
                                  <CheckboxGroup
                                  selectedValues={selectedValues}
                                    options={currentJSModule?.options}
                                    onChange={handleCheckboxChange}
                                  /> : null
                              }
                              </div>
                            </div>
                          </div>
                            </div>
                            <div className={homestyles?.editbtn}>
                              {message?.type!=="apiMessage"?<Button variant='link'>
                               <Pencil/> Edit
                              </Button>
                              :<></>}
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div >
              </div >
              <div className={homestyles?.center}>
                <div className={homestyles?.cloudform}>
                  <form onSubmit={handleSubmit}>
                    <textarea
                      disabled={loading}
                      onKeyDown={handleEnter}
                      ref={textAreaRef}
                      autoFocus={false}
                      rows={1}
                      maxLength={10000}
                      id="userInput"
                      name="userInput"
                      placeholder={
                        loading
                          ? 'Waiting for response...'
                          : JSModule?.getInputPlaceholder
                      }
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className={homestyles?.textarea}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className={homestyles?.generatebutton}
                    >
                      {loading ? (
                        <div className={homestyles?.loadingwheel}>
                          <LoadingDots color="#000" />
                        </div>
                      ) : (
                        <svg
                          viewBox="0 0 20 20"
                          className={homestyles?.svgicon}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                        </svg>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
