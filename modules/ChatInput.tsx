import React, { useContext, useRef } from "react";
import ThemeContext from "@/contexts/ThemeContext";
import LoadingDots from "@/components/ui/LoadingDots";
import { Message } from "@/types/chat";

interface ChatInputProps {
    onSubmit: () => void
    typingState: boolean
    query: string
    loading: boolean
    onChange: (val: string) => void
    messages: Message[]
}


export const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, typingState, query, loading, onChange, messages }) => {

    const { JSModule, styles } = useContext(ThemeContext);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);


    //prevent empty submissions
    const handleEnter = (e: any) => {
        if (e.key === 'Enter' && query) {
            onSubmit();
        } else if (e.key == 'Enter') {
            e.preventDefault();
        }
    };

    return (
        <div className={styles?.center}>
            <div className={styles?.cloudform}>
                {JSModule?.hideTextArea ? (
                    <></>
                ) : (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSubmit();
                        }}
                    >
                        {typingState && (
                            <span style={{ marginLeft: '10px' }}>
                                Typing
                                <LoadingDots color="#000" />
                            </span>
                        )}
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
                            onChange={(e) => onChange(e.target.value)}
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
    )
}