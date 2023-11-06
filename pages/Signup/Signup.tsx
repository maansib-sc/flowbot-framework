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
import { useRouter } from 'next/router';
import ChatbotInfo from '@/components/ui/ChatbotInfo';
import { getDefaultPromptTemplate, resetPromptTemplate, submitPromptTemplate } from '@/apiRequests';
import { PromptModal } from '@/components/customPromptModal';
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
  const router = useRouter();
  const { query: { 'chat-id': chatId } } = router
  const [newChatRoom, setNewChatRoom] = useState<string>('');
  const [isPublishUrl, setIsPublishUrl] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [promptModal, setPromptModal] = useState<boolean>(false);
  const [promptTemplate, setPromptTemplate] = useState<string | any>('');
  const [selectedValues, setSelectedValues] = useState([]); // Initial empty array

  const handleCheckboxChange = (values: any) => {
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
        message: JSModule?.conversational ? JSModule?.ChatBotStep[activeIndex]?.question : JSModule?.getWelcomeMessage,
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
    // Get the URL search parameters
    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get("chat-id");
    const url = new URL(window.location.href);

    // Remove the "chat-id" parameter if it exists
    url.searchParams.delete('chat-id');
    const updatedURL = url.toString();
    setCurrentUrl(updatedURL)

    // Check if the chatId contains "publish"
    if (chatId && !chatId.includes("admin")) {
      setIsPublishUrl(true)
    } else {
      setIsPublishUrl(false)
    }
    // Check if the 'chat-id' query parameter is present
    if (!urlParams.has('chat-id')) {
      // Query parameter is not present, redirect to a new URL
      window.location.href = `${updatedURL}?chat-id=document-admin`
    }

    const createNewChatRoom = () => {
      let chatroom = generateRandomString("document-", 8)
      if (chatId && chatId.includes("cover")) {
        chatroom = generateRandomString("cover-", 8)
      }
      if (!newChatRoom && chatId) {
        if (chatId.includes("admin")) {
          setNewChatRoom(chatroom)
        } else {
          setNewChatRoom(chatId)
        }
        setCurrentSession(generateRandomString("session_", 9))
      }
    }

    createNewChatRoom()
  }, []);

  useEffect(() => {
    if (chatId) {
      import(`@/configuration/JS/${chatId}`).then(module => {
        setJSModule(module)
      }).catch((error) => {
        import(`@/configuration/JS/default`).then(module => {
          setJSModule(module)
        });
      });
    }
  }, [chatId]);



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
    if (JSModule && JSModule?.conversational && JSModule?.ChatBotStep[activeIndex]?.fullWidth) {
      setRegistrationMessage(JSModule?.ChatBotStep[activeIndex])
      setIsSignupPage(true)
    } else {
      setMessageState({
        messages: [
          {
            message: JSModule?.conversational ? JSModule?.ChatBotStep[0]?.question : JSModule?.getWelcomeMessage,
            type: 'apiMessage',
            src: ''
          },
        ],
        history: [],
      })
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

  useEffect(() => {
    console.log("getWelcomeMessage  ==>", messageState)
  }, [messageState])

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
            id: Math.random()
          },
        ],
      }));
    }
    setLoading(true);
    setQuery('');

    try {
      const response = await fetch(`/api/chat?pinecone_name_space=${newChatRoom}`, {
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
              step: data.currentStep || {},
              sourceDocs: data.sourceDocuments,
              id: Math.random()
            },
          ],
          history: [...state.history, [question, data.text]],
        }));
        setActiveIndex(data.currentStep.id)
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


  async function resetdefaultPromptTemplate() {
    await resetPromptTemplate(newChatRoom)
    const temp = await getDefaultPromptTemplate(newChatRoom)
    if (temp) {
      setPromptTemplate(temp.data)
    }
  }

  const onPromptChange = (value: string) => {
    setPromptTemplate(value)
  }

  const updatePrompt = async () => {
    await submitPromptTemplate(newChatRoom, { "template_instructions": promptTemplate })
    const temp = await getDefaultPromptTemplate(newChatRoom)
    if (temp) {
      setPromptTemplate(temp.data)
    }
  }

  useEffect(() => {
    if (newChatRoom) {
      const getDefaultPrompt = async () => {
        const temp = await getDefaultPromptTemplate(newChatRoom)
        if (temp) {
          setPromptTemplate(temp.data)
        }
      }
      getDefaultPrompt()
    }

  }, [newChatRoom])


  return (
    <div className={styles['signup']}>
      <div className={styles['sidebar']}>
        {!JSModule?.testProject &&
          <ChatbotInfo chatBotId={newChatRoom} />
        }
      </div>
      <div className={styles['main-content']}>
        <div className={styles['main-header']}>
          <span>{JSModule?.getTitle}</span>
          {JSModule?.testProject ? <Button variant="link">
            <ChatIcon />
            Chat with Platform Support
          </Button> :
            <div className='flex items-center '>
              <button className={`${styles.buttonWrapper} bg-white mr-4`} onClick={() => setPromptModal(true)}>Custom Prompt</button>
              {promptModal && <PromptModal onChangeHandler={onPromptChange} onClose={(val: string | undefined) => { val === "submit" ? updatePrompt() : null; setPromptModal(false) }} resetTemplate={resetdefaultPromptTemplate} data={promptTemplate} onSubmit={() => updatePrompt()} />}

              {!isPublishUrl &&
                <div className='flex'>
                  <button className={`${styles.buttonWrapper}`} onClick={() => {
                    window.alert(`Copy the Url for chatbot - ${currentUrl}?chat-id=${newChatRoom}`);
                  }
                  }>Publish & Share</button>
                </div>
              }
            </div>
          }
        </div>
        <div className={styles['main']}>
          {isSignupPage ? (
            <div className={styles['registerguy']}>
              <RegisterationGuy />
              <h3>{registrationMessage?.title}</h3>
              <span>{registrationMessage?.description}
              </span>
              <Button onClick={() => nextStep()}>{`Get Started →`} </Button>
            </div>
          ) : (
            // <Signupform />
            <>
              <div className={homestyles?.cloud}>
                <div ref={messageListRef} className={homestyles?.messagelist}>
                  {messages.map((message, index) => {
                    let icon;
                    let className;
                    if (message.type === 'apiMessage') {
                      icon = (
                        <div style={{ paddingRight: "20px" }}>
                          <Image
                            key={index}
                            src="/bot-image.png"
                            alt="AI"
                            width="40"
                            height="40"
                            className={styles.boticon}
                            priority
                          />
                        </div>)
                      if (JSModule?.testProject) {
                        icon = (
                          <div className={homestyles?.libby}>
                            <Libby />
                          </div>
                        );
                      }
                      className = homestyles?.apimessage;
                    } else {
                      icon = (
                        <div className={homestyles?.libby}>
                          <You />
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
                            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                              {message?.type == "apiMessage" ? <span>{JSModule?.botName}</span>
                                : <span>
                                  You
                                </span>}
                              <div className={homestyles?.markdownanswer}>
                                <span className={homestyles?.markdownanswerspan}>
                                  {message.message}
                                </span>
                                {
                                  JSModule?.conversational &&
                                  <div className={homestyles?.extraContainer}>
                                    {
                                      message.type === 'apiMessage' && message?.step?.inputType === "radioButton" ?
                                        <RadioGroup
                                          options={message?.step?.options}
                                          selectedValue={message?.step?.default}
                                          onChange={() => {
                                            console.log("selected output");
                                            handleSubmit()
                                          }}
                                        /> : null
                                    }
                                    {
                                      message?.step?.inputType === "password" ?
                                        <PasswordInput
                                        /> : null
                                    }
                                    {
                                      message?.step?.inputType === "address" ?
                                        <Address
                                          cities={cityOptions}
                                          states={stateOptions}
                                          zip={""}
                                          street={""}
                                        /> : null
                                    }
                                    {
                                      message?.step?.inputType === "cardRadio" ?
                                        <CardRadioGroup
                                          options={[{
                                            label: "label",
                                            value: "value",
                                            icon: Generate,
                                          },
                                          {
                                            label: "label",
                                            value: "value",
                                            icon: Generate,
                                          }]}
                                          selectedValue={"value"}
                                          onChange={() => console.log("selected output")}
                                        /> : null
                                    }
                                    {
                                      message?.step?.inputType === "checkboxButton" ?
                                        <CheckboxGroup
                                          selectedValues={selectedValues}
                                          options={message?.step?.options}
                                          onChange={handleCheckboxChange}
                                        /> : null
                                    }
                                  </div>
                                }
                              </div>
                            </div>
                          </div>
                          <div className={homestyles?.editbtn}>
                            {message?.type !== "apiMessage" ? <Button variant='link'>
                              <Pencil /> Edit
                            </Button>
                              : <></>}
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
