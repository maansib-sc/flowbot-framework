import React, { useEffect, useState } from 'react';
import { useChatbot } from '@/hooks/useChatbot';
import { ChatHeader } from '@/modules/ChatHeader';
import { SidePanel } from '@/modules/SideDrawer';
import { ChatMessages } from '@/modules/ChatMessages';
import { ChatInput } from '@/modules/ChatInput';
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

  // Left panel state for toggle
  const [leftPanelExpanded, setLeftPanelExpanded] = useState(true);

  // Set up window functions immediately (for headerPaneHtml onclick handlers)
  if (typeof window !== 'undefined') {
    (window as any).toggleDrawer = () => setOpen(!open);
    (window as any).toggleLeftPanel = () => setLeftPanelExpanded(prev => !prev);
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).toggleDrawer;
        delete (window as any).toggleLeftPanel;
      }
    };
  }, []);

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
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        <ChatHeader
          drawerOpen={open}
          onDrawerToggle={() => setOpen(!open)}
        />
        <div style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
        }}>
          {/* Left panel from bot config */}
          {JSModule?.leftPanelHtml && leftPanelExpanded && (
            <div
              className={styles?.['sidebar']}
              dangerouslySetInnerHTML={{ __html: JSModule.leftPanelHtml }}
            />
          )}

          {/* Main Content Area */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
            minWidth: 0,
          }}>
            <div style={{
              flex: 1,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'row',
            }}>
              {/* Chat Area */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
              }}>
                <div style={{
                  flex: 1,
                  overflow: 'auto',
                }}>
                  <ChatMessages
                    chatId={String(chatId)}
                    references={references}
                    messages={messages}
                    loading={loading}
                    handleSubmit={handleSubmit}
                    handleFileUpload={handleFileUpload}
                    typingState={typingState}
                    onUploadClick={JSModule?.drawerEnabled ? () => setOpen(true) : undefined}
                  />
                </div>
                <ChatInput
                  query={query}
                  messages={messages}
                  typingState={typingState}
                  loading={loading}
                  onSubmit={handleSubmit}
                  onChange={setQuery}
                />
              </div>
              {/* Right Documents Panel */}
              {JSModule?.drawerEnabled && (
                <SidePanel open={open} setOpen={setOpen} />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Chatbot;