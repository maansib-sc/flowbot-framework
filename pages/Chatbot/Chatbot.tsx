import {
  getDefaultPromptTemplate,
  resetPromptTemplate,
  submitPromptTemplate,
} from '@/apiRequests';
import HamburgerIcon from '@/assets/HamburgerIcon';
import ChatIcon from '@/assets/svgs/ChatIcon';
import DownloadIcon from '@/assets/svgs/DownloadIcon';
import Libby from '@/assets/svgs/Libby';
import PdfIcon from '@/assets/svgs/PdfIcon';
import Pencil from '@/assets/svgs/Pencil';
import You from '@/assets/svgs/You';
import ToolTip from '@/assets/svgs/icons/ToolTip';
import NextFunction from '@/components/NextFunction';
import { PromptModal } from '@/components/customPromptModal';
import Address from '@/components/ui/Address/Address';
import AutoCompleteInput from '@/components/ui/AutoCompleteInput/AutoCompleteInput';
import Button from '@/components/ui/Buttons/Button';
import CheckboxGroup from '@/components/ui/Checkbox/CheckboxGroup';
import CostCards from '@/components/ui/CostCards/CostCards';
import CostMilestone from '@/components/ui/CostMilestone/CostMilestone';
import DateTimePicker from '@/components/ui/DateTimePicker/DateTimePicker';
import FileUploadComponent from '@/components/ui/FileUpload/FileUploadComponent';
import PasswordInput from '@/components/ui/Input/PasswordInput';
import InstallationInfo from '@/components/ui/InstallationInfo/InstallationInfo';
import Invoice from '@/components/ui/Invoice/Invoice';
import Loader from '@/components/ui/Loader/Loader';
import LoadingDots from '@/components/ui/LoadingDots';
import LoginPasswordAsk from '@/components/ui/LoginPasswordAsk/LoginPasswordAsk';
import MultiSelectInput from '@/components/ui/MutiSelectInput/MultiSelectInput';
import ProjectCard from '@/components/ui/ProjectCard/ProjectCard';
import CardRadioGroup from '@/components/ui/Radio/CardRadioGroup';
import ColumnCards from '@/components/ui/Radio/ColumnCards';
import GoogleLoginComponent from '@/components/ui/Radio/GoogleLoginComponent';
import RadioGroup from '@/components/ui/Radio/RadioGroup';
import RatingCard from '@/components/ui/RatingCard/RatingCard';
import ReferralCard from '@/components/ui/ReferralCard/ReferralCard';
import SearchInput from '@/components/ui/Search/Search';
import SelectInputField from '@/components/ui/SelectInputField/SelectInputField';
import ShowDetails from '@/components/ui/ShowDetails/ShowDetails';
import StripeComponent from '@/components/ui/StripeComponent/StripeComponent';
import Summary from '@/components/ui/Summary/Summary';
import Table from '@/components/ui/Table/Table';
import { Message } from '@/types/chat';
import { generateRandomString } from '@/utils/generateRandomeString';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useRef, useState } from 'react';
import { InlineWidget } from "react-calendly";
import ReactMarkdown from 'react-markdown';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import rehypeRaw from 'rehype-raw';
import type { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import FileList from './File';

declare const window: any;

const Chatbot = () => {
  const [botLoading, setBotLoading] = useState<Boolean>(true);
  const [isSignupPage, setIsSignupPage] = useState(false);
  const [JSModule, setJSModule] = useState<any>(null);
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [registrationMessage, setRegistrationMessage] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [currentSession, setCurrentSession] = useState<string>('');
  const router = useRouter();
  const {
    query: { 'chat-id': chatId, code: openidCode },
  } = router;
  const [initChat, setInitChat] = useState<boolean>(false);
  const [newChatRoom, setNewChatRoom] = useState<string>('');
  const [isPublishUrl, setIsPublishUrl] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [promptModal, setPromptModal] = useState<boolean>(false);
  const [promptTemplate, setPromptTemplate] = useState<string | any>('');
  const [editableIndex, setEditableIndex] = useState<number | null>(null);
  const [disableInput, setDisableInput] = useState(false);
  const [hiddenInput, setHiddenInput] = useState(false);

  const [leftPanelHtml, setLeftPanelHtml] = useState('');
  const [headerPaneHtml, setHeaderPaneHtml] = useState('');
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('right');
  const [chatbots, setChatbots] = useState([])
  const [pdfList, setPdfList] = useState<
  { name?: string; training_id?: string; is_trained: boolean }[]
>([]);
  const fileInputRef = useRef(null);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [selectedFileType, setSelectedFileType] = useState<string>('PDF');
  const [selecteduploadFile, setSelecteduploadFile] = useState<File | null>(
    null,
  );
  const [trainingInProgress, setTrainingInProgress] = useState(false);



  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [],
    history: [],
  });
  const [styles, setStyle] = useState<any>({});
  const { messages, history } = messageState;
  const [typingState, setTypingState] = useState<boolean>(false);

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
          console.log("modeule",module)
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
        setBotLoading(false);
    } 
    // else {
    //   setCurrentSession(generateRandomString('session_', 9));
    //   import(`@/configuration/default/webapp`).then((module) => {
    //     setJSModule(module);
    //   });
    //   import(`@/configuration/default/webapp/Index.module.css`).then(
    //     (module) => {
    //       setStyle(module);
    //     },
    //   );
    // }
  }, [chatId]);

  useEffect(() => {
    if (!initChat && JSModule && JSModule?.conversational && chatId) {
      setInitChat(true);
      handleSubmit();
    } else {
      setInitChat(false);
      setMessageState({
        messages: [],
        history: [],
      });
    }
    if (JSModule) {
      setLeftPanelHtml(JSModule?.leftPanelHtml);
      window.handleLeftPanel = JSModule?.handleLeftPanel;
      setHeaderPaneHtml(JSModule?.headerPaneHtml);
      window.handleHeaderPane = JSModule?.handleHeaderPane;
    }
  }, [JSModule]);

  useEffect(() => {
    let access_token = localStorage.getItem('access_token');
    if (access_token && JSModule?.handleHeaderPane) {
      JSModule?.handleHeaderPane('login');
    }
  }, [JSModule?.handleHeaderPane]);

  useEffect(() => {
    const getToken = async () => {
      try {
        if (openidCode && JSModule?.openid) {
          const response = await fetch(JSModule?.openid?.token_endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              client_id: JSModule?.openid?.client_id,
              code: openidCode as string,
              redirect_uri: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}?chat-id=${chatId}`,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const { access_token } = data;

            localStorage.setItem('access_token', access_token);
            window.location.href = `/?chat-id=${chatId}`;
          } else {
            console.error('Token request failed:', response.statusText);
          }
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    getToken();
  }, [openidCode, JSModule?.openid]);

  async function nextStep() {
    setActiveIndex(1);
    handleSubmit();
  }

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

  const handleInputChange = (event: any) => {
    const newContent = event.target.innerText;
    setContent(newContent);
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

  function getContent(index: number) {
    messages.splice(index, 2)
    setMessageState((state) => ({
      ...state,
      messages: [...messages],
    }));
  }

  // remove redirect url parameters
  function removeAuthTokenFromURL() {
    let currentUrl = window.location.href;
    if (currentUrl.includes('authtoken=')) {
      const urlParams = new URLSearchParams(window.location.search);
      const chatIdParam = urlParams.get('chat-id');
      const newSearchParams = new URLSearchParams();
      if (chatIdParam) {
        newSearchParams.set('chat-id', chatIdParam);
      }
      const updatedUrl = `${window.location.origin}${window.location.pathname}?${newSearchParams.toString()}${window.location.hash}`;
      window.history.replaceState({ path: updatedUrl }, '', updatedUrl);
    }
    return
  }

  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketState, setSocketState] = useState(false);
  const [socketInitstate,setSocketInitstate] = useState(false)

  useEffect(()=>{

  const initializeSocket = async () => {
    console.log('socket base url____',JSModule?.socket_base_url)
    await fetch('/api/chat-socket');
    const newSocket = io(`${JSModule?.socket_base_url}`, { path: '/socket.io' });


    console.log('current session----', currentSession);


    newSocket.on('connect', () => {
      console.log('connected');
      newSocket.emit('join-room', currentSession);
    });

    newSocket.on('received-slack-message', (data)=>{
      console.log('slack-message received',data)
      setMessageState((state) => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'apiMessage',
            message: `${data.message}`,
            src: 'talkingDb',
            step: {},
            id: Math.random(),
          },
        ],
      }));
      setTypingState(false);
    })

    newSocket.on('received-slack-user-typing', (data) => {
      console.log('typing data received =>', data);
      setTypingState(true);
    })

      newSocket.on('close-socket-connection',(data) =>{
        if(socketState){
          console.log('socket closed successfully',data)
          setSocketState(false)
          handleSubmit('dummy')
        }
      })

    setSocket(newSocket);

    return () => newSocket.disconnect();
  };
    if(JSModule?.socket_base_url){
      initializeSocket()
    }
  },[JSModule?.socket_base_url])


 const sendChatbotMessage = async (message: string, sessionId: string) => {
   if (socket && socket.connected) {
     socket.emit('chatbot-message', { message, sessionId });
     setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: `${message}`,
          src: 'talkingDb',
          step: {},
          id: Math.random(),
        },
      ],
    }));
   } else {
     console.error('Socket not initialized');
   }
 };


 const handleSocket = async (value?: string) => {
   if (!socket || !socket.connected) {
     setSocketState(false)
   }
   if(value && currentSession){
     await sendChatbotMessage(value,currentSession)
   }
 };

 const changeSocketState = async () =>{
  setSocketInitstate(!socketInitstate)
 }


  async function handleSubmit(value?: string, update: boolean=false, socketMode : boolean= false) {
    setLoading(true);
    console.log('socket status',socketState)
    if(socketMode){
      setLoading(false)
    }
     if (socketState && !value) {
      setQuery('');
      console.log('inside setSocket true',value)
      console.log('inside setSocket query', query)
      await handleSocket(query);
      setLoading(false);
   } else {
    let question = query.trim();
    if (!query) {
      question = value?.trim() || '';
    }
    if(question && JSModule?.showRadioSelection) {
      if (question) {console.log('questionm',question)
      setMessageState((state) => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'userMessage',
            message: `${JSON.parse(question)['label']}`,
            src: "test",
            id: Math.random(),
          },
        ],
      }));}
    }
    
    if(query && JSModule?.showUserResponseFirst){
      if (question) {console.log('questionm',question)
      setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: `${question}`,
          src: "test",
          id: Math.random(),
        },
      ],
    }));}}
    setQuery('');
    try {
      let access_token = localStorage.getItem('access_token');
      const response = await fetch(
        `/api/chat?pinecone_name_space=${newChatRoom}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({
            question,
            history,
            session: currentSession,
            reqQuery: router.query,
            edit: update
          }),
        },
      );
      const data = await response.json();
      console.log("data",data)
      if (data?.redirect) {
        window.location.href = data.redirect;
        return;
      }
      if (data?.currentStep?.windowOpen) {
        window.open(data?.currentStep?.windowOpen,"_blank")
      }
      if (data?.currentStep?.updateLeftPanel) {
        setLeftPanelHtml(data?.currentStep?.updateLeftPanel);
      }
      if (
        data?.currentStep?.inputType === 'socket' && data?.src === 'apiMessage'
      ) {
        setSocketState(true)
      }
      else if(data?.currentStep?.inputType === 'socket'){
        await changeSocketState()
        setSocketState(true)
        handleSubmit('', false, true);
      }
      if (data?.currentStep?.await) {
        setTimeout(() => {
          handleSubmit('dummy', false);
        }, data.currentStep.await);
      }
      if (data.error) {
        if (data?.currentStep?.hideUserResponse) {
          let stepInfo = JSON.parse(JSON.stringify(data.currentStep));
          {
            /* @ts-ignore */
          }
          stepInfo['inputType'] = 'text';
          if (data.currentStep.showQuestion) {
            setMessageState((state) => ({
              ...state,
              messages: [
                ...state.messages,
                {
                  type: 'apiMessage',
                  message: `${data.errorMessage}`,
                  src: data.src,
                  step: stepInfo || {},
                  sourceDocs: data.sourceDocuments,
                  id: Math.random(),
                },
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
          } else {
            setMessageState((state) => ({
              ...state,
              messages: [
                ...state.messages,
                {
                  type: 'apiMessage',
                  message: `${data.errorMessage}`,
                  src: data.src,
                  step: data.currentStep || {},
                  sourceDocs: data.sourceDocuments,
                  id: Math.random(),
                },
              ],
            }));
          }
        } else if(JSModule?.showUserResponseFirst){
          setMessageState((state) => ({
            ...state,
            messages: [
              ...state.messages,
              {
                type: 'apiMessage',
                message: `${data.errorMessage}`,
                src: data.src,
                step: data.currentStep || {},
                sourceDocs: data.sourceDocuments,
                id: Math.random(),
              },
            ],
            history: [
              ...state.history,
              [question, data?.currentStep?.answer || question],
            ],
          }));
        }else{
          setMessageState((state) => ({
            ...state,
            messages: [
              ...state.messages,
              {
                type: 'userMessage',
                message: data?.currentStep?.answer || question,
                src: 'test',
                id: Math.random(),
              },
              {
                type: 'apiMessage',
                message: `${data.errorMessage}`,
                src: data.src,
                step: data.currentStep || {},
                sourceDocs: data.sourceDocuments,
                id: Math.random(),
              },
            ],
            history: [
              ...state.history,
              [question, data?.currentStep?.answer || question],
            ],
          }));
        }
      } else {
        if (data.currentStep.fullWidth) {
          setRegistrationMessage(data.currentStep);
          setIsSignupPage(true);
          return;
        }
        if (!data.hideAnswer && (data.currentStep.answer || question) &&  !JSModule?.showUserResponseFirst) {
          setMessageState((state) => ({
            ...state,
            messages: [
              ...state.messages,
              {
                type: 'userMessage',
                message: data?.currentStep?.answer || question,
                src: 'test',
                id: Math.random(),
              },
            ],
          }));
        }
        if (data.currentStep.update) {
          JSModule?.leftPanelStateUpdate(+data.currentStep.header.step);
        }
        setIsSignupPage(false);
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

      if (data.currentStep?.inputHidden) {
        setHiddenInput(true);
      } else {
        setHiddenInput(false);
      }
      setContent('')
      setLoading(false);
      removeAuthTokenFromURL()
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
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


  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    setShowLoading(true);
    const timeout = setTimeout(() => {
      setShowLoading(false);
    }, 60000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(()=>{
    const fetchData = async (chatbotUrl: string, apiKey: string) => {
      try {
        const response = await fetch(chatbotUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'API-KEY': apiKey
          }
        });
        const jsonData = await response.json();
        console.log("data response::::::", jsonData.data)
        setChatbots(jsonData.data)
        setPdfList(jsonData.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if(JSModule?.trainedChatbotUrl){
      console.log("inside chatbot call:::::")
      fetchData(JSModule?.trainedChatbotUrl as string, JSModule?.trainedChatbotAPIKey as string);
    }
  },[JSModule])


  const [uploading, setUploading] = useState(false);



  useEffect(()=>{
    const fetchData = async (chatbotUrl: string, apiKey: string) => {
      try {
        const response = await fetch(chatbotUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'API-KEY': apiKey
          }
        });
        const jsonData = await response.json();
        console.log("data response::::::", jsonData.data)
        setChatbots(jsonData.data)
        setPdfList(jsonData.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const uploadPDFFile = async (uploadUrl: string, apiKey: string) => {
      setUploading(true);
      const FormData = require('form-data');
      let data = new FormData();
      data.append('file', selecteduploadFile);
  
      try {
        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'API-KEY': apiKey
          },
          body: data
        });
        const jsonData = await response.json();
        console.log("uploaded data----::::::", jsonData)
        console.log("filename",selecteduploadFile?.name)
        fetchData(JSModule?.trainedChatbotUrl as string, JSModule?.trainedChatbotAPIKey as string);
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false); 
      }
    }

    if(JSModule?.documentUploadUrl && selecteduploadFile){
      console.log("inside upload call:::::")
      uploadPDFFile(JSModule?.documentUploadUrl as string, JSModule?.trainedChatbotAPIKey as string);
    }
  },[selecteduploadFile])


  const handlePDFFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setShowLoader(true);
      setSelectedFileType('PDF');
      setSelecteduploadFile(selectedFile);
      setTrainingInProgress(true);
    }
  };

  if(botLoading || !(JSModule?.enabled)){
    return(
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div style={{ width: '150px',  height: '150px' }}>
          <Loader loader="https://lottie.host/d1fd738a-f930-465e-b6ff-cf2412f791db/8r36ZWTWb2.json" />
        </div>
      </div>
    )
  }
  else{
  return (
    <div className={styles['container']}>
      {JSModule?.drawerEnabled && (
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          direction="right"
          className="bla bla bla"
          style={{ width: '400px' }}
        >
          <div className={styles['HamburgerContainer']}>
            <div className={styles['HamburgerHeaderContainer']}>
              <div className={styles['HamburgerHeader']}>
                Trained on documents
              </div>
            </div>
            <div className={styles['DataContainer']}>
              {chatbots.map((chatbot, index) => (
                <div key={index} className={styles['DataItem']}>
                  <PdfIcon />
                  <span>{chatbot?.name}</span>
                </div>
              ))}
            </div>
            <div className={styles['Divider']}></div>
            <div className={styles['UploaderHeader']}>Upload Document</div>
            <div className={styles['UploadContainer']}>
              {!uploading ? <div className={styles['UploadButtonContainer']}>
                <label className={styles['uploadButton']}>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={handlePDFFileChange}
                    ref={fileInputRef}
                  />
                  <div style={{ transform: 'translateY(2px)' }} >
                  <DownloadIcon />
                  </div>
                  <span style={{ transform: 'translateY(-2px)' }} className="mt-2 text-base leading-normal">
                    Select a file
                  </span>
                </label>
                <div>
                   <span>Supported Files: Pdf</span>
                </div>
              </div>:
               <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
               <div style={{ width: '150px',  height: '150px' }}>
                 <Loader loader="https://lottie.host/d1fd738a-f930-465e-b6ff-cf2412f791db/8r36ZWTWb2.json" />
               </div>
             </div>
              }
              
            </div>
            {pdfList &&
            <div style={{ width: '100%' }}>
              {pdfList.map((item, index) => {
                return (
                  <FileList
                    key={index}
                    selectedFileType={selectedFileType}
                    filename={item.name || item.training_id}
                    index={index}
                    progressUrl={JSModule?.trainedChatbotProgressUrl}
                    apiKey={JSModule?.trainedChatbotAPIKey}
                    trained={item.is_trained}
                    setTrainingInProgress={setTrainingInProgress}
                  />
                );
              })}
            </div>}
            {/* <div className={styles['InProgressContainer']}>
                <div className={styles['DataItem']}>
                    <PdfIcon />
                    
                  </div>
              </div> */}
          </div>
        </Drawer>
      )}
      {JSModule?.drawerEnabled && (
        <div style={{ position: 'absolute', top: 8, right: 20 }}>
          <span
            style={{ cursor: 'pointer', background: 'transparent' }}
            onClick={() => setOpen(true)}
          >
            <HamburgerIcon />
          </span>
        </div>
      )}
      {JSModule?.enabled && (
        <div
          className={styles['sidebar']}
          dangerouslySetInnerHTML={{ __html: leftPanelHtml }}
        />
      )}
      <div className={styles['main-content']}>
        {headerPaneHtml || JSModule?.headerPaneHtml ? (
          <div
            className={styles['main-header']}
            dangerouslySetInnerHTML={{ __html: headerPaneHtml }}
          />
        ) : (
          <div className={styles['main-header']}>
            <span>{JSModule?.getTitle}</span>
            {JSModule?.enabled ? (
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
        )}

        <div className={styles['main']}>
          {/* TODO: Move RegisterationGuy to conf */}
          {isSignupPage ? (
            <div className={styles['registerguy']}>
              {registrationMessage?.image && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: registrationMessage?.image,
                  }}
                />
              )}
              <h3>{registrationMessage?.title}</h3>
              <span>
                <ReactMarkdown
                  // @ts-ignore
                  rehypePlugins={[rehypeRaw]}
                >
                  {registrationMessage?.description}
                </ReactMarkdown>
              </span>
              <Button onClick={() => nextStep()}>
                {registrationMessage?.buttonText || `Get Started → `}
              </Button>
            </div>
          ) : (
            <>
              <div className={styles?.cloud}>
                <div ref={messageListRef} className={styles?.messagelist}>
                  {/* TODO: Move Icon to conf */}
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
                      if (JSModule?.enabled) {
                        icon = (
                          <div className={styles?.libby}>
                            {JSModule.chatbotIcon ? (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: JSModule.chatbotIcon,
                                }}
                              />
                            ) : (
                              <Libby />
                            )}
                          </div>
                        );
                      }
                      className = styles?.apimessage;
                    } else {
                      icon = (
                        <div className={styles?.libby}>
                          {JSModule.userIcon ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: JSModule.userIcon,
                              }}
                            />
                          ) : (
                            <You />
                          )}
                        </div>
                      );
                      // The latest message sent by the user will be animated while waiting for a response
                      className =
                        loading && index === messages?.length - 1
                          ? styles?.usermessagewaiting
                          : styles?.usermessage;
                    }
                    return (
                      <Fragment key={index}>
                        {message?.step?.header && (
                          <div className={styles?.headerContainer}>
                            <div className={styles?.stepCircle}>
                              {message?.step?.header?.step}
                            </div>
                            <div className={styles?.stepText}>
                              {message?.step?.header?.text}
                            </div>
                          </div>
                        )}
                        <div key={`chatMessage-${index}`} className={className}>
                          <div
                            className={styles?.container}
                            style={{ flexDirection: JSModule?.conversationLayout ? (message?.type == 'apiMessage' ? 'row' : 'row-reverse') : 'row' }}
                          >
                            { !JSModule?.hideBotIcon && 
                              <div>
                                {icon}
                              </div>
                            }

                            {
                              JSModule?.conversationLayout && 
                              message?.type == 'apiMessage' && 
                              (index === messages.length - 1 || (index < messages.length - 1 && messages[index + 1]?.type !== 'apiMessage')) &&
                              <div className={styles?.botIcon}>
                                {icon}
                              </div>
                            }
                            
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                // marginRight:  message?.type == 'apiMessage' ? '0px' : '10px',
                              }}
                              
                            >
                              {!JSModule?.hideBotIcon && 
                                <>
                                  {message?.type == 'apiMessage' ? (
                                  <span
                                    className={styles?.botName}
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      gap: '2px',
                                      width: '100%',
                                    }}
                                  >
                                    {JSModule?.botName}
                                    {message?.step?.tooltip && (
                                      <p
                                        title={message?.step?.tooltip}
                                        className={styles?.tooltipIcon}
                                      >
                                        <ToolTip />
                                      </p>
                                    )}
                                  </span>
                                  ) : (
                                    <span
                                      className={styles?.botName}
                                      style={{
                                        textAlign: JSModule?.conversationLayout ? 'right' : 'left'
                                      }}
                                    >You</span>
                                  )}
                                </>
                              }
                              
                              <div
                                className={`${styles?.markdownanswer}`}
                                style={{
                                  maxWidth: message?.step?.showBotIcon && JSModule?.conversationLayout ? 'auto' : '90%',
                                  marginLeft: (!(index === messages.length - 1 || (index < messages.length - 1 && messages[index + 1]?.type !== 'apiMessage'))) && JSModule?.conversationLayout ? '2rem' : '',
                                  width: '100%',
                                  alignSelf: message?.type == 'userMessage' && JSModule?.conversationLayout ? 
                                            'self-end' : 
                                            message?.type == 'apiMessage' && JSModule?.conversationLayout ?
                                            'self-start' :
                                            'flex-start',
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}
                              >
                                <span 
                                  className={`${styles?.markdownanswerspan} ${message?.type == 'apiMessage' ? styles?.chat_container_left : styles?.chat_container_right}`}
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
                                      onInput={handleInputChange}
                                    >
                                      <ReactMarkdown
                                        // @ts-ignore
                                        rehypePlugins={[rehypeRaw]}
                                        components={{
                                          p: ({ node, children, ...props }) => (
                                            <p
                                              className={
                                                styles?.userMessageFont
                                              }
                                              {...props}
                                            >
                                              {children}
                                            </p>
                                          ),
                                        }}
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
                                {showLoading &&( JSModule?.conversationLayout && ((message?.step?.inputType === 'await' && index === messages.length - 1) || ( typingState && index === messages.length - 1) || ( loading && index === messages.length - 1 )) )&&
                                <span
                                  className={`${styles?.markdownanswerspan} ${message?.type == 'apiMessage' ? styles?.chat_container_left : styles?.chat_container_right}`}
                                  style={{
                                    width: '40px',
                                    marginTop: '20px',
                                  }}
                                >
                                  <LoadingDots color="#000" />
                                  
                                </span>}
                                
                                {JSModule?.conversational && (
                                  <div className={styles?.extraContainer}>
                                    {message.type === 'apiMessage' &&
                                    message?.step?.inputType ===
                                      'radioButton' &&
                                    message?.step?.integration == 'Calandly' ? (
                                      <InlineWidget url="https://calendly.com/aashishrawte1/15min" />
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
                                        states={
                                          message?.step?.options?.stateOptions
                                        }
                                        cities={
                                          message?.step?.options?.cityOptions
                                        }
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
                                    {message?.step?.inputType === 'invoice' ||
                                    message?.step?.inputType ===
                                      'invoiceSheet' ? (
                                      <Invoice
                                        options={message?.step?.options}
                                        values={message?.step?.options}
                                        showList={
                                          message?.step?.inputType === 'invoice'
                                        }
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
                          {message.type === 'apiMessage' &&
                                    message?.step?.inputType ===
                                      'radioButton' ? (
                                        <>
                                         <audio src="assets/sounds/notification.wav" autoPlay />
                                         { ( index == messages.length - 1 ) && JSModule?.showRadioSelection ?  
                                         <div className={`${styles?.alignRadioToBottom} ` }>
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
                                          />  </div> : null} 
                                      { JSModule?.conversationLayout && !JSModule?.showRadioSelection ?  
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
                                      />  : null}
                                        </>
                                       
                                    ) : null}
                          <div className={styles?.editbtn}>
                            {message?.type !== 'apiMessage' && JSModule?.conversationLayout &&
                            (messages[index - 1]?.step?.inputType === 'text' ||
                              messages[index - 1]?.step?.inputType ===
                                'number') &&
                            messages?.length - 2 === index &&
                            editableIndex !== index &&
                            !message?.error &&
                            !JSModule?.hideEditButton ? (
                              <Button
                                variant="link"
                                onClick={() => {
                                  setEditableIndex(index);
                                  setContent(message.message);
                                }}
                              >
                                <Pencil
                                  color={
                                    JSModule.editButtonColor
                                      ? JSModule.editButtonColor
                                      : '#FF6900'
                                  }
                                />{' '}
                                {JSModule?.hideEditButton? '' : 'Edit'}
                              </Button>
                            ) : message?.type !== 'apiMessage' &&
                              editableIndex === index &&
                              !message?.error ? (
                              <Button
                                variant="link"
                                onClick={() => {
                                  setEditableIndex(null);
                                  getContent(index);
                                  handleSubmit(content, true);
                                }}
                              >
                                Save
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
                {loading && JSModule?.loaderEnabled && (
                  <span style={{ marginLeft: '10px' }}>
                    Typing
                    <LoadingDots color="#000" />
                  </span>
                )}
              </div>
              <div className={styles?.center}>
                <div className={styles?.cloudform}>
                  {hiddenInput || JSModule?.hideTextArea ? (
                    <></>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                      }}
                    >
                      {typingState && (
                        <span style={{ marginLeft: '10px' }}>
                          Typing
                          <LoadingDots color="#000" />
                        </span>
                      )}
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
                        className={
                          messages[messages.length - 1]?.step?.inputType ===
                          'password'
                            ? `${styles?.textarea} ${styles?.passwordTextarea}`
                            : styles?.textarea
                        }
                      />
                      <button
                        type="submit"
                        disabled={!query || loading}
                        className={styles?.generatebutton}
                        style={{
                          background:
                            JSModule?.sendIcon && !loading
                              ? JSModule?.themeColor
                              : '',
                        }}
                      >
                        {loading ? (
                          <div className={styles?.loadingwheel}>
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
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}}

export default Chatbot;
