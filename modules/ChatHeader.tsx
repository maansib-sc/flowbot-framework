import React, { useContext } from 'react';
import { Button } from '@/components/ui';
import ThemeContext from '@/contexts/ThemeContext';
import ChatIcon from '@/assets/svgs/ChatIcon';



export const ChatHeader: React.FC = () => {
    const { JSModule, styles } = useContext(ThemeContext);

    return (
        <>
            {JSModule?.headerPaneHtml ? (
                <div
                    className={styles['main-header']}
                    dangerouslySetInnerHTML={{ __html: JSModule?.headerPaneHtml }}
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
                                // onClick={() => setPromptModal(true)}
                            >
                                Custom Prompt
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}