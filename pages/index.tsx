import { useRef, useState, useEffect } from 'react';
import Layout from '@/components/layout';

import { Message } from '@/types/chat';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import LoadingDots from '@/components/ui/LoadingDots';
import { Document } from 'langchain/document';
import axios from 'axios';
import { useRouter } from 'next/router';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import FileList from '@/components/fileList';
import { Oval } from 'react-loader-spinner'
import { deleteConvList, deletePDFList, getConvList, getDefaultPromptTemplate, getPDFList, resetPromptTemplate, submitPromptTemplate, uploadConv, uploadPDF } from '@/apiRequests';
import WhatsAppList from '@/components/whatsAppList';
import { PromptModal } from '@/components/customPromptModal';


export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selecteduploadFilename, setSelecteduploadFileName] = useState<string | null>(null);
  const [selecteduploadFile, setSelecteduploadFile] = useState<File | null>(null);
  const [selectedConvUploadFile, setSelectedConvUploadFile] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<any>(null);
  // const [pdfList, setPdfList] = useState<string[]>([]);
  const [pdfList, setPdfList] = useState<{ name?: string; training_id?: string; is_trained: boolean }[]>([]);
  const [convList, setConvList] = useState<{ training_id: string; is_trained: boolean }[]>([]);
  const [selectedFileType, setSelectedFileType] = useState<string>("PDF")

  const [uploading, setUploading] = useState(false);
  // Add this state at the beginning of your component
  const [trainingInProgress, setTrainingInProgress] = useState(false);
  const [untrainingInProgress, setUnTrainingInProgress] = useState(false);
  const [showLoader, setShowLoader] = useState<boolean>(false)
  const [toggleStatus, setToggleStatus] = useState<boolean>(false)
  const [promptModal, setPromptModal] = useState<boolean>(false);
  const [promptTemplate, setPromptTemplate] = useState<string | any>('');
  const router = useRouter();
  const { query: { 'chat-id': chatId } } = router
  const [JSModule, setJSModule] = useState<any>(null);
  const [styles, setStyle] = useState<any>(null);

  useEffect(() => {
    // Get the URL search parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Check if the 'chat-id' query parameter is present
    if (!urlParams.has('chat-id')) {
      // Query parameter is not present, redirect to a new URL
      window.location.href = `https://dev.document-chatbot.hybrid.chat/?chat-id=default`
    }
  }, []);


  useEffect(() => {
    // Call fetchPdfList function here
    if (chatId) {
      fetchPdfList();
      import(`@/custom/JSFile/${chatId}`).then(module => {
        setJSModule(module)
      });
      import(`@/custom/CSSFile/${chatId}/Home.module.css`).then(module => {
        setStyle(module)
      });

    }
  }, [chatId]);

  useEffect(() => {
    setMessageState({
      messages: [
        {
          message: JSModule?.getWelcomeMessage(),
          type: 'apiMessage',
          src: ''
        },
      ],
      history: [],
    })
  }, [JSModule])


  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [
      {
        message: JSModule?.getWelcomeMessage(),
        type: 'apiMessage',
        src: ''
      },
    ],
    history: [],
  });

  const { messages, history } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const autoResizeTextarea = () => {
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset the height to auto to determine the new height
      textarea.style.height = textarea.scrollHeight + 'px'; // Set the new height
    }
  };


  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  useEffect(() => {
    autoResizeTextarea()
  }, [query])

  //handle form submission
  async function handleSubmit(e: any) {
    e.preventDefault();

    setError(null);

    if (!query) {
      alert('Please input a question');
      return;
    }

    const question = query.trim();

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
          src: "test"
        },
      ],
    }));

    setLoading(true);
    setQuery('');

    try {
      const response = await fetch(`/api/chat?pinecone_name_space=${chatId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          enablegptfallback: toggleStatus ? 1 : 0,
          history,
        }),
      });
      const data = await response.json();
      console.log('data', data);

      if (data.error) {
        setError(data.error);
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
            },
          ],
          history: [...state.history, [question, data.text]],
        }));
      }
      console.log('messageState', messageState);

      setLoading(false);

      //scroll to bottom
      messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
    } catch (error) {
      setLoading(false);
      setError('An error occurred while fetching the data. Please try again.');
      console.log('error', error);
    }
  }

  //prevent empty submissions
  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && query) {
      handleSubmit(e);
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };

  const fileInputRef = useRef(null);

  async function fetchPdfList() {
    try {
      setPdfList([])
      const temp = await getDefaultPromptTemplate(chatId)
      if (temp) {
        setPromptTemplate(temp.data)
      }
      const pdfData = await getPDFList(chatId)
      const conList = await getConvList(chatId)
      setPdfList([...pdfData, ...conList]);
      setSelecteduploadFile(null)
    } catch (error) {
      console.log(error);
    }
  }

  async function uploadPDFFile() {
    setUploading(true);
    const FormData = require('form-data');
    let data = new FormData();
    data.append('file', selecteduploadFile);

    try {
      await uploadPDF(chatId, data)
      // console.log("upload file response ==>", response.data);
      setTimeout(async () => {
        await fetchPdfList();
        setShowLoader(false)
      }, 2000)
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false); // Training process complete
    }
  }

  async function handleUntrain() {
    setUnTrainingInProgress(true);
    try {
      await deletePDFList(chatId)
      // Call the fetchPdfList function here
      await fetchPdfList();
    } catch (error) {
      console.log(error);
    } finally {
      setUnTrainingInProgress(false);
      setShowLoader(false)
    }
  }

  const fileInputRefDoc = useRef(null);
  const handlePDFFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setShowLoader(true);
      setSelectedFileType('PDF')
      setSelecteduploadFile(selectedFile)
      setTrainingInProgress(true)
    }
  };


  function addEllipsis(str: string, maxLength: number) {
    if (str.length <= maxLength) {
      return str;
    } else {
      return str.substring(0, maxLength) + "...";
    }
  }

  function handleToggleChange() {
    setToggleStatus(!toggleStatus)
  }


  // whatsApp

  // async function fetchConvList() {
  //   try {
  //     const conList = await getConvList(chatId)
  //     // setConvList(conList);
  //     setPdfList((previousValue) => [...previousValue, ...conList])
  //     setSelectedConvUploadFile(null)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async function uploadConvToApi() {
    setUploading(true);
    setShowLoader(true)
    const FormData = require('form-data');

    let data = new FormData();
    if (selectedConvUploadFile) {

      [...selectedConvUploadFile].forEach((file, i) => {
        data.append(`training_files`, file, file.name)
      })
    }

    try {
      await uploadConv(chatId, data)
      setSelectedConvUploadFile(null);
      setTimeout(async () => {
        await fetchPdfList();
        setShowLoader(false)
      }, 2000)
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false); // Training process complete
    }
  }

  async function handleDeleteNameSpace() {
    try {
      await deleteConvList(chatId)
      // Call the fetchPdfList function here
      await fetchPdfList();
    } catch (error) {
      console.log(error);
    } finally {
      setUnTrainingInProgress(false);
      setShowLoader(false)
    }
  }

  async function resetdefaultPromptTemplate() {
    await resetPromptTemplate(chatId)
    const temp = await getDefaultPromptTemplate(chatId)
    if (temp) {
      setPromptTemplate(temp.data)
    }
  }

  useEffect(() => {
    if (selectedFileType === "PDF" && selecteduploadFile) {
      uploadPDFFile()
    } else if (selectedFileType === "WHATSAPP" && selectedConvUploadFile) {
      uploadConvToApi()
    }
  }, [selectedFileType, selecteduploadFile, selectedConvUploadFile])

  const onPromptChange = (value: string) => {
    setPromptTemplate(value)
  }

  const updatePrompt = async () => {
    await submitPromptTemplate(chatId, { "template_instructions": promptTemplate })
    const temp = await getDefaultPromptTemplate(chatId)
    if (temp) {
      setPromptTemplate(temp.data)
    }
  }


  async function clearAllPdfList() {
    setShowLoader(true);
    setPdfList([])
    await handleUntrain()
    await handleDeleteNameSpace()
  }


  // JS file change

  const handleJSFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (chatId) {
      try {
        const data = new FormData()
        data.set('chatId', chatId)
        data.set('file', file)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: data
        })
      } catch (error) {
        console.log("error from handleJSFileChange ==> ", error)
      }
    }
  };

  return (
    <>
      {chatId && styles ?
        <Layout>
          <div className="flex m-5">
            <div style={{ padding: "1rem", display: "flex", flexDirection: "column", maxWidth: "355px" }}>
              <h1 className={styles.title}>TRAIN AI</h1>
              <p>from the options below.</p>
              <div className="mt-4 mb-4 flex flex-col">
                <div className='flex mb-6'>

                  <label className="w-64 flex justify-between items-center px-2 py-2 text-blue rounded-lg  tracking-wide  border border-blue  cursor-pointer">
                    <input type='file' accept='.pdf' className="hidden" onChange={handlePDFFileChange} ref={fileInputRef} />
                    <span className="mt-2 text-base leading-normal">Upload a Doc</span>
                    <svg className="w-8 h-8 pt-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                    </svg>
                  </label>
                  <label className="w-64 flex justify-between  ml-2 items-center px-2 py-2 text-blue rounded-lg  tracking-wide  border border-blue  cursor-pointer">
                    <input type='file' className="hidden" accept='.txt' placeholder={"Upload conv."} onChange={(e) => { setSelectedConvUploadFile(e.target.files); setSelectedFileType("WHATSAPP") }} multiple />
                    <span className="mt-2 text-base leading-normal">Upload Conv.</span>
                    <svg className="w-8 h-8 pt-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                    </svg>
                  </label>
                </div>
                <div className='flex'>

                  <label className="w-64 flex justify-between items-center px-2 py-2 text-blue rounded-lg  tracking-wide  border border-blue  ">
                    <input type="file" accept='.js' className="hidden" onChange={handleJSFileChange} />
                    <span className="mt-2 text-base leading-normal">Upload JS</span>
                    <svg className="w-8 h-8 pt-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                    </svg>
                  </label>
                  <label className="w-64 flex justify-between  ml-2 items-center px-2 py-2 text-blue rounded-lg  tracking-wide  border border-blue  ">
                    <input type="file" accept='.css' className="hidden" onChange={handleJSFileChange} />
                    <span className="mt-2 text-base leading-normal">Upload CSS</span>
                    <svg className="w-8 h-8 pt-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                    </svg>
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", borderTop: "1px solid black", paddingTop: "2rem" }} className='mt-10'>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%"
                }}>

                  <h1 className={styles.title}>Uploaded Doc</h1>
                  {pdfList.length !== 0 && !trainingInProgress
                    ?
                    <p onClick={() => clearAllPdfList()} className='cursor-pointer font-semibold '>Clear All</p>
                    :
                    <p className='font-semibold text-gray-400'>Clear All</p>
                  }
                </div>
                <div style={{
                  display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", height: "100%",
                  minHeight: "250px"
                }}>
                  {
                    pdfList?.length > 0 && !showLoader ?

                      <div style={{ width: "100%" }}>
                        {
                          pdfList.map((item, index) => {
                            return (
                              <FileList selectedFileType={selectedFileType} filename={item.name || item.training_id} index={index} trained={item.is_trained} setTrainingInProgress={setTrainingInProgress} />
                            )
                          }
                          )
                        }
                      </div>
                      :
                      showLoader ?
                        <div style={{ display: "flex", width: "100%", height: "100%", justifyContent: "center", position: "absolute", top: "50%" }}>
                          <Oval
                            height={40}
                            width={40}
                            color="#338bff"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                            ariaLabel='oval-loading'
                            secondaryColor="#338bff"
                            strokeWidth={4}
                            strokeWidthSecondary={4}

                          />
                        </div>
                        :
                        <>
                          <Image
                            src="/pdf_upload.png"
                            alt="AI"
                            width="55"
                            height="55"
                            priority
                            className='mt-2'
                          />
                          <div className='p-8'>Please upload a Doc to train the AI automatically</div>
                        </>
                  }

                </div>

              </div>
            </div>

            <main className={styles.main}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem", alignItems: "center" }}>
                <h1 className={styles.title}>{JSModule?.getTitle()}</h1>
                <div className='flex items-center '>

                  <label className="relative inline-flex items-center cursor-pointer" >
                    <input type="checkbox" value="" className="sr-only peer" checked={toggleStatus}
                      onChange={() => handleToggleChange()} />
                    {/* <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div> */}
                    {/* <span className="ml-3 mr-3 text-sm font-medium text-gray-900 dark:text-black-800">Enable GPT Fallback</span> */}
                  </label>
                  <button className={`${styles.buttonWrapper} bg-white mr-4`} onClick={() => setPromptModal(true)}>Custom Prompt</button>
                  {promptModal && <PromptModal onChangeHandler={onPromptChange} onClose={(val: string | undefined) => { val === "submit" ? updatePrompt() : null; setPromptModal(false) }} resetTemplate={resetdefaultPromptTemplate} data={promptTemplate} onSubmit={() => updatePrompt()} />}

                  <div className='flex'>

                    <button className={`${styles.buttonWrapper} bg-gray-200`}>Publish & Share</button>
                    <span className={styles.comingSoonLabel} style={{ transform: "translate(30%, -60%)" }}>Coming soon</span>
                  </div>
                </div>
              </div>
              <div className={styles.cloud}>
                <div ref={messageListRef} className={styles.messagelist}>
                  {messages.map((message, index) => {
                    let icon;
                    let className;
                    if (message.type === 'apiMessage') {
                      icon = (
                        <Image
                          key={index}
                          src="/bot-image.png"
                          alt="AI"
                          width="40"
                          height="40"
                          className={styles.boticon}
                          priority
                        />
                      );
                      className = styles.apimessage;
                    } else {
                      icon = (
                        <Image
                          key={index}
                          src="/usericon.png"
                          alt="Me"
                          width="30"
                          height="30"
                          className={styles.usericon}
                          priority
                        />
                      );
                      // The latest message sent by the user will be animated while waiting for a response
                      className =
                        loading && index === messages.length - 1
                          ? styles.usermessagewaiting
                          : styles.usermessage;
                    }
                    return (
                      <>
                        <div key={`chatMessage-${index}`} className={className}>
                          {icon}

                          <div className={styles.markdownanswer}>
                            <ReactMarkdown linkTarget="_blank">
                              {message.message}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
              <div className={styles.center}>
                <div className={styles.cloudform}>
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
                          : JSModule?.getInputPlaceholder()
                      }
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className={styles.textarea}
                    />



                    <button
                      type="submit"
                      disabled={loading}
                      className={styles.generatebutton}
                    >
                      {loading ? (
                        <div className={styles.loadingwheel}>
                          <LoadingDots color="#000" />
                        </div>
                      ) : (
                        // Send icon SVG in input field
                        <svg
                          viewBox="0 0 20 20"
                          className={styles.svgicon}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                        </svg>
                      )}
                    </button>
                  </form>
                </div>
              </div>
              {error && (
                <div className="border border-red-400 rounded-md p-4">
                  <p className="text-red-500">{error}</p>
                </div>
              )}


            </main>
          </div>
        </Layout>
        :
        <div style={{ display: "flex", width: "100%", height: "100%", justifyContent: "center", position: "absolute", top: "50%" }}>



          <Oval
            height={80}
            width={80}
            color="#338bff"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="#338bff"
            strokeWidth={4}
            strokeWidthSecondary={4}

          />
        </div>
      }
    </>
  );
}
