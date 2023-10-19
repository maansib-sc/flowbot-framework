import { useRef, useState, useEffect } from 'react';
import Layout from '@/components/layout';
import { Message } from '@/types/chat';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import LoadingDots from '@/components/ui/LoadingDots';
import { Document } from 'langchain/document';
import { useRouter } from 'next/router'
import { Oval } from 'react-loader-spinner'
import { getDefaultPromptTemplate, resetPromptTemplate, submitPromptTemplate } from '@/apiRequests';
import { PromptModal } from '@/components/customPromptModal';
import ChatbotInfo from '@/components/ui/ChatbotInfo';


export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toggleStatus, setToggleStatus] = useState<boolean>(false)
  const [promptModal, setPromptModal] = useState<boolean>(false);
  const [promptTemplate, setPromptTemplate] = useState<string | any>('');
  const router = useRouter();
  const { query: { 'chat-id': chatId } } = router
  const [JSModule, setJSModule] = useState<any>(null);
  const [styles, setStyle] = useState<any>(null);
  const [newChatRoom, setNewChatRoom] = useState<string>('test');
  const [isPublishUrl, setIsPublishUrl] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");

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


  function generateRandomChatRoom(length: number) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let result = 'publish-';
    for (let i = 0; i < length - 5; i++) {
      const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
      result += randomChar;
    }
    for (let i = 0; i < 3; i++) {
      const randomDigit = numbers.charAt(Math.floor(Math.random() * numbers.length));
      result += randomDigit;
    }
    return result;
  }

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
    if (chatId && chatId.includes("publish")) {
      setIsPublishUrl(true)
    } else {
      setIsPublishUrl(false)
    }
    // Check if the 'chat-id' query parameter is present
    if (!urlParams.has('chat-id')) {
      // Query parameter is not present, redirect to a new URL
      window.location.href = `${updatedURL}?chat-id=default`
    }

    const createNewChatRoom = () => {
      const chatroom = generateRandomChatRoom(8)
      if (newChatRoom === "test") {
        setNewChatRoom(chatroom)
      }
    }

    createNewChatRoom()

    // Override the window.alert method to trigger the afterAlert function
    window.alert = function (message) {
      // Display the custom alert message
      const result = window.confirm(message);
      // Check if the user clicked OK on the custom alert
      if (result) {
        setNewChatRoom("test")
      }
    };
  }, []);

  useEffect(() => {
    if (chatId) {
      import(`@/custom/JSFile/${chatId}`).then(module => {
        setJSModule(module)
      }).catch((error) => {
        import(`@/custom/JSFile/default`).then(module => {
          setJSModule(module)
        });
      });
      import(`@/custom/CSSFile/${chatId}/Home.module.css`).then(module => {
        setStyle(module)
      }).catch((error) => {
        import(`@/styles/Home.module.css`).then(module => {
          setStyle(module)
        });
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

  function handleToggleChange() {
    setToggleStatus(!toggleStatus)
  }

  async function resetdefaultPromptTemplate() {
    await resetPromptTemplate(chatId)
    const temp = await getDefaultPromptTemplate(chatId)
    if (temp) {
      setPromptTemplate(temp.data)
    }
  }

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

  useEffect(() => {
    if (chatId) {
      const getDefaultPrompt = async () => {
        const temp = await getDefaultPromptTemplate(chatId)
        if (temp) {
          setPromptTemplate(temp.data)
        }
      }
      getDefaultPrompt()
    }

  }, [chatId])


  return (
    <>
      {chatId && styles ?
        <Layout>
          <div className={`${isPublishUrl ? "flex m-5 justify-center " : "flex m-5"}`}>
            {!isPublishUrl
              &&
              <ChatbotInfo chatBotId={newChatRoom} />
            }

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

                  {!isPublishUrl &&
                    <div className='flex'>
                      <button className={`${styles.buttonWrapper}`} onClick={() => {
                        window.alert(`Copy the Url for chatbot - ${currentUrl}?chat-id=${newChatRoom}`);
                      }
                      }>Publish & Share</button>
                      {/* <span className={styles.comingSoonLabel} style={{ transform: "translate(30%, -60%)" }}>Coming soon</span> */}
                    </div>
                  }
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
