import React from 'react';
import { useChatbot } from '@/hooks/useChatbot';
import { ChatHeader } from '@/modules/ChatHeader';
import { SideDrawer } from '@/modules/SideDrawer';
import { ChatMessages } from '@/modules/ChatMessages';
import { ChatInput } from '@/modules/ChatInput';
import 'react-modern-drawer/dist/index.css';
import { Loader } from '@/components/ui';

const Chatbot: React.FC = () => {
  const {
    messages,
    loading,
    botLoading,
    query,
    setQuery,
    typingState,
    handleSubmit,
    handleInputChange,
    handleFileUpload,
    JSModule,
    open,
    setOpen,
    styles,
    references,
    chatId
  } = useChatbot();

  if (botLoading || !(JSModule?.enabled)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div style={{ width: '150px', height: '150px' }}>
          <Loader loader="https://lottie.host/d1fd738a-f930-465e-b6ff-cf2412f791db/8r36ZWTWb2.json" />
        </div>
      </div>
    )
  }
  else {
    return (
      <div className={styles['container']}>
        {JSModule?.drawerEnabled &&
          <SideDrawer open={open} setOpen={(val) => setOpen(val)} />
        }
        {JSModule?.enabled && (
          <div
            className={styles['sidebar']}
            dangerouslySetInnerHTML={{ __html: JSModule.leftPanelHtml }}
          />
        )}
        <div className={styles['main-content']}>
          <ChatHeader />
          <div className={styles['main']}>
            <ChatMessages
              chatId={String(chatId)}
              references={references}
              messages={messages}
              loading={loading}
              handleSubmit={handleSubmit}
              handleFileUpload={handleFileUpload}
              typingState={typingState}
            />
            <ChatInput
              query={query}
              messages={messages}
              typingState={typingState}
              loading={loading}
              onSubmit={handleSubmit}
              onChange={setQuery}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Chatbot;