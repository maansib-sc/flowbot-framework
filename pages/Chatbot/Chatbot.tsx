import Button from '@/components/ui/Buttons/Button';
import styles from './Chatbot.module.css';
import ChatIcon from '@/assets/svgs/ChatIcon';
import { useEffect, useState, useRef, Fragment } from 'react';
import rehypeRaw from 'rehype-raw';
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
import {
  getDefaultPromptTemplate,
  resetPromptTemplate,
  submitPromptTemplate,
} from '@/apiRequests';
import { PromptModal } from '@/components/customPromptModal';
import CardRadioGroup from '@/components/ui/Radio/CardRadioGroup';
import Generate from '@/assets/svgs/icons/Generate';
import CheckboxGroup from '@/components/ui/Checkbox/CheckboxGroup';
import SelectInputField from '@/components/ui/SelectInputField/SelectInputField';
import NextFunction from '@/components/NextFunction';
import ShowDetails from '@/components/ui/ShowDetails/ShowDetails';
import FileUploadComponent from '@/components/ui/FileUpload/FileUploadComponent';
import LoginPasswordAsk from '@/components/ui/LoginPasswordAsk/LoginPasswordAsk';
import ColumnCards from '@/components/ui/Radio/ColumnCards';
import GoogleLoginComponent from '@/components/ui/Radio/GoogleLoginComponent';
import Summary from '@/components/ui/Summary/Summary';
import { useSession, signIn, signOut } from 'next-auth/react';
import MultiSelectInput from '@/components/ui/MutiSelectInput/MultiSelectInput';
import AutoCompleteInput from '@/components/ui/AutoCompleteInput/AutoCompleteInput';
import Table from '@/components/ui/Table/Table';
import CostCards from '@/components/ui/CostCards/CostCards';
import InstallationInfo from '@/components/ui/InstallationInfo/InstallationInfo';
import Invoice from '@/components/ui/Invoice/Invoice';
import TextInput from '@/components/ui/Input/TextInput';
import SearchInput from '@/components/ui/Search/Search';
import StripeComponent from '@/components/ui/StripeComponent/StripeComponent';
import DateTimePicker from '@/components/ui/DateTimePicker/DateTimePicker';
import CostMilestone from '@/components/ui/CostMilestone/CostMilestone';
import ProjectCard from '@/components/ui/ProjectCard/ProjectCard';
import RatingCard from '@/components/ui/RatingCard/RatingCard';
import ReferralCard from '@/components/ui/ReferralCard/ReferralCard';

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

const Chatbot = () => {
  const [botLoading, setBotLoading] = useState<Boolean>(true);
  const [step, setStep] = useState(1);
  const [isSignupPage, setIsSignupPage] = useState(false);
  const [JSModule, setJSModule] = useState<any>(null);
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [registrationMessage, setRegistrationMessage] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [currentSession, setCurrentSession] = useState<string>('');
  const router = useRouter();
  const {
    query: { 'chat-id': chatId },
  } = router;
  const [newChatRoom, setNewChatRoom] = useState<string>('');
  const [isPublishUrl, setIsPublishUrl] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [promptModal, setPromptModal] = useState<boolean>(false);
  const [promptTemplate, setPromptTemplate] = useState<string | any>('');
  const [selectedValues, setSelectedValues] = useState([]); // Initial empty array
  const [htmlFile, setHtmlFile] = useState('');
  const [editableIndex, setEditableIndex] = useState<number | null>(null);
  const [disableInput, setDisableInput] = useState(false);

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
        message: JSModule?.conversational
          ? JSModule?.ChatBotStep[activeIndex]?.question
          : JSModule?.getWelcomeMessage,
        type: 'apiMessage',
        src: '',
      },
    ],
    history: [],
  });
  const [homestyles, setStyle] = useState<any>({});
  const { messages, history } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Get the URL search parameters
    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get('chat-id');
    const url = new URL(window.location.href);

    // Remove the "chat-id" parameter if it exists
    url.searchParams.delete('chat-id');
    const updatedURL = url.toString();
    setCurrentUrl(updatedURL);

    if (chatId) {
      setIsPublishUrl(true);
    } else {
      setIsPublishUrl(false);
    }

    const createNewChatRoom = () => {
      let chatroom = generateRandomString('document-', 8);
      if (chatId && chatId.includes('cover')) {
        chatroom = generateRandomString('cover-', 8);
      }
      if (!chatId) {
        setNewChatRoom(chatroom);
      }
      if (!newChatRoom && chatId) {
        if (chatId.includes('admin')) {
          setNewChatRoom(chatroom);
        } else {
          setNewChatRoom(chatId);
        }
        setCurrentSession(generateRandomString('session_', 9));
      }
    };

    createNewChatRoom();
  }, []);

  useEffect(() => {
    setBotLoading(true);
    if (chatId) {
      import(`@/configuration/${chatId}/webapp`)
        .then((module) => {
          setJSModule(module);
        })
        .catch((error) => {
          import(`@/configuration/default/webapp`).then((module) => {
            setJSModule(module);
          });
        });
      import(`@/configuration/${chatId}/webapp/Index.module.css`)
        .then((module) => {
          setStyle(module);
        })
        .catch((error) => {
          import(`@/configuration/default/webapp/Index.module.css`).then(
            (module) => {
              setStyle(module);
            },
          );
        });
    } else {
      setCurrentSession(generateRandomString('session_', 9));
      import(`@/configuration/default/webapp`).then((module) => {
        setJSModule(module);
      });
      import(`@/configuration/default/webapp/Index.module.css`).then(
        (module) => {
          setStyle(module);
        },
      );
    }
    setBotLoading(false);
  }, [chatId]);

  useEffect(() => {
    if (
      JSModule &&
      JSModule?.conversational &&
      JSModule?.ChatBotStep[activeIndex]?.fullWidth
    ) {
      setRegistrationMessage(JSModule?.ChatBotStep[activeIndex]);
      setIsSignupPage(true);
    } else {
      setMessageState({
        messages: [
          {
            message: JSModule?.conversational
              ? JSModule?.ChatBotStep[0]?.question
              : JSModule?.getWelcomeMessage,
            type: 'apiMessage',
            src: '',
          },
        ],
        history: [],
      });
    }
    if (JSModule) {
      setHtmlFile(JSModule?.leftPanelHtml);
    }
  }, [JSModule]);

  async function nextStep() {
    setActiveIndex(1);
  }

  useEffect(() => {
    if (activeIndex && activeIndex === 1) {
      setIsSignupPage(false);
      setMessageState({
        messages: [],
        history: [],
      });
      handleSubmit();
    }
    if (
      JSModule &&
      JSModule?.conversational &&
      JSModule?.ChatBotStep.find((item: any) => item.id == activeIndex)
        ?.fullWidth
    ) {
      setRegistrationMessage(
        JSModule?.ChatBotStep.find((item: any) => item.id == activeIndex),
      );
      setIsSignupPage(true);
      setMessageState({
        messages: [],
        history: [],
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    console.log('getWelcomeMessage  ==>', messageState);
  }, [messageState]);

  const checklastmessage = (value?: string) => {
    const getLastApiMessageIndex = (messages: Message[]): number => {
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].type === 'apiMessage') {
          return i;
        }
      }
      return -1; // Return -1 if no apiMessage is found
    };
    let lastIndex = getLastApiMessageIndex(messages);
    if (messages.length > 0 && messages[lastIndex]?.step) {
      let copy = { ...messages[lastIndex] };
      copy.step ??= {};
      copy.step['answer'] = query || value;
      setMessageState((state) => ({
        ...state,
        messages: [...messages],
        history: [],
      }));
    }
  };

  const disableUserInput = () => {
    if (messages.length > 0 && messages[messages.length - 1]?.step) {
      let message = messages[messages.length - 1];
      if (message?.step?.inputType && message?.step?.inputDisabled) {
        setDisableInput(true);
      } else {
        setDisableInput(false);
      }
    }
  };

  //handle form submission
  async function handleSubmit(value?: string, update?: boolean) {
    let question = query.trim();
    if (!query) {
      question = value?.trim() || '';
    }
    // console.log("Value handleSubmit question ==>", question)
    if (update !== false) {
      checklastmessage(question);
    }
    setLoading(true);
    setQuery('');

    try {
      const response = await fetch(
        `/api/chat?pinecone_name_space=${newChatRoom}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question,
            history,
            session: currentSession,
          }),
        },
      );
      const data = await response.json();
      if (data.currentStep.await) {
        setTimeout(() => {
          handleSubmit('dummy', false);
        }, data.currentStep.await);
      }
      if (data.error) {
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'userMessage',
              message: data.currentStep.answer || question,
              error: true,
              errorMessage: data.errorMessage,
              src: 'test',
              id: Math.random(),
            },
          ],
        }));
        if (data.currentStep.showQuestion) {
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
                id: Math.random(),
              },
            ],
            history: [...state.history, [question, data.text]],
          }));
        }
      } else {
        if (!data.hideAnswer) {
          setMessageState((state) => ({
            ...state,
            messages: [
              ...state.messages,
              {
                type: 'userMessage',
                message: data.currentStep.answer || question,
                src: 'test',
                id: Math.random(),
              },
            ],
          }));
        }
        if (data.currentStep.update) {
          JSModule?.leftPanelStateUpdate(+data.currentStep.header.step);
        }

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
              id: Math.random(),
            },
          ],
          history: [...state.history, [question, data.text]],
        }));
        setActiveIndex(data.currentStep.id);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  }

  // File Handler Submission
  const uploadFilehandler = async (files: FileList) => {
    for (let item of files) {
      const formData = new FormData();
      formData.append('chatId', newChatRoom);
      formData.append('sessionId', currentSession);
      formData.append('file', item);

      fetch('/api/file-upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('File uploaded successfully:', data);
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    }
  };

  //prevent empty submissions
  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && query) {
      handleSubmit();
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };

  useEffect(() => {
    messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
    disableUserInput();
  }, [messages]);

  async function resetdefaultPromptTemplate() {
    await resetPromptTemplate(newChatRoom);
    const temp = await getDefaultPromptTemplate(newChatRoom);
    if (temp) {
      setPromptTemplate(temp.data);
    }
  }

  const onPromptChange = (value: string) => {
    setPromptTemplate(value);
  };

  const updatePrompt = async () => {
    await submitPromptTemplate(newChatRoom, {
      template_instructions: promptTemplate,
    });
    const temp = await getDefaultPromptTemplate(newChatRoom);
    if (temp) {
      setPromptTemplate(temp.data);
    }
  };

  useEffect(() => {
    if (newChatRoom) {
      const getDefaultPrompt = async () => {
        const temp = await getDefaultPromptTemplate(newChatRoom);
        if (temp) {
          setPromptTemplate(temp.data);
        }
      };
      getDefaultPrompt();
    }
  }, [newChatRoom]);

  return (
    <div
      className={styles['signup']}
      style={{
        justifyContent: isPublishUrl && !JSModule?.testProject ? 'center' : '',
      }}
    >
      <div
        className={styles['sidebar']}
        style={{ width: isPublishUrl ? 'initial' : '' }}
      >
        {!JSModule?.testProject && !isPublishUrl && (
          <ChatbotInfo chatBotId={newChatRoom} />
        )}
        {JSModule?.testProject && (
          <div
            style={{
              backgroundImage: `url('./background.webp')`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              width: '518px',
              height: '848px',
              padding: '20px',
              boxSizing: 'border-box',
              paddingTop: '102px',
              fontFamily: 'Aspekta',
              position: 'relative',
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: htmlFile }} />
          </div>
        )}
      </div>
      <div
        className={styles['main-content']}
        style={{
          width: isPublishUrl && !JSModule?.testProject ? 'initial' : '100%',
        }}
      >
        <div className={styles['main-header']}>
          <span>{JSModule?.getTitle}</span>
          {JSModule?.testProject ? (
            <Button variant="link">
              <ChatIcon />
              Chat with Platform Support
            </Button>
          ) : (
            <div className="flex items-center ">
              <button
                className={`${styles.buttonWrapper} bg-white mr-4`}
                onClick={() => setPromptModal(true)}
              >
                Custom Prompt
              </button>
              {promptModal && (
                <PromptModal
                  onChangeHandler={onPromptChange}
                  onClose={(val: string | undefined) => {
                    val === 'submit' ? updatePrompt() : null;
                    setPromptModal(false);
                  }}
                  resetTemplate={resetdefaultPromptTemplate}
                  data={promptTemplate}
                  onSubmit={() => updatePrompt()}
                />
              )}

              {!isPublishUrl && (
                <div className="flex">
                  <button
                    className={`${styles.buttonWrapper}`}
                    onClick={() => {
                      window.alert(
                        `Copy the Url for chatbot - ${currentUrl}?chat-id=${newChatRoom}`,
                      );
                    }}
                  >
                    Publish & Share
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={styles['main']}>
          {isSignupPage ? (
            <div className={styles['registerguy']}>
              <RegisterationGuy />
              <h3>{registrationMessage?.title}</h3>
              <span>{registrationMessage?.description}</span>
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
                        <div style={{ paddingRight: '20px' }}>
                          <Image
                            key={index}
                            src="/bot-image.png"
                            alt="AI"
                            width="40"
                            height="40"
                            className={styles.boticon}
                            priority
                          />
                        </div>
                      );
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
                      <Fragment key={index}>
                        {message?.step?.header && (
                          <div className={homestyles?.headerContainer}>
                            <div className={homestyles?.stepCircle}>
                              {message?.step?.header?.step}
                            </div>
                            <div className={homestyles?.stepText}>
                              {message?.step?.header?.text}
                            </div>
                          </div>
                        )}
                        <div key={`chatMessage-${index}`} className={className}>
                          <div className={homestyles?.container}>
                            {icon}
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                              }}
                            >
                              {message?.type == 'apiMessage' ? (
                                <span className={homestyles?.botName}>
                                  {JSModule?.botName}
                                </span>
                              ) : (
                                <span className={homestyles?.botName}>You</span>
                              )}
                              <div className={homestyles?.markdownanswer}>
                                <span
                                  className={homestyles?.markdownanswerspan}
                                >
                                  <div style={{ display: 'flex' }}>
                                    <div
                                      style={
                                        message?.type !== 'apiMessage' &&
                                        editableIndex === index
                                          ? {
                                              border: '2px solid black',
                                              padding: '2.5px',
                                            }
                                          : undefined
                                      }
                                      contentEditable={
                                        message?.type !== 'apiMessage' &&
                                        editableIndex === index
                                          ? true
                                          : false
                                      }
                                    >
                                      <ReactMarkdown
                                        // @ts-ignore
                                        rehypePlugins={[rehypeRaw]}
                                      >
                                        {message.message}
                                      </ReactMarkdown>
                                    </div>
                                    {message?.error && (
                                      <div
                                        style={{
                                          color: 'red',
                                          paddingLeft: '4px',
                                          fontWeight: 'bold',
                                        }}
                                      >
                                        ({message?.errorMessage})
                                      </div>
                                    )}
                                  </div>
                                </span>
                                {JSModule?.conversational && (
                                  <div className={homestyles?.extraContainer}>
                                    {message.type === 'apiMessage' &&
                                    message?.step?.inputType ===
                                      'radioButton' ? (
                                      <RadioGroup
                                        options={message?.step?.options}
                                        value={message?.step?.default}
                                        disabled={
                                          index !== messages.length - 1
                                            ? true
                                            : false
                                        }
                                        onChange={(value) => {
                                          if (index === messages.length - 1) {
                                            handleSubmit(value);
                                          }
                                        }}
                                      />
                                    ) : null}
                                    {message.type === 'apiMessage' &&
                                    message?.step?.inputType === 'html' ? (
                                      <>
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: message?.step?.html,
                                          }}
                                        />
                                      </>
                                    ) : null}
                                    {message.type === 'apiMessage' &&
                                    message?.step?.inputType ===
                                      'googleLogin' ? (
                                      <GoogleLoginComponent
                                        disabled={
                                          index !== messages.length - 1
                                            ? true
                                            : false
                                        }
                                        handleSubmit={(value) => {
                                          if (index === messages.length - 1) {
                                            handleSubmit(value);
                                          }
                                        }}
                                        options={message?.step?.options}
                                        value={message?.step?.answer}
                                      />
                                    ) : null}
                                    {message?.step?.inputType === 'password' &&
                                    index !== messages.length - 1 ? (
                                      <PasswordInput
                                        disabled={
                                          message?.step?.disabled || true
                                        }
                                        value={message?.step?.answer}
                                        onChange={() => null}
                                      />
                                    ) : null}
                                    {message?.step?.inputType ===
                                    'loginPasswordAsk' ? (
                                      <LoginPasswordAsk
                                        disabled={
                                          index !== messages.length - 1
                                            ? true
                                            : false
                                        }
                                        onSave={(value) => {
                                          if (index === messages.length - 1) {
                                            handleSubmit(value);
                                          }
                                        }}
                                        options={message?.step?.options}
                                      />
                                    ) : null}
                                    {message?.step?.inputType === 'address' ? (
                                      <Address
                                        states={stateOptions}
                                        cities={cityOptions}
                                        onSave={() => {
                                          if (index === messages.length - 1) {
                                            handleSubmit();
                                          }
                                        }}
                                        zip={''}
                                        street={''}
                                      />
                                    ) : null}
                                    {message?.step?.inputType ===
                                    'cardRadio' ? (
                                      <CardRadioGroup
                                        value={message?.step?.default}
                                        disabled={
                                          index !== messages.length - 1
                                            ? true
                                            : false
                                        }
                                        onChange={(value) => {
                                          if (index === messages.length - 1) {
                                            handleSubmit(value);
                                          }
                                        }}
                                        options={message?.step?.options}
                                      />
                                    ) : null}
                                    {message?.step?.inputType ===
                                    'columnCards' ? (
                                      <ColumnCards
                                        disabled={
                                          index !== messages.length - 1
                                            ? true
                                            : false
                                        }
                                        onChange={(value) => {
                                          if (index === messages.length - 1) {
                                            handleSubmit(value);
                                          }
                                        }}
                                        options={message?.step?.options}

                                        // selectedValue={'value'}
                                      />
                                    ) : null}
                                    {message?.step?.inputType === 'select' ? (
                                      <SelectInputField
                                        value={message?.step?.default}
                                        onChange={(value) => {
                                          if (index === messages.length - 1) {
                                            handleSubmit(value);
                                          }
                                        }}
                                        options={message?.step?.options}
                                      />
                                    ) : null}
                                    {message?.step?.inputType ===
                                    'multiselect' ? (
                                      <MultiSelectInput
                                        value={message?.step?.default}
                                        onChange={(value) => {
                                          if (index === messages.length - 1) {
                                            handleSubmit(value);
                                          }
                                        }}
                                        options={message?.step?.options}
                                      />
                                    ) : null}
                                    {message?.step?.inputType ===
                                    'autoComplete' ? (
                                      <AutoCompleteInput
                                        value={message?.step?.default}
                                        onChange={(value) => {
                                          if (index === messages.length - 1) {
                                            handleSubmit(value);
                                          }
                                        }}
                                        options={message?.step?.options}
                                        disabled={false}
                                      />
                                    ) : null}
                                    {message?.step?.inputType ===
                                    'checkboxButton' ? (
                                      <CheckboxGroup
                                        values={''}
                                        options={message?.step?.options}
                                        onChange={(value) => {
                                          if (index === messages.length - 1) {
                                            handleSubmit(value);
                                          }
                                        }}
                                      />
                                    ) : null}
                                    {message?.step?.inputType === 'invoice' ? (
                                      <Invoice
                                        options={message?.step?.options}
                                        values={message?.step?.options}
                                        disabled={
                                          index !== messages.length - 1
                                            ? true
                                            : false
                                        }
                                        onChange={(value) => {
                                          if (index === messages.length - 1) {
                                            handleSubmit(value);
                                          }
                                        }}
                                      />
                                    ) : null}
                                    {message?.step?.inputType === 'search' ? (
                                      <SearchInput
                                        width={'100%'}
                                        containerwidth={'90%'}
                                        onChange={(value) => {
                                          if (index === messages.length - 1) {
                                            handleSubmit(value);
                                          }
                                        }}
                                      />
                                    ) : null}
                                    {message?.step?.inputType === 'bottext' ? (
                                      <NextFunction
                                        handleSubmit={handleSubmit}
                                      />
                                    ) : null}
                                    {message?.step?.inputType ===
                                    'constructiondetails' ? (
                                      <ShowDetails
                                        options={message?.step?.options}
                                        onSave={() => {
                                          if (index === messages.length - 1) {
                                            handleSubmit();
                                          }
                                        }}
                                      />
                                    ) : null}
                                    {message?.step?.inputType ===
                                    'fileUploader' ? (
                                      <FileUploadComponent
                                        handleSubmit={(value, files) => {
                                          if (index === messages.length - 1) {
                                            handleSubmit(value);
                                            uploadFilehandler(files);
                                          }
                                        }}
                                      />
                                    ) : null}
                                    {message?.step?.inputType === 'summary' ? (
                                      <>
                                        <Summary
                                          data={message?.step?.data}
                                          onChange={() => {
                                            if (index === messages.length - 1) {
                                              handleSubmit();
                                            }
                                          }}
                                        />
                                      </>
                                    ) : null}
                                    {message?.step?.inputType ===
                                    'tableComponent' ? (
                                      <Table
                                        products={message.step.options}
                                        onChange={(value) => {
                                          if (index === messages.length - 1) {
                                            handleSubmit(value);
                                          }
                                        }}
                                      />
                                    ) : null}
                                    {message?.step?.inputType ===
                                    'costCards' ? (
                                      <CostCards
                                        options={message.step.options}
                                        onChange={(value) => {
                                          if (index === messages.length - 1) {
                                            handleSubmit(value);
                                          }
                                        }}
                                      />
                                    ) : null}
                                    {message?.step?.inputType ===
                                    'InstallationInfo' ? (
                                      <InstallationInfo
                                        onChange={(value) => {
                                          if (index === messages.length - 1) {
                                            handleSubmit(value);
                                          }
                                        }}
                                      />
                                    ) : null}
                                    {message?.step?.inputType === 'Stripe' ? (
                                      <StripeComponent
                                        options={message.step.options}
                                        onClose={(value) => {
                                          if (index === messages.length - 1) {
                                            handleSubmit(value);
                                          }
                                        }}
                                      />
                                    ) : null}
                                    {message?.step?.inputType ===
                                    'dateTimePicker' ? (
                                      <DateTimePicker
                                        onClose={(value) => {
                                          if (index === messages.length - 1) {
                                            handleSubmit(value);
                                          }
                                        }}
                                      />
                                    ) : null}
                                    {message?.step?.inputType ===
                                    'costMilestone' ? (
                                      <CostMilestone
                                        options={message.step.options}
                                        disabled={
                                          index !== messages.length - 1
                                            ? true
                                            : false
                                        }
                                        onClose={(value: string) => {
                                          if (index === messages.length - 1) {
                                            handleSubmit(value);
                                          }
                                        }}
                                      />
                                    ) : null}
                                    {message?.step?.inputType ===
                                    'ProjectCard' ? (
                                      <ProjectCard
                                        options={message.step.options}
                                      />
                                    ) : null}
                                    {message?.step?.inputType ===
                                    'RatingCard' ? (
                                      <RatingCard
                                        options={message.step.options}
                                        onClose={(value) => {
                                          if (index === messages.length - 1) {
                                            handleSubmit(value);
                                          }
                                        }}
                                      />
                                    ) : null}
                                    {message?.step?.inputType ===
                                    'ReferralCard' ? (
                                      <ReferralCard
                                        disabled={
                                          index !== messages.length - 1
                                            ? true
                                            : false
                                        }
                                        onClose={(value) => {
                                          if (index === messages.length - 1) {
                                            handleSubmit(value);
                                          }
                                        }}
                                      />
                                    ) : null}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className={homestyles?.editbtn}>
                            {message?.type !== 'apiMessage' &&
                            editableIndex !== index &&
                            !message?.error ? (
                              <Button
                                variant="link"
                                onClick={() => {
                                  setEditableIndex(index);
                                }}
                              >
                                <Pencil /> Edit
                              </Button>
                            ) : message?.type !== 'apiMessage' &&
                              editableIndex === index &&
                              !message?.error ? (
                              <Button
                                variant="link"
                                onClick={() => {
                                  setEditableIndex(null);
                                  console.log(
                                    'message from save ==> ',
                                    message,
                                  );
                                }}
                              >
                                Save
                              </Button>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              </div>
              <div className={homestyles?.center}>
                <div className={homestyles?.cloudform}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                  >
                    <textarea
                      disabled={disableInput || loading}
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
                      disabled={!query || loading}
                      className={homestyles?.generatebutton}
                      style={{
                        background:
                          JSModule?.sendIcon && !loading
                            ? JSModule?.themeColor
                            : '',
                      }}
                    >
                      {loading ? (
                        <div className={homestyles?.loadingwheel}>
                          <LoadingDots color="#000" />
                        </div>
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              JSModule?.sendIcon ??
                              `
                          <svg viewBox="0 0 20 20" class="Home_svgicon__PLaWz" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z">
                            </path>
                        </svg>
                          `,
                          }}
                        />
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

export default Chatbot;
