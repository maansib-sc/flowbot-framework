import React from 'react';
import { useChatbot } from '@/hooks/useChatbot';
import { ChatHeader } from '@/modules/ChatHeader';
import { SideDrawer } from '@/modules/SideDrawer';
import { ChatMessages } from '@/modules/ChatMessages';
import { ChatInput } from '@/modules/ChatInput';
import 'react-modern-drawer/dist/index.css';
import HamburgerIcon from '@/assets/HamburgerIcon';

const Chatbot: React.FC = () => {
  const {
    messages,
    loading,
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
  } = useChatbot();

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

export default Chatbot;
