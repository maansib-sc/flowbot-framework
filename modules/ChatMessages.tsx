import Libby from "@/assets/svgs/Libby";
import You from "@/assets/svgs/You";
import ToolTip from "@/assets/svgs/icons/ToolTip";
import LoadingDots from "@/components/ui/LoadingDots";
import ThemeContext from "@/contexts/ThemeContext";
import Image from "next/image";
import { Fragment, useContext, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Message } from '@/types/chat';
import rehypeRaw from 'rehype-raw';
import { DynamicComponent } from "@/components/DynamicComponent";

interface ChatMessageProps {
    typingState: boolean
    loading: boolean
    handleSubmit: (val?: string) => void
    handleFileUpload: (file: FileList) => void
    messages: Message[]
}


export const ChatMessages: React.FC<ChatMessageProps> = ({ messages, loading, handleSubmit, typingState, handleFileUpload }) => {

    const { JSModule, styles } = useContext(ThemeContext);
    const messageListRef = useRef<HTMLDivElement>(null);


    const createMarkup = (question: any) => {
        return { __html: question };
    };

    const askQuestion = () => {
        handleSubmit('contact us');
    }

    return (


        <div className={styles["cloud"]}>
            <div ref={messageListRef} className={styles["messagelist"]}>
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
                                        {!JSModule?.hideBotIcon &&
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
                                                    minWidth: 'auto',
                                                    maxWidth: 'auto',
                                                    marginLeft: (!(index === messages.length - 1 || (index < messages.length - 1 && messages[index + 1]?.type !== 'apiMessage'))) && JSModule?.conversationLayout ? '2rem' : '',
                                                    width: '100%',
                                                    alignSelf: message?.type == 'userMessage' && JSModule?.conversationLayout ?
                                                        'flex-end' :
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
                                                        {!message?.step?.injectionType &&
                                                            <div
                                                                
                                                                onInput={() => console.log("typing ...")}
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
                                                            </div>}
                                                        {message?.step?.injectionType === 'contactUs' &&
                                                            <div>
                                                                <div dangerouslySetInnerHTML={createMarkup(message.message)} />
                                                                <span style={{ cursor: 'pointer' }} onClick={askQuestion}><b><u>Contact Us</u></b></span>
                                                            </div>
                                                        }
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
                                                {(JSModule?.conversationLayout && ((message?.step?.inputType === 'await' && index === messages.length - 1) || (typingState && index === messages.length - 1) || (loading && index === messages.length - 1))) &&
                                                    <span
                                                        className={`${styles?.chat_container_left}`}
                                                        style={{
                                                            width: '40px',
                                                            marginTop: '20px',
                                                            backgroundColor: '#F6F5F5'
                                                        }}
                                                    >
                                                        <LoadingDots color="#000" />
    
                                                    </span>}
                                                {JSModule?.conversational && (
                                                    <div className={styles?.extraContainer}>
                                                        {/* component */}
                                                        <DynamicComponent 
                                                            messages={messages}
                                                            message={message}
                                                            index={index}
                                                            handleSubmit={(val) => handleSubmit(val)}
                                                            handleFileUpload={handleFileUpload}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                        )
                })}
            </div>
        </div>
    )
}
