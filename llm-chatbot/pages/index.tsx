import { useRef, useState, useEffect } from 'react';
import Layout from '@/components/layout';
import styles from '@/styles/Home.module.css';
import { Message } from '@/types/chat';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import LoadingDots from '@/components/ui/LoadingDots';
import { Document } from 'langchain/document';
import axios from 'axios';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selecteduploadFilename, setSelecteduploadFileName] = useState<string | null>(null);
  const [selecteduploadFile, setSelecteduploadFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<any>(null);
  const [pdfList, setPdfList] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  // Add this state at the beginning of your component
  const [trainingInProgress, setTrainingInProgress] = useState(false);
  // const backendConnectorHost = process.env.REACT_APP_BACKEND_CONNECTOR_HOST as string;
  // const backendConnectorKey = process.env.REACT_APP_BACKEND_CONNECTOR_KEY as string;  
  const backendConnectorHost = "client-connector.smarter.codes"
  const backendConnectorKey = "KJaksn9812nOdnAsSCd-1in31"

  async function fetchData() {
    try {
      const response = await axios.get(`https://${backendConnectorHost}/pdf/list`, {
        headers: {
          'API-KEY': backendConnectorKey,
        },
      });
      setApiData(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // Call fetchPdfList function here
    fetchPdfList();
  }, []);


  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [
      {
        message: "I am a Virtual Assistant. I'll assist you with any queries related to documents",
        type: 'apiMessage',
        src: ''
      },
    ],
    history: [],
  });

  const { messages, history } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
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

  function removeSelectedField() {
    setSelecteduploadFile(null)
    setSelecteduploadFileName(null)
  }


  async function fetchPdfList() {
    try {
      const response = await axios.get(`https://${backendConnectorHost}/pdf/list`, {
        headers: {
          'API-KEY': backendConnectorKey,
          //'Connection': 'keep-alive',
          //'sec-ch-ua-mobile': '?0',
        },
      });
      const pdfData = response.data.data;
      setPdfList(pdfData);
    } catch (error) {
      console.log(error);
    }
  }



  const fileInputRef = useRef(null);

  async function handleUpload() {
    // e.preventDefault();
    // Trigger the click event of the file input when the button is clicked
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }


 


  async function uploadFileToApi(file: File) {
    setUploading(true);
    const axios = require('axios');
    const FormData = require('form-data');
  
    let data = new FormData();
    data.append('file', file);
  
    const headers = {
      'API-KEY': backendConnectorKey,
      //'Connection': 'keep-alive',
      'accept': 'application/json',
      //'sec-ch-ua-mobile': '?0'
    };
  
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://${backendConnectorHost}/pdf/upload`, // Replace with your API endpoint
      headers: headers,
      data: data
    };

    try {
      const response = await axios.request(config);     
      console.log(JSON.stringify(response.data));
      await fetchPdfList();
      console.log("await fetchPdfList();");
    } catch (error) {
      console.log(error);
    }finally {
      setUploading(false); // Training process complete
    }
  }

    
  async function handleUntrain() {
    try {
      const response = await axios.get(`https://${backendConnectorHost}/chatbot/untrain`, {
        headers: {
          'API-KEY': backendConnectorKey,
          //'Connection': 'keep-alive',
          //'sec-ch-ua-mobile': '?0',
        },
      });
      console.log(JSON.stringify(response.data));
      // Call the fetchPdfList function here
    await fetchPdfList();
    } catch (error) {
      console.log(error);
    }
  }
  
  async function handleTrain() {
    try {
      setTrainingInProgress(true);
      const response = await axios.get(`https://${backendConnectorHost}/chatbot/train`, {
        headers: {
          'API-KEY': backendConnectorKey,
          //'Connection': 'keep-alive',
          //'sec-ch-ua-mobile': '?0',
        },
      });
      await fetchPdfList();
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
    }finally {
      setTrainingInProgress(false); // Training process complete
    }
  }

  return (
    <>
      <Layout>
            

        <div className="mx-auto chatInterface md:w-3/4 flex flex-col gap-4">
          <h1 className="text-2xl font-bold leading-[1.1] tracking-tighter text-center">
          ChatBot
          </h1>
          
          <main className={styles.main}>
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

                        {(message.type === 'apiMessage') ?
                          <div style={{ "marginRight": "20px" }}><p>{message.src == "gpt4" && message.type === 'apiMessage' ? "GPT4" : "TalkingDB"}</p></div>
                          : null
                        }
                        <div className={styles.markdownanswer}>
                          <ReactMarkdown linkTarget="_blank">
                            {message.message}
                          </ReactMarkdown>
                        </div>
                      </div>
                      {message.sourceDocs && (
                        <div
                          className="p-5"
                          key={`sourceDocsAccordion-${index}`}
                        >
                          <Accordion
                            type="single"
                            collapsible
                            className="flex-col"
                          >
                            {message.sourceDocs.map((doc, index) => (
                              <div key={`messageSourceDocs-${index}`}>
                                <AccordionItem value={`item-${index}`}>
                                  <AccordionTrigger>
                                    <h3>Source {index + 1}</h3>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <ReactMarkdown linkTarget="_blank">
                                      {doc.pageContent}
                                    </ReactMarkdown>
                                    <p className="mt-2">
                                      <b>Source:</b> {doc.metadata.source}
                                    </p>
                                  </AccordionContent>
                                </AccordionItem>
                              </div>
                            ))}
                          </Accordion>
                        </div>
                      )}
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
                        : 'How can I assist you today?'
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={styles.textarea}
                  />

                      <button
                        type="button"
                        disabled={uploading}
                        onClick={handleUpload}
                        className={styles.attachmentButton}
                      >
                        {/* Add your attachment icon */}
                        {uploading ? (
                    <div className={styles.loadingwheel}>
                      <LoadingDots color="#000" />
                    </div>
                  ) : (
                        <img
                          src={'https://cdn1.iconfinder.com/data/icons/bootstrap-vol-3/16/filetype-pdf-512.png'}
                          alt="Attachment Icon"
                          width="20"
                          height="20"
                        />
                        )}
                      </button>
                      {/* Hidden file input element */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="application/pdf"
                        onChange={(e) => {
                          // Handle file selection logic here, e.g., upload the selected file
                          const selectedFile = e.target.files?.[0];
                          if (selectedFile) {
                            setSelecteduploadFile(selectedFile)
                            setSelecteduploadFileName(selectedFile.name)
                            uploadFileToApi(selectedFile);
                          }
                        }}
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

<div className={styles.result}>     
             
<div className={styles.pdfContainer}>

{pdfList.length > 0 && (
<ul className={styles.pdfList}>
{pdfList.map((pdf, index) => (
<li key={index} className={styles.pdfListItem}>

<span className={styles.pdfName}>
   <img
   src="https://cdn4.iconfinder.com/data/icons/files-111/64/pdf-interface-file-format-extension-document-archive-256.png"
   alt="PDF Icon"
   width="29"
   height="29"
   className={styles.pdfIcon}
   />
  
   {pdf}</span>
  </li>
))}
</ul>
)}

</div>        
 </div>


 {/* Buttons */}
 <div className={styles.buttonContainer}>             


 <button
  className={`${styles.trainButton} ${styles.roundedButton}`}
  onClick={handleTrain}
  disabled={trainingInProgress} // Disable the button when training is in progress
>
  <div className={styles.buttonContent}>
    {trainingInProgress ? (
      <LoadingDots color="#fff" /> // Display loading dots
    ) : (
      <>
        <img
          src={'https://cdn0.iconfinder.com/data/icons/cloud-services-1/57/3-64.png'}
          alt="Training Icon"
          width="50"
          height="40"
        />
        <p>Train</p>
      </>
    )}
  </div>
</button>


                  <button className={`${styles.untrainButton} ${styles.roundedButton}`} onClick={handleUntrain}>
                  <div className={styles.buttonContent}>
                    
                  <img
                          src={'https://cdn4.iconfinder.com/data/icons/miscellaneous-261-solid/128/clearing_mop_wipe-out_keeping-clean_broom_duster_garbage-64.png'}
                          alt="Training Icon"
                          width="50"
                          height="40"
                          
                        /><p>UnTrain</p>
                         </div>

                  </button>


             {/* <button className={styles.trainButton}>Train</button>*/}
        {/*<button className={styles.displayButton} onClick={fetchPdfList}>Display</button>*/}
              
 </div>

          </main>
        </div>
        <footer className="m-auto p-4">
          <a href="https://smarter.codes/">
            Powered by TalkingDB
          </a>
        </footer>
      </Layout>
    </>
  );
}
